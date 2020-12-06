import '../css/App.css';
import { Nav, Navbar } from 'react-bootstrap';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Dashboard from '../components/Dashboard';
import Visualize from '../components/Visualize';
import React from 'react';
import { ANY, dashboardPath } from '../util/Utils';

import { createMuiTheme, useTheme } from '@material-ui/core/styles';
import { MuiThemeProvider, Paper } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlane } from '@fortawesome/free-solid-svg-icons';

export default function App () {

  const [periodVal, setPeriodVal] = React.useState('7');

  const handlePeriod = (event, newValue) => {
    setPeriodVal(newValue);
  };
  const [orderVal, setOrder] = React.useState('ASC');

  const handleOrder = (event, newValue) => {
    setOrder(newValue);
  };
  const [scopeVal, setScope] = React.useState('state');

  const handleScope = (event, newValue) => {
    setScope(newValue);
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
  const [dataSelValue, setDataSel] = React.useState(dataSelMap);

  const handleDataSel = (event, newValue) => {

    const newMap = {
      ...dataSelValue,
    };

    newMap[event.target.value] = !newMap[event.target.value];
    setDataSel(newMap);
  };

  const initialState = {
    periodVal,
    orderVal,
    scopeVal,
    stateVal,
    regionVal,
    restrictionVal,
    dataSelValue,
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
              <LinkContainer to="/dashboard">
                <Nav.Link>Dashboard</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/query">
                <Nav.Link>Query</Nav.Link>
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
          <Route path="/query" exact>
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
