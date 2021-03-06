const lib = require('./lib');

//{{{                    MARK:POP HOME QUERIES
//**************************************************************
function getPopHomeQueryByState (days, title, order, states) {

  let titleHome = title + '_AT_HOME';
  let titleNotHome = title + '_NOT_HOME';

  // language=Oracle
  const selectStatement =
    `SELECT STATE_POSTAL_CODE      as STATE
          , MAX("${titleHome}")    AS "${titleHome}"
          , MAX("${titleNotHome}") AS "${titleNotHome}"
     FROM (
              SELECT STATE_POSTAL_CODE,
                     AVG(POP_STAY_HOME) OVER (
                         PARTITION BY STATE_POSTAL_CODE
                         ORDER BY DATE_ENTERED
                         ROWS BETWEEN (${days} - 1) PRECEDING AND CURRENT ROW) AS "${titleHome}",
                     AVG(POP_NOT_STAY_HOME) OVER (
                         PARTITION BY STATE_POSTAL_CODE
                         ORDER BY DATE_ENTERED
                         ROWS BETWEEN (${days} - 1) PRECEDING AND CURRENT ROW) AS "${titleNotHome}"
              FROM TRIPS_BY_DISTANCE
              WHERE DATE_ENTERED BETWEEN (SELECT MAX(DATE_ENTERED) + (:weeks * -7)
                                          FROM TRIPS_BY_DISTANCE) AND
                        (SELECT MAX(DATE_ENTERED)
                         FROM TRIPS_BY_DISTANCE)
          )
     GROUP BY STATE_POSTAL_CODE
     having STATE_POSTAL_CODE in (${states})
     ORDER BY "${titleHome}" ${order} FETCH FIRST :topRows ROWS ONLY`;
  return selectStatement;
}

function getPopHomeQueryByNation (days, title, order) {

  let titleHome = title + '_AT_HOME';
  let titleNotHome = title + '_NOT_HOME';

  // language=Oracle
  const selectStatement =
    `SELECT STATE_POSTAL_CODE      as STATE
          , MAX("${titleHome}")    AS "${titleHome}"
          , MAX("${titleNotHome}") AS "${titleNotHome}"
     FROM (
              SELECT STATE_POSTAL_CODE,
                     AVG(POP_STAY_HOME) OVER (
                         PARTITION BY STATE_POSTAL_CODE
                         ORDER BY DATE_ENTERED
                         ROWS BETWEEN (${days} - 1) PRECEDING AND CURRENT ROW) AS "${titleHome}",
                     AVG(POP_NOT_STAY_HOME) OVER (
                         PARTITION BY STATE_POSTAL_CODE
                         ORDER BY DATE_ENTERED
                         ROWS BETWEEN (${days} - 1) PRECEDING AND CURRENT ROW) AS "${titleNotHome}"
              FROM TRIPS_BY_DISTANCE
              WHERE DATE_ENTERED BETWEEN (SELECT MAX(DATE_ENTERED) + (:weeks * -7)
                                          FROM TRIPS_BY_DISTANCE) AND
                        (SELECT MAX(DATE_ENTERED)
                         FROM TRIPS_BY_DISTANCE)
          )
     GROUP BY STATE_POSTAL_CODE
     ORDER BY "${titleHome}" ${order} FETCH FIRST :topRows ROWS ONLY`;
  return selectStatement;
}

function getPopHomeQueryAllStates (days, title, order) {

  let titleHome = title + '_AT_HOME';
  let titleNotHome = title + '_NOT_HOME';

  // language=Oracle
  const selectStatement =
    `SELECT STATE_POSTAL_CODE as STATE, MAX("${titleHome}") AS "${titleHome}"
           ,MAX("${titleNotHome}") AS "${titleNotHome}"
      FROM (

               SELECT STATE_POSTAL_CODE,
                      AVG(POP_STAY_HOME) OVER (
                          PARTITION BY STATE_POSTAL_CODE
                          ORDER BY DATE_ENTERED
                          ROWS BETWEEN (${days} - 1) PRECEDING AND CURRENT ROW) AS "${titleHome}",
                      AVG(POP_NOT_STAY_HOME) OVER (
                          PARTITION BY STATE_POSTAL_CODE
                          ORDER BY DATE_ENTERED
                          ROWS BETWEEN (${days} - 1) PRECEDING AND CURRENT ROW) AS "${titleNotHome}"
               FROM TRIPS_BY_DISTANCE
               WHERE DATE_ENTERED BETWEEN (SELECT MAX(DATE_ENTERED) + (:weeks * -7)
                                           FROM TRIPS_BY_DISTANCE) AND
                         (SELECT MAX(DATE_ENTERED)
                          FROM TRIPS_BY_DISTANCE)
           )
      GROUP BY STATE_POSTAL_CODE
      ORDER BY "${titleHome}" ${order} FETCH FIRST :topRows ROWS ONLY`;
  return selectStatement;
}
//}}}***********************************************************

//{{{                    MARK:COVID QUERIES
//**************************************************************
function getCovidQueryAllStates (days, title, order) {
  // language=Oracle
  const selectStatement =
    `SELECT STATE, MAX("${title}") AS "${title}"
     FROM (
              SELECT STATE,
                     AVG(NEW_CASE) OVER (
                         PARTITION BY STATE
                         ORDER BY SUBMISSION_DATE
                         ROWS BETWEEN (${days} - 1) PRECEDING AND CURRENT ROW) AS "${title}"
              FROM COVID_19_CASES
              WHERE SUBMISSION_DATE BETWEEN (SELECT MAX(SUBMISSION_DATE) + (:weeks * -7)
                                             FROM COVID_19_CASES) AND
                        (SELECT MAX(SUBMISSION_DATE)
                         FROM COVID_19_CASES)
          )
     GROUP BY STATE
     ORDER BY "${title}" ${order} FETCH FIRST :topRows ROWS ONLY`;
  return selectStatement;
}

function getCovidQueryByState (days, title, order, states) {

  // language=Oracle
  const selectStatement =
    `SELECT STATE, MAX("${title}") AS "${title}"
     FROM (
              SELECT STATE,
                     AVG(NEW_CASE) OVER (
                         PARTITION BY STATE
                         ORDER BY SUBMISSION_DATE
                         ROWS BETWEEN (${days} - 1) PRECEDING AND CURRENT ROW) AS "${title}"
              FROM COVID_19_CASES
              WHERE SUBMISSION_DATE BETWEEN (SELECT MAX(SUBMISSION_DATE) + (:weeks * -7)
                                             FROM COVID_19_CASES) AND
                        (SELECT MAX(SUBMISSION_DATE)
                         FROM COVID_19_CASES)
          )
     GROUP BY STATE
     having STATE in (${states})
     ORDER BY "${title}" ${order} FETCH FIRST :topRows ROWS ONLY`;
  return selectStatement;
}

function getCovidQueryByNation (days, title, order) {

  // language=Oracle
  const selectStatement =
    `SELECT 'US' as STATE, MAX("${title}") AS "${title}"
     FROM (
              SELECT STATE,
                     AVG(NEW_CASE) OVER (
                         PARTITION BY STATE
                         ORDER BY SUBMISSION_DATE
                         ROWS BETWEEN (${days} - 1) PRECEDING AND CURRENT ROW) AS "${title}"
              FROM COVID_19_CASES
              WHERE SUBMISSION_DATE BETWEEN (SELECT MAX(SUBMISSION_DATE) + (:weeks * -7)
                                             FROM COVID_19_CASES) AND
                        (SELECT MAX(SUBMISSION_DATE)
                         FROM COVID_19_CASES)
          )
     ORDER BY "${title}" ${order} FETCH FIRST :topRows ROWS ONLY`;
  return selectStatement;
}
//}}}***********************************************************

//{{{                    MARK:COVID Handler
//**************************************************************
function cases (req, res, weeks, topRows) {
  let selectStatement;
  const parsedBody = req.parsedBody;

  if (parsedBody.scopeVal.toUpperCase() === 'NATION') {

    selectStatement = getCovidQueryByNation(parsedBody.periodVal,
      parsedBody.periodVal + '_DAY_MAX_MOVING_AVERAGE', parsedBody.orderVal);
    return lib.runQuery(req, res, selectStatement, { weeks, topRows });
  }

  if (parsedBody.stateVal.toUpperCase() === '\'ANY\'') {

    selectStatement = getCovidQueryAllStates(parsedBody.periodVal,
      parsedBody.periodVal + '_DAY_MAX_MOVING_AVERAGE', parsedBody.orderVal);
  } else {
    selectStatement = getCovidQueryByState(parsedBody.periodVal,
      parsedBody.periodVal + '_DAY_MAX_MOVING_AVERAGE', parsedBody.orderVal,
      parsedBody.stateVal);
  }

  return lib.runQuery(req, res, selectStatement, { weeks, topRows });
}
//}}}***********************************************************

//{{{                    MARK:Pop Home Handler
//**************************************************************
function popHome (req, res, weeks, topRows) {
  const parsedBody = req.parsedBody;
  let selectStatement;

  if (parsedBody.scopeVal === 'NATION') {

    selectStatement = getPopHomeQueryByNation(parsedBody.periodVal,
      parsedBody.periodVal + '_DAY_MAX_MOVING_AVERAGE', parsedBody.orderVal);
    return lib.runQuery(req, res, selectStatement, { weeks, topRows });
  }

  if (parsedBody.stateVal === '\'ANY\'') {

    selectStatement = getPopHomeQueryAllStates(parsedBody.periodVal,
      parsedBody.periodVal + '_DAY_MAX_MOVING_AVERAGE', parsedBody.orderVal);
  } else {
    selectStatement = getPopHomeQueryByState(parsedBody.periodVal,
      parsedBody.periodVal + '_DAY_MAX_MOVING_AVERAGE', parsedBody.orderVal,
      parsedBody.stateVal);
  }

  return lib.runQuery(req, res, selectStatement, { weeks, topRows });
}
//}}}***********************************************************

module.exports = {
  cases,
  popHome,
};
