const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

// -- Begin Database ----

// Need to install the oracle client libraries
// https://oracle.github.io/node-oracledb/INSTALL.html#instwin

const oracledb = require('oracledb')
const _secrets = require('./_secrets.json') // json file with username/pw/etc.

try {
  oracledb.initOracleClient({ libDir: _secrets['DB_CLIENT_PATH'] })
} catch (err) {
  console.error('Trouble with the oracle client installation.')
  console.error(err)
  process.exit(1)
}

const config = {
  user: _secrets['DB_USER'],
  password: _secrets['DB_PASS'],
  connectString: _secrets['DB_CONS'],
}

// TODO: break this all up into files later

// -- Begin Routes ----

app.get('/', function (req, res) {
  res.send('The server is working. Hooray!')
})

// CD 12/5/2020
//--Query #1
//--Top :toprows states has with COVID-19 cases in terms of 7-day average in the past :weeks weeks
app.get('/query01/:weeks/:toprows', function (req, res) {
  var weeks = req.params.weeks
  var toprows = req.params.toprows

  handleDatabaseOperation(req, res, function (request, response, connection) {
    var selectStatement =
      `SELECT STATE, MAX("7_DAY_MOVING_AVERAGE") AS "MAX_7_DAY_MOVING_AVERAGE"
       FROM (
                SELECT STATE,
                       AVG(TOT_CASES) OVER (
                           PARTITION BY STATE
                           ORDER BY SUBMISSION_DATE
                           ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS "7_DAY_MOVING_AVERAGE"
                FROM COVID_19_CASES
                WHERE SUBMISSION_DATE BETWEEN (SELECT MAX(SUBMISSION_DATE) + (:weeks * -7)
                                               FROM COVID_19_CASES) AND
                          (SELECT MAX(SUBMISSION_DATE)
                           FROM COVID_19_CASES)
            )
       GROUP BY STATE
       ORDER BY "MAX_7_DAY_MOVING_AVERAGE" DESC FETCH FIRST :toprows ROWS ONLY`

    connection.execute(selectStatement
      , [weeks, toprows], {
        outFormat: oracledb.OBJECT, // Return the result as Object
      }, function (err, result) {
        if (err) {
          console.log('Error in execution of select statement' + err.message)
          response.writeHead(500, { 'Content-Type': 'application/json' })
          response.end(JSON.stringify({
              status: 500,
              message: 'Error getting top ' + toprows + ' in the past ' + weeks,
              detailed_message: err.message,
            }),
          )
        } else {
          console.log('db response is ready ' + result.rows)
          response.writeHead(200, { 'Content-Type': 'application/json' })
          response.end(JSON.stringify(result.rows))
        }
        doRelease(connection)
      },
    )
  })
})

function handleDatabaseOperation (request, response, callback) {
  console.log(request.method + ':' + request.url)
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE')
  response.setHeader('Access-Control-Allow-Headers',
    'X-Requested-With,content-type')
  response.setHeader('Access-Control-Allow-Credentials', true)

  console.log('Handle request: ' + request.url)
  //var connectString = process.env.DBAAS_DEFAULT_CONNECT_DESCRIPTOR.replace("PDB1", "demos");
  //console.log('ConnectString :' + connectString);
  oracledb.getConnection(config,
    function (err, connection) {
      if (err) {
        console.log('Error in acquiring connection ...')
        console.log('Error message ' + err.message)

        // Error connecting to DB
        response.writeHead(500, { 'Content-Type': 'application/json' })
        response.end(JSON.stringify({
            status: 500,
            message: 'Error connecting to DB',
            detailed_message: err.message,
          },
        ))
        return
      }
      // do with the connection whatever was supposed to be done
      console.log('Connection acquired ; go execute ')
      callback(request, response, connection)
    })
}//handleDatabaseOperation

function doRelease (connection) {
  connection.release(
    function (err) {
      if (err) {
        console.error(err.message)
      }
    })
}

// end of CD 12/5/2020

// -- End Routes ----

// test database connection
async function getUsername () {
  let conn

  try {
    conn = await oracledb.getConnection(config)

    const result = await conn.execute(
      `SELECT sys_context('USERENV', 'SESSION_USER') as "USER NAME"
       FROM dual`,
    )

    console.log('username: ' + result.rows[0])
  } catch (err) {
    console.log('Connection unsuccessful.', err)
  } finally {
    if (conn) { // conn assignment worked, need to close
      await conn.close()
    }
  }
}

getUsername()

// -- End Database ----

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})
