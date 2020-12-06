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
const lib = require('./lib/lib')
const queries = require('./lib/queries')

try {
  oracledb.initOracleClient({ libDir: lib.config.client })
} catch (err) {
  console.error('Trouble with the oracle client installation.')
  console.error(err)
  process.exit(1)
}

// TODO: break this all up into files later

// -- Begin Routes ----

app.get('/', function (req, res) {
  res.send('The server is working. Hooray!')
})



app.post('/handle/:weeks/:topRows', function (req, res) {
  const weeks = req.params.weeks;
  const topRows = req.params.topRows;
  const parsedBody = lib.transformReqBody(req.body);
  req.parsedBody = parsedBody;

  let selectStatement;

  if (parsedBody.dataSelValue.cases) {

    if (parsedBody.scopeVal === 'NATION') {

      selectStatement = queries.getCovidQueryByNation(parsedBody.periodVal, parsedBody.periodVal + '_DAY_MAX_MOVING_AVERAGE', parsedBody.orderVal)
      return lib.runQuery(req, res, selectStatement, { weeks, topRows })
    }

    if (parsedBody.stateVal === "'ANY'") {

      selectStatement = queries.getCovidQueryAllStates(parsedBody.periodVal, parsedBody.periodVal + '_DAY_MAX_MOVING_AVERAGE', parsedBody.orderVal)
    } else {
      selectStatement = queries.getCovidQueryByState(parsedBody.periodVal, parsedBody.periodVal + '_DAY_MAX_MOVING_AVERAGE', parsedBody.orderVal, parsedBody.stateVal)
    }

    return lib.runQuery(req, res, selectStatement, { weeks, topRows })
  } else if (parsedBody.dataSelValue.numTrips) {

  } else if (parsedBody.dataSelValue.popHome) {

  } else {
     res.status(400).send("dataSelValue.? must be true");
  }

})

// -- End Database ----

const port = process.env.PORT || 8000

app.listen(port, () => {
  lib.getUsername()
  console.log(`Listening on port: ${port}`)
})
