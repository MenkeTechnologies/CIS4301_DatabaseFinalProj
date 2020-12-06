const oracledb = require('oracledb');

//{{{                    MARK:Vars
//**************************************************************
const _secrets = require('./_secrets.json');
const NUM_ROWS = 5;
const NUM_WEEKS = 3;
const QUERY_DELIM = '\n------------------------------------------------------------------------------------------------\n';
const REQ_DELIM = '\n=================================================================================================\n';

const config = {
  user: _secrets['DB_USER'],
  password: _secrets['DB_PASS'],
  connectString: _secrets['DB_CONS'],
  client: _secrets['DB_CLIENT_PATH'],
};
//}}}***********************************************************

//{{{                    MARK:Fn lib
//**************************************************************
function transformReqBody (body) {
  let stateStr;
  if (body.stateVal) {
    stateStr = `'${body.stateVal}'`;
  } else {
    stateStr = `'ANY'`;
  }

  const parsedObj = {
    periodVal: body.periodVal || '7',
    orderVal: body.orderVal ? body.orderVal.toUpperCase() : 'ASC',
    scopeVal: body.scopeVal ? body.scopeVal.toUpperCase() : 'STATE',
    stateVal: stateStr,
    regionVal: body.regionVal ? body.regionVal.toUpperCase() : 'ANY',
    restrictionVal: body.restrictionVal
      ? body.restrictionVal.toUpperCase()
      : 'ANY',
    dataSelValue: {
      cases: body.dataSelValue === 'cases',
      numTrips: body.dataSelValue === 'numTrips',
      popHome: body.dataSelValue === 'popHome'
    },
  };

  return parsedObj;
}

function logQuery (query, parms) {
  console.log(QUERY_DELIM);
  console.log(query);
  let values = Object.values(parms);
  console.log('params =', values);
  console.log(QUERY_DELIM);
}

function runQuery (req, res, query, parms) {

  handleDatabaseOperation(req, res, function (request, response, connection) {

    logQuery(query, parms);
    let values = Object.values(parms);
    connection.execute(query, values, {
      // Return the result as Object
      outFormat: oracledb.OBJECT,
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
          console.log('db response is ready ', value);
          response.writeHead(200, { 'Content-Type': 'application/json' });
          response.end(JSON.stringify(value));
        }
        doRelease(connection);
        console.log(REQ_DELIM);
      },
    );
  });
}

function handleDatabaseOperation (request, response, callback) {
  console.log('executing query, please wait ...');
  oracledb.getConnection(config,
    function (err, connection) {
      if (err) {
        console.log('Error in acquiring connection ...');
        console.log('Error message', err.message);

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
}

function doRelease (connection) {
  connection.release(
    function (err) {
      if (err) {
        console.error(err.message);
      }
    });
}

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

//}}}***********************************************************

module.exports = {
  runQuery,
  config,
  getUsername,
  transformReqBody,
  NUM_ROWS,
  NUM_WEEKS,
  QUERY_DELIM,
  REQ_DELIM,
};
