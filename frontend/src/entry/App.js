import '../css/App.css';
import { Nav, Navbar } from 'react-bootstrap';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Dashboard from '../components/Dashboard';
import Visualize from '../components/Visualize';
import React from 'react';
import { ANY, dashboardPath, visualizePath } from '../util/Utils';

import { createMuiTheme, useTheme } from '@material-ui/core/styles';
import { MuiThemeProvider, Paper } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';

export default function App () {

  const [periodVal, setPeriodVal] = React.useState('7');

  const handlePeriod = (event, newValue) => {
    setPeriodVal(newValue);
  };
  const [orderVal, setOrder] = React.useState('DESC');

  const handleOrder = (event, newValue) => {
    setOrder(newValue);
  };
  const [scopeVal, setScope] = React.useState('STATE');

  const handleScope = (event, newValue) => {
    setScope(newValue);
  };
  const [numRecords, setNumRecords] = React.useState(5);

  const handleNumRecords = (event, newValue) => {
    const val = event.target.value;
    setNumRecords(val);

  };

  const [weeksAgo, setWeeksAgo] = React.useState(3);

  const handleWeeksAgo = (event, newValue) => {
    const val = event.target.value;
    setWeeksAgo(val);

  };
 

  const [restrictionVal, setRestriction] = React.useState(ANY);

  const handleRestrictionCombo = (event, newValue) => {
    setRestriction(newValue);
  };

  const [stateVal, setState] = React.useState(ANY);

  const handleStateCombo = (event, newValue) => {
    setState(newValue);
  };

  const [regionVal, setRegion] = React.useState(ANY);

  const handleRegionCombo = (event, newValue) => {
    setRegion(newValue);
  };

  let dataSelMap = {
    cases: true,
    numTrips: false,
    popHome: false,

  };
  const [dataSelValue, setDataSel] = React.useState('cases');

  const handleDataSel = (event, newValue) => {

    const newMap = {
      ...dataSelValue,
    };
    console.log(`\n_____________'newMap' = '${JSON.stringify(newMap)}'_____________\n`);

    newMap[event.target.value] = !newMap[event.target.value];
    setDataSel(event.target.value);
  };

  const [barData, setBarData] = React.useState({
    type: {
      cases: true,
      numTrips: false,
      popHome: false,
    },
    data: [],
  });

  const handleBarData = (newValue) => {
    setBarData(newValue);
  };

  const initialState = {
    periodVal,
    orderVal,
    scopeVal,
    stateVal,
    regionVal,
    restrictionVal,
    dataSelValue,
    barData,
    numRecords,
    weeksAgo,    
  };

  const appState = {
    initialState,
    handlePeriod,
    handleOrder,
    handleScope,
    handleRestrictionCombo,
    handleStateCombo,
    handleRegionCombo,
    handleDataSel,
    handleBarData,
    handleNumRecords,
    handleWeeksAgo,    
  };

  const currentTheme = useTheme();

  const theme = createMuiTheme({
    overrides: {
      MuiTab: {
        root: {
          '&$selected': {
            backgroundColor: currentTheme.palette.primary.dark,
            color: '#fff',
          },
        },
      },
    },

  });

  const history = useHistory();

  const navHome = () => {
    history.push(dashboardPath);
  };

  return (
    <div>
      <MuiThemeProvider theme={theme}>

        <Navbar bg="light" expand="lg">
          <LinkContainer to="/dashboard">
            <Navbar.Brand>COVID Travel Analysis Application</Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav"/>
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <LinkContainer to={dashboardPath}>
                <Nav.Link>Dashboard</Nav.Link>
              </LinkContainer>
              <LinkContainer to={visualizePath}>
                <Nav.Link>Visualize</Nav.Link>
              </LinkContainer>


            </Nav>

            <Paper square style={{ padding: 10 }} onClick={navHome}>
              <FontAwesomeIcon align={'center'} icon={faPlane}/>
            </Paper>
          </Navbar.Collapse>
        </Navbar>

        <Switch>
          <Route path={[dashboardPath]} exact>
            <Dashboard state={appState}/>
          </Route>
          <Route path={[visualizePath]} exact>
            <Visualize state={appState}/>
          </Route>
          <Route path="/" exact>
            <Redirect to={dashboardPath}/>
          </Route>
        </Switch>
      </MuiThemeProvider>

    </div>

  );
}
