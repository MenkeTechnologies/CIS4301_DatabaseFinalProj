const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const app = express();
const cors = require('cors');
const helmet = require('helmet');

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

//{{{                    MARK:DB
//**************************************************************

const oracledb = require('oracledb');
const lib = require('./lib/lib');
const queries = require('./lib/queries');

// Need to install the oracle client libraries
// https://oracle.github.io/node-oracledb/INSTALL.html
try {
  oracledb.initOracleClient({ libDir: lib.config.client });
} catch (err) {
  console.error('Trouble with the oracle client installation.');
  console.error(err);
  process.exit(1);
}
//}}}***********************************************************


//{{{                    MARK:routes
//**************************************************************
app.post('/handle/:weeks/:topRows', function (req, res) {

  console.log(lib.REQ_DELIM);

  const weeks = req.params.weeks || lib.NUM_WEEKS;
  const topRows = req.params.topRows || lib.NUM_ROWS;
  const parsedBody = lib.transformReqBody(req.body);

  console.log('transformedBody:', parsedBody);

  req.parsedBody = parsedBody;

  if (parsedBody.dataSelValue.cases) {

    queries.cases(req, res, weeks, topRows);

  } else if (parsedBody.dataSelValue.numTrips) {

    res.status(400).send('numTrips not implemented');

  } else if (parsedBody.dataSelValue.popHome) {

    queries.popHome(req, res, weeks, topRows);

  } else {

    res.status(400).send('dataSelValue.? must be true');
    console.log(lib.REQ_DELIM);

  }

});

app.get('/', function (req, res) {
  res.send('The server is working. Hooray!');
});
//}}}***********************************************************


//{{{                    MARK:app
//**************************************************************
const port = process.env.PORT || 8000;

process.on('SIGINT', () => {
  console.log(`Death by SIGINT`);
  process.exit(0);
});

app.listen(port, () => {
  lib.getUsername();
  console.log(`Listening on port: ${port}`);
});
//}}}***********************************************************

