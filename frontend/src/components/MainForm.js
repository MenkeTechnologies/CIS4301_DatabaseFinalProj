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
  Typography,
} from '@material-ui/core';
// Picker
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ComboBox from './ComboBox';
import { API_URL, regionType, restrictionType, stateType } from '../util/Utils';
import { faPlay, faSearch } from '@fortawesome/free-solid-svg-icons';

import axios from 'axios';

const validate = values => {
  const errors = {};
  if (!values.firstName) {
    errors.firstName = 'Required';
  }
  if (!values.lastName) {
    errors.lastName = 'Required';
  }
  if (!values.email) {
    errors.email = 'Required';
  }
  return errors;
};

export default function MainForm (props) {

  const appState = props.state;

  const onSubmit = async values => {

    try {
      const res = await axios.post(API_URL, values);
      const type = res.data.type;
      const data = res.data.data;

      console.log(
        `\n_____________'type' = '${JSON.stringify(type)}'_____________\n`);
      console.log(
        `\n_____________'data' = '${JSON.stringify(data)}'_____________\n`);
      appState.handleBarData(res.data);

    } catch (error) {
      console.log(Object.keys(error), error.message);
    }

  };

  return (
    <div>

      <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
        <CssBaseline/>

        <Typography variant="h5" align="center" component="h2" gutterBottom>
          Query Creator <FontAwesomeIcon icon={faSearch}/>
        </Typography>

        <Form
          onSubmit={() => onSubmit(appState)}
          initialValues={appState.initialState}
          validate={validate}
          render={({ handleSubmit, reset, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit} noValidate>


              <Paper style={{ padding: 16 }}>
                <Grid container alignItems="flex-start" spacing={2}>
                  <Grid item xs={12}>
                    <Paper square>
                      <Typography variant="h5" align="center" component="h2"
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
                      <Typography variant="h5" align="center" component="h2"
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
                      <Typography variant="h5" align="center" component="h2"
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
                    <Typography variant="h5" align="center" component="h2"
                                gutterBottom>
                      Restriction Type
                    </Typography>

                    <ComboBox type={restrictionType}
                              cb={appState.handleRestrictionCombo}
                              init={appState.initialState.restrictionVal}/>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h5" align="center" component="h2"
                                gutterBottom>
                      State
                    </Typography>
                    <ComboBox type={stateType} cb={appState.handleStateCombo}
                              init={appState.initialState.stateVal}/>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h5" align="center" component="h2"
                                gutterBottom>
                      Region
                    </Typography>
                    <ComboBox type={regionType} cb={appState.handleRegionCombo}
                              init={appState.initialState.regionVal}/>
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
                          label="Population at home"
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


                  <Grid item style={{ marginTop: 16 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={submitting}
                      onClick={() => onSubmit(values)}
                    >
                      <span style={{ paddingRight: 5 }}>

                      Visualize
                      </span>
                      <FontAwesomeIcon icon={faPlay}/>
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
              <pre>{JSON.stringify(values, 0, 4)}</pre>
            </form>
          )}
        />
      </div>

    </div>
  );
}

