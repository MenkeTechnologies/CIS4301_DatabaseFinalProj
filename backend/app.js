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

app.get('/query01/:weeks/:toprows', function (req, res) {
  const weeks = req.params.weeks
  const toprows = req.params.toprows

  const selectStatement =
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

  lib.runQuery(req, res, selectStatement, { weeks, toprows })
})

lib.getUsername()

// -- End Database ----

const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Listening on port: ${port}`)
})
