import './App.css'
import { Nav, Navbar } from 'react-bootstrap'
import  {  Route, Switch } from 'react-router-dom'
import { LinkContainer } from 'react-router-bootstrap'
import Dashboard from './Dashboard'
import Visualize from './Visualize'
import Redirect from 'react-router-dom/es/Redirect'

export default function App () {
  return (
    <div>
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
        <Route path={["/dashboard"]} exact >
          <Dashboard/>
        </Route>
        <Route path="/query" exact>
          <Visualize/>
        </Route>
        <Route path="/" exact>
          <Redirect to={"/dashboard"}/>
        </Route>
      </Switch>
    </div>

  )
}

function Home () {
  return <h2>Home</h2>
}
