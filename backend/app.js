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
// -- Begin Routes ----

app.get('/', function (req, res) {
  res.send('The server is working. Hooray!')
})



app.post('/handle/:weeks/:topRows', function (req, res) {

  const weeks = req.params.weeks
  const topRows = req.params.topRows
  const parsedBody = lib.transformReqBody(req.body)

  req.parsedBody = parsedBody

  if (parsedBody.dataSelValue.cases) {

    return queries.cases(req, res, weeks, topRows)

  } else if (parsedBody.dataSelValue.numTrips) {

    return res.status(400).send('numTrips not implemented')

  } else if (parsedBody.dataSelValue.popHome) {

    return queries.popHome(req, res, weeks, topRows)

  } else {

    return res.status(400).send('dataSelValue.? must be true')

  }

})

// -- End Database ----

const port = process.env.PORT || 8000

app.listen(port, () => {
  lib.getUsername()
  console.log(`Listening on port: ${port}`)
})
