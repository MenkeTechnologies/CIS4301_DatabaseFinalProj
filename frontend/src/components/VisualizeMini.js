import React from 'react';
import BarChart from './BarChart';
import { useHistory } from 'react-router-dom';

import {
  Button,
  CssBaseline,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar, faChartLine } from '@fortawesome/free-solid-svg-icons';
import { Form } from 'react-final-form';
import { debugJson, H_LEVEL_COMP, visualizePath } from '../util/Utils';

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
const VisualizeMini = (props) => {

  const appState = props.state;

  const history = useHistory();

  const onSubmit = e => {
    history.push(visualizePath);
  };

  return (
    <div>

      <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
        <CssBaseline/>

        <Typography variant="h5" align="center" component={H_LEVEL_COMP}
                    gutterBottom>
          Visualize <FontAwesomeIcon icon={faChartLine}/>
        </Typography>

        <Form
          onSubmit={onSubmit}
          initialValues={appState.initialState}
          validate={validate}
          render={({ handleSubmit, reset, submitting, pristine, values }) => (
            <form onSubmit={handleSubmit} noValidate>


              <Paper style={{ padding: 16 }}>
                <Grid container alignItems="flex-start" spacing={2}>


                  <BarChart state={appState} size={'mini'}/>


                  <Grid item style={{ marginTop: 16 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      type="submit"
                      disabled={submitting}
                      onClick={onSubmit}
                    >
                      <span style={{ paddingRight: 5 }}>

                      Full Screen
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
};

export default VisualizeMini;
