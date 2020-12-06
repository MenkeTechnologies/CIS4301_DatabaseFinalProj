// CD 12/5/2020
//--Query #1
const oracledb = require('oracledb');
const _secrets = require('./_secrets.json');

const config = {
  user: _secrets['DB_USER'],
  password: _secrets['DB_PASS'],
  connectString: _secrets['DB_CONS'],
  client: _secrets['DB_CLIENT_PATH'],
};

function transformReqBody (body) {
  let stateStr;
  if (body.stateVal) {
    stateStr = `'${body.stateVal}'`;
  } else {
    stateStr = 'ANY';
  }

  const defaultObj = {
    periodVal: body.periodVal || '7',
    orderVal: body.orderVal ? body.orderVal.toUpperCase() : 'ASC',
    scopeVal: body.scopeVal || 'state',
    stateVal: stateStr,
    regionVal: body.regionVal || 'ANY',
    restrictionVal: body.restrictionVal || 'ANY',
    dataSelValue: {
      cases: body.dataSelValue.cases || false,
      numTrips: body.dataSelValue.numTrips || false,
      popHome: body.dataSelValue.popHome || false,
    },
  };

  return defaultObj;
}

function logQuery (query, parms) {
  let delim = '------------------------------------------------------------------------------------------------';
  console.log(delim);
  console.log(query);
  let values = Object.values(parms);
  console.log('params = ' + values);
  console.log(delim);
}

function runQuery (req, res, query, parms) {

  handleDatabaseOperation(req, res, function (request, response, connection) {

    logQuery(query, parms);
    let values = Object.values(parms);
    connection.execute(query, values, {
        outFormat: oracledb.OBJECT, // Return the result as Object
      }, function (err, result) {
        if (err) {
          console.log(
            `Error ${err.message} in execution of select statement ${query} `);
          response.writeHead(500, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify({
              status: 500,
              message: `Error: ${err.message}`,
              detailed_message: err.message,
            }),
          );
        } else {
          let value = {
            type: req.parsedBody.dataSelValue,
            data: [
              ...result.rows,
            ],
          };
          console.log('db response is ready ' + value);
          response.writeHead(200, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify(value));
        }
        doRelease(connection);
      },
    );
  });
}

function handleDatabaseOperation (request, response, callback) {
  console.log(request.method + ':' + request.url);

  console.log('Handle request: ' + request.url);
  //var connectString = process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR.replace("PDB1", "demos");
  //console.log('ConnectString :' + connectString);
  oracledb.getConnection(config,
    function (err, connection) {
      if (err) {
        console.log('Error in acquiring connection ...');
        console.log('Error message ' + err.message);

        // Error connecting to DB
        response.writeHead(500, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({
            status: 500,
            message: 'Error connecting to DB',
            detailed_message: err.message,
          },
        ));
        return;
      }
      // do with the connection whatever was supposed to be done
      console.log('Connection acquired ; go execute ');
      callback(request, response, connection);
    });
}//handleDatabaseOperation

function doRelease (connection) {
  connection.release(
    function (err) {
      if (err) {
        console.error(err.message);
      }
    });
}

// end of CD 12/5/2020

// -- End Routes ----

// test database connection
async function getUsername () {
  let conn;

  try {
    conn = await oracledb.getConnection(config);

    const result = await conn.execute(
      `SELECT sys_context('USERENV', 'SESSION_USER') as "USER NAME"
       FROM dual`,
    );

    console.log('username: ' + result.rows[0]);
  } catch (err) {
    console.log('Connection unsuccessful.', err);
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close();
    }
  }
}

module.exports = {
  runQuery,
  config,
  getUsername,
  transformReqBody,
};
