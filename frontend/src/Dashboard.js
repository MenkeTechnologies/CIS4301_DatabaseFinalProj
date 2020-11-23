import React, { Component } from 'react'
import MainForm from './MainForm'
import VisualizeMini from './VisualizeMini'

class Dashboard extends Component {

  constructor (props) {
    super(props)

  }

  componentDidMount () {

  }

  render () {
    return (
      <div>

        <MainForm state={this.props.state}/>

        <VisualizeMini state={this.props.state}/>


      </div>
    )
  }
}

export default Dashboard
