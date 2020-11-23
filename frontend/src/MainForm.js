import React from 'react'
import { Field, Form } from 'react-final-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { Checkbox } from 'final-form-material-ui'
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
} from '@material-ui/core'
// Picker
import { DatePicker, TimePicker } from '@material-ui/pickers'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import ComboBox from './ComboBox'
import { regionType, restrictionType, stateType } from './Utils'
import { faCoffee, faPlay, faSearch } from '@fortawesome/free-solid-svg-icons'

function DatePickerWrapper (props) {
  const {
    input: { name, onChange, value, ...restInput },
    meta,
    ...rest
  } = props
  const showError =
    ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
    meta.touched

  return (
    <DatePicker
      {...rest}
      name={name}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      inputProps={restInput}
      onChange={onChange}
      value={value === '' ? null : value}
    />
  )
}

function TimePickerWrapper (props) {
  const {
    input: { name, onChange, value, ...restInput },
    meta,
    ...rest
  } = props
  const showError =
    ((meta.submitError && !meta.dirtySinceLastSubmit) || meta.error) &&
    meta.touched

  return (
    <TimePicker
      {...rest}
      name={name}
      helperText={showError ? meta.error || meta.submitError : undefined}
      error={showError}
      inputProps={restInput}
      onChange={onChange}
      value={value === '' ? null : value}
    />
  )
}

const onSubmit = async values => {
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
  await sleep(300)
  window.alert(JSON.stringify(values, 0, 2))
}

const validate = values => {
  const errors = {}
  if (!values.firstName) {
    errors.firstName = 'Required'
  }
  if (!values.lastName) {
    errors.lastName = 'Required'
  }
  if (!values.email) {
    errors.email = 'Required'
  }
  return errors
}

export default function MainForm () {
  const [periodVal, setPeriodVal] = React.useState('7')

  const handlePeriod = (event, newValue) => {
    setPeriodVal(newValue)
  }
  const [orderVal, setOrder] = React.useState('asc')

  const handleOrder = (event, newValue) => {
    setOrder(newValue)
  }
  const [scopeVal, setScope] = React.useState('state')

  const handleScope = (event, newValue) => {
    setScope(newValue)
  }

  const [restrictionVal, setRestriction] = React.useState('Snatch3')

  const handleRestrictionCombo = (event, newValue) => {
    setRestriction(newValue)
  }

  const [stateVal, setState] = React.useState('Snatch1')

  const handleStateCombo = (event, newValue) => {
    setState(newValue)
  }

  const [regionVal, setRegion] = React.useState('Snatch2')

  const handleRegionCombo = (event, newValue) => {
    setRegion(newValue)
  }

  const initialState = {
    periodVal,
    orderVal,
    scopeVal,
    stateVal,
    regionVal,
    restrictionVal,
    dataSel: [
      'cases',
    ],

  }
  return (
    <div>

      <div style={{ padding: 16, margin: 'auto', maxWidth: 600 }}>
        <CssBaseline/>
        <Typography variant="h4" align="center" component="h1" gutterBottom>
          Covid Travel Data Home
        </Typography>
        <Typography variant="h5" align="center" component="h2" gutterBottom>
          Query Creator <FontAwesomeIcon icon={faSearch} />
        </Typography>

        <Form
          onSubmit={onSubmit}
          initialValues={initialState}
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
                        value={scopeVal}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleScope}
                        aria-label="disabled tabs example"
                      >
                        <Tab label="State" value={'state'}/>
                        <Tab label="Nation" value={'nation'}/>
                        <Tab label="Region" value={'region'}/>
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
                        value={periodVal}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handlePeriod}
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
                        value={orderVal}
                        indicatorColor="primary"
                        textColor="primary"
                        onChange={handleOrder}
                        aria-label="disabled tabs example"
                      >
                        <Tab label="Asc" value={'asc'}/>
                        <Tab label="Desc" value={'desc'}/>
                      </Tabs>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h5" align="center" component="h2"
                                gutterBottom>
                      Restriction Type
                    </Typography>

                    <ComboBox type={restrictionType}
                              cb={handleRestrictionCombo} init={restrictionVal}/>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h5" align="center" component="h2"
                                gutterBottom>
                      State
                    </Typography>
                    <ComboBox type={stateType} cb={handleStateCombo} init={stateVal}/>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h5" align="center" component="h2"
                                gutterBottom>
                      Region
                    </Typography>
                    <ComboBox type={regionType} cb={handleRegionCombo} init={regionVal}/>
                  </Grid>

                  <Grid item>
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Data Selector</FormLabel>
                      <FormGroup row>
                        <FormControlLabel
                          label="Covid Cases"
                          control={
                            <Field
                              name="dataSel"
                              component={Checkbox}
                              type="checkbox"
                              value="cases"
                            />
                          }
                        />
                        <FormControlLabel
                          label="Number of Trips"
                          control={
                            <Field
                              name="dataSel"
                              component={Checkbox}
                              type="checkbox"
                              value="numTrip"
                            />
                          }
                        />
                        <FormControlLabel
                          label="Population at home"
                          control={
                            <Field
                              name="dataSel"
                              component={Checkbox}
                              type="checkbox"
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
                      onClick={onSubmit}
                    >
                      <span style={{paddingRight: 5}}>

                      Visualize
                      </span>
                      <FontAwesomeIcon icon={faPlay} />
                    </Button>
                  </Grid>
                </Grid>
              </Paper>
              <pre>{JSON.stringify(values, 0, 2)}</pre>
            </form>
          )}
        />
      </div>

    </div>
  )
}

