import React from 'react';
import { Form } from 'react-final-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Checkbox from '@material-ui/core/Checkbox';

import {
  Button,
  CssBaseline,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Paper,
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
                        <Tab label="Asc" value={'ASC'}/>
                        <Tab label="Desc" value={'DESC'}/>
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
                  <Grid item>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Data Selector</FormLabel>
                      <FormGroup row>
                        <FormControlLabel
                          label="Covid Cases"
                          control={
                            <Checkbox
                              onChange={appState.handleDataSel}
                              checked={appState.initialState.dataSelValue.cases}
                              name="dataSel"
                              value="cases"
                            />
                          }
                        />
                        <FormControlLabel
                          label="Number of Trips"
                          control={
                            <Checkbox
                              onChange={appState.handleDataSel}
                              checked={appState.initialState.dataSelValue.numTrips}
                              name="dataSel"
                              value="numTrips"
                            />
                          }
                        />
                        <FormControlLabel
                          label="Population at Home"
                          control={
                            <Checkbox
                              name="dataSel"
                              onChange={appState.handleDataSel}
                              checked={appState.initialState.dataSelValue.popHome}
                              value="popHome"
                            />
                          }
                        />

                      </FormGroup>
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

