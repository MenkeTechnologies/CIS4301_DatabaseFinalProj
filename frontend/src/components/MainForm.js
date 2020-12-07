import React from 'react';
import { Form } from 'react-final-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  Button,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from '@material-ui/core';
// Picker
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ComboBox from './ComboBox';
import {
  debugJson,
  debugLog,
  getApiURL,
  H_LEVEL,
  H_LEVEL_COMP,
  regionType,
  restrictionType,
  stateType,
  visualizePath,
} from '../util/Utils';
import {
  faChartBar,
  faPlay,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';
import { useHistory } from 'react-router-dom';

const validate = values => {
  const errors = {};
  // if (!values.firstName) {
  //   errors.firstName = 'Required';
  // }
  // if (!values.lastName) {
  //   errors.lastName = 'Required';
  // }
  // if (!values.email) {
  //   errors.email = 'Required';
  // }

  if (!values.numRecords || !isNaN(parseInt(values.numRecords))) {

    errors.numRecords = 'Required to be integer';
  }
  debugLog(
    `\n_____________'errors' = '${JSON.stringify(errors)}'_____________\n`);
  return errors;
};

export default function MainForm (props) {

  const appState = props.state;
  const history = useHistory();

  const onSubmit = async (values, origin) => {

    try {
      const apiURL = getApiURL({   
        weeksAgo: appState.initialState.weeksAgo,     
        numRecords: appState.initialState.numRecords,       
      });
      debugLog(
        `\n_____________'apiURL' = '${JSON.stringify(apiURL)}'_____________\n`);
      const res = await axios.post(apiURL, values);
      const type = res.data.type;
      const data = res.data.data;

      debugLog(
        `\n_____________'type' = '${JSON.stringify(type)}'_____________\n`);
      debugLog(
        `\n_____________'data' = '${JSON.stringify(data)}'_____________\n`);
      appState.handleBarData(res.data);

      if (origin === 'maxi') {

        history.push(visualizePath);
      }

    } catch (error) {
      console.log(Object.keys(error), error.message);
    }

  };

  return (
    <div>

      <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
        <CssBaseline/>

        <Typography variant={H_LEVEL} align="center" component={H_LEVEL_COMP}
                    gutterBottom>
          Query Creator <FontAwesomeIcon icon={faSearch}/>
        </Typography>

        <Form
          onSubmit={() => onSubmit(appState, 'init')}
          initialValues={appState.initialState}
          validate={validate}
          render={({ handleSubmit, reset, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit} noValidate>


              <Paper style={{ padding: 16 }}>
                <Grid container alignItems="flex-start" spacing={2}>
                  <Grid item xs={12}>
                    <Paper square>
                      <Typography variant={H_LEVEL} align="center"
                                  component={H_LEVEL_COMP}
                                  gutterBottom>
                        Scope
                      </Typography>
                      <Tabs
                        value={appState.initialState.scopeVal}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={appState.handleScope}
                        aria-label="disabled tabs example"
                      >
                        <Tab label="State" value={'STATE'}/>
                        <Tab label="Nation" value={'NATION'}/>
                        <Tab label="Region" value={'REGION'}/>
                      </Tabs>
                    </Paper>
                  </Grid>


                  <Grid item xs={12}>
                    <Paper square>
                      <Typography variant={H_LEVEL} align="center"
                                  component={H_LEVEL_COMP}
                                  gutterBottom>
                        Time Period
                      </Typography>
                      <Tabs
                        value={appState.initialState.periodVal}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={appState.handlePeriod}
                        aria-label="disabled tabs example"
                      >
                        <Tab label="7" value={'7'}/>
                        <Tab label="14" value={'14'}/>
                        <Tab label="21" value={'21'}/>
                      </Tabs>
                    </Paper>
                  </Grid>

                  <Grid item xs={12}>
                    <Paper square>
                      <Typography variant={H_LEVEL} align="center"
                                  component={H_LEVEL_COMP}
                                  gutterBottom>
                        Order
                      </Typography>
                      <Tabs
                        value={appState.initialState.orderVal}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={appState.handleOrder}
                        aria-label="disabled tabs example"
                      >
                        <Tab label="Ascending" value={'ASC'}/>
                        <Tab label="Descending" value={'DESC'}/>
                      </Tabs>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant={H_LEVEL} align="center"
                                component={H_LEVEL_COMP}
                                gutterBottom>
                      Restriction Type
                    </Typography>

                    <ComboBox type={restrictionType}
                              cb={appState.handleRestrictionCombo}
                              init={appState.initialState.restrictionVal}/>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant={H_LEVEL} align="center"
                                component={H_LEVEL_COMP}
                                gutterBottom>
                      State
                    </Typography>
                    <ComboBox type={stateType} cb={appState.handleStateCombo}
                              init={appState.initialState.stateVal}/>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant={H_LEVEL} align="center"
                                component={H_LEVEL_COMP}
                                gutterBottom>
                      Region
                    </Typography>
                    <ComboBox type={regionType} cb={appState.handleRegionCombo}
                              init={appState.initialState.regionVal}/>


                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant={H_LEVEL} align="center" component="h3"
                                gutterBottom>
                      Number of Records
                    </Typography>
                    <TextField label="Records" variant="outlined"
                               onChange={appState.handleNumRecords}
                               value={appState.initialState.numRecords}/>

                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant={H_LEVEL} align="left" component="h3"
                                gutterBottom>
                      Weeks Ago
                    </Typography>
                    <TextField label="Weeks Ago" variant="outlined"
                               onChange={appState.handleWeeksAgo}
                               value={appState.initialState.weeksAgo}/>

                  </Grid>                  
                  <Grid item>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Data Selector</FormLabel>
                      <RadioGroup row name="dataSel"
                                  onChange={appState.handleDataSel}
                                  value={appState.initialState.dataSelValue}
                      >
                        <FormControlLabel
                          label="Covid Cases"
                          control={
                            <Radio
                              value="cases"
                            />
                          }
                        />
                        <FormControlLabel
                          label="Number of Trips"
                          control={
                            <Radio
                              value="numTrips"
                            />
                          }
                        />
                        <FormControlLabel
                          label="Population at Home"
                          control={
                            <Radio
                              value="popHome"
                            />
                          }
                        />

                      </RadioGroup>
                    </FormControl>
                  </Grid>


                  <Grid item style={{ marginTop: 16 }} xs={6}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={submitting}
                      onClick={() => onSubmit(values, 'mini')}
                    >
                      <span style={{ paddingRight: 5 }}>

                      Run Preview Visualization
                      </span>
                      <FontAwesomeIcon icon={faPlay}/>
                    </Button>
                  </Grid>
                  <Grid item style={{ marginTop: 16 }} xs={6}>

                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={submitting}
                      onClick={() => onSubmit(values, 'maxi')}
                    >
                      <span style={{ paddingRight: 5 }}>

                      Run Full Screen Visualization
                      </span>
                      <FontAwesomeIcon icon={faChartBar}/>
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
              {debugJson(values)}
            </form>
          )}
        />
      </div>

    </div>
  );
}

