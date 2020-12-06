export const restrictionType = 'restriction';
export const stateType = 'state';
export const regionType = 'region';

export const ANY = 'ANY';
export const dashboardPath = '/dashboard';
export const BAR_COLOR = '#ee9922';
const NUM_WEEKS = '3';
const NUM_ROWS = '10';
export const H_LEVEL = "h6";

export const getApiURL = (data) => {

  if (data) {

    const weeks = data.numWeeks || NUM_WEEKS;
    const row = data.numRecords || NUM_ROWS;

    return `http://localhost:8000/handle/${weeks}/${row}`;
  } else {

    return `http://localhost:8000/handle/${NUM_WEEKS}/${NUM_ROWS}`;
  }
}

export const clearKeys = (obj) => {
  for (const variableKey in obj) {
    if (obj.hasOwnProperty(variableKey)) {
      delete obj[variableKey];
    }
  }

};
