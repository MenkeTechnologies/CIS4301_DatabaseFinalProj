import './App.css'
import { Nav, Navbar } from 'react-bootstrap'
import { Redirect, Route, Switch } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import Dashboard from './Dashboard'
import Visualize from './Visualize'
import React from 'react'
import { ANY } from './Utils'

import { createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import indigo from '@material-ui/core/colors/indigo'
import pink from '@material-ui/core/colors/pink'
import red from '@material-ui/core/colors/red'
import { MuiThemeProvider } from '@material-ui/core'
import purple from '@material-ui/core/colors/purple'
import green from '@material-ui/core/colors/green'
import { useTheme } from '@material-ui/core/styles';

export default function App () {

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

  const [restrictionVal, setRestriction] = React.useState(ANY)

  const handleRestrictionCombo = (event, newValue) => {
    setRestriction(newValue)
  }

  const [stateVal, setState] = React.useState(ANY)

  const handleStateCombo = (event, newValue) => {
    setState(newValue)
  }

  const [regionVal, setRegion] = React.useState(ANY)

  const handleRegionCombo = (event, newValue) => {
    setRegion(newValue)
  }

  let dataSelMap = {
    cases: true,
    numTrips: false,
    popHome: false,

  }
  const [dataSelValue, setDataSel] = React.useState(dataSelMap)

  const handleDataSel = (event, newValue) => {

    const newMap = {
      ...dataSelValue,
    }

    newMap[event.target.value] = !newMap[event.target.value]
    setDataSel(newMap)
  }

  const initialState = {
    periodVal,
    orderVal,
    scopeVal,
    stateVal,
    regionVal,
    restrictionVal,
    dataSelValue,
  }

  const appState = {
    initialState,
    handlePeriod,
    handleOrder,
    handleScope,
    handleRestrictionCombo,
    handleStateCombo,
    handleRegionCombo,
    handleDataSel,
  }


  const currentTheme = useTheme();

  const theme = createMuiTheme({
    overrides: {
      MuiTab: {
        root: {
          '&$selected': {
            backgroundColor: currentTheme.palette.primary.dark,
            color: '#fff'
          }
        }
      }
    }

  });

  return (
    <div>
      <MuiThemeProvider theme={theme}>

      <Navbar bg="light" expand="lg">
        <LinkContainer to="/">
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
        </Navbar.Collapse>
      </Navbar>

      <Switch>
        <Route path={['/dashboard']} exact>
          <Dashboard state={appState}/>
        </Route>
        <Route path="/query" exact>
          <Visualize state={appState}/>
        </Route>
        <Route path="/" exact>
          <Redirect to={'/dashboard'}/>
        </Route>
      </Switch>
      </MuiThemeProvider>

    </div>

  )
}

function Home () {
  return <h2>Home</h2>
}
