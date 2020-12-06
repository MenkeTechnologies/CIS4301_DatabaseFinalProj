function getCovidQueryAllStates (days, title, order) {
  const selectStatement =
    `SELECT STATE, MAX("${title}") AS "${title}"
     FROM (
              SELECT STATE,
                     AVG(TOT_CASES) OVER (
                         PARTITION BY STATE
                         ORDER BY SUBMISSION_DATE
                         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS "${title}"
              FROM COVID_19_CASES
              WHERE SUBMISSION_DATE BETWEEN (SELECT MAX(SUBMISSION_DATE) + (:weeks * -${days})
                                             FROM COVID_19_CASES) AND
                        (SELECT MAX(SUBMISSION_DATE)
                         FROM COVID_19_CASES)
          )
     GROUP BY STATE
     ORDER BY "${title}" ${order} FETCH FIRST :topRows ROWS ONLY`
  return selectStatement
}

function getCovidQueryByState (days, title, order, states) {

  const selectStatement =
    `SELECT STATE, MAX("${title}") AS "${title}"
     FROM (
              SELECT STATE,
                     AVG(TOT_CASES) OVER (
                         PARTITION BY STATE
                         ORDER BY SUBMISSION_DATE
                         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS "${title}"
              FROM COVID_19_CASES
              WHERE SUBMISSION_DATE BETWEEN (SELECT MAX(SUBMISSION_DATE) + (:weeks * -${days})
                                             FROM COVID_19_CASES) AND
                        (SELECT MAX(SUBMISSION_DATE)
                         FROM COVID_19_CASES)
          )
     GROUP BY STATE
    having STATE in (${states})
     ORDER BY "${title}" ${order} FETCH FIRST :topRows ROWS ONLY`
  return selectStatement
}

function getCovidQueryByNation (days, title, order) {

  const selectStatement =
    `SELECT 'US' as STATE, MAX("${title}") AS "${title}"
     FROM (
              SELECT STATE,
                     AVG(TOT_CASES) OVER (
                         PARTITION BY STATE
                         ORDER BY SUBMISSION_DATE
                         ROWS BETWEEN 6 PRECEDING AND CURRENT ROW) AS "${title}"
              FROM COVID_19_CASES
              WHERE SUBMISSION_DATE BETWEEN (SELECT MAX(SUBMISSION_DATE) + (:weeks * -${days})
                                             FROM COVID_19_CASES) AND
                        (SELECT MAX(SUBMISSION_DATE)
                         FROM COVID_19_CASES)
          )
     ORDER BY "${title}" ${order} FETCH FIRST :topRows ROWS ONLY`
  return selectStatement
}

module.exports = {
  getCovidQueryByNation,
  getCovidQueryByState,
  getCovidQueryAllStates
}
