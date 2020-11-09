const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


// TODO: break this all up into files later

// -- Begin Routes ----

app.get('/', function(req, res) {
    res.send('The server is working. Hooray!');
});

// -- End Routes ----

// -- Begin Database ----

// Need to install the oracle client libraries
// https://oracle.github.io/node-oracledb/INSTALL.html#instwin

const oracledb = require('oracledb');
const _secrets = require('./_secrets.json'); // json file with username/pw/etc.

try {
    oracledb.initOracleClient({libDir: _secrets['DB_CLIENT_PATH']});
} catch (err) {
    console.error('Trouble with the oracle client installation.');
    console.error(err);
    process.exit(1);
}

const config = {
    user: _secrets['DB_USER'],
    password: _secrets['DB_PASS'],
    connectString: _secrets['DB_CONS']
}

// test database connection
async function getUsername() {
    let conn;
  
    try {
      conn = await oracledb.getConnection(config);
  
      const result = await conn.execute(
        `SELECT sys_context('USERENV','SESSION_USER') as "USER NAME" FROM dual;`
      );
  
      console.log(result.rows[0]);
    } catch (err) {
      console.log('Connection unsuccessful.', err);
    } finally {
      if (conn) { // conn assignment worked, need to close
        await conn.close();
      }
    }
  }
  
  getUsername();

// -- End Database ----

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Listening on port: ${port}`)
});
