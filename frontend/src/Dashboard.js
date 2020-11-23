import React, { Component } from 'react'
import MainForm from './MainForm'
import VisualizeMini from './VisualizeMini'

class Dashboard extends Component {

  constructor (props) {
    super(props)
    this.state = {
      isGoing: true,
      numberOfGuests: 2,
    }
  }

  componentDidMount () {

  }

  handleInputChange = (event) => {
    const target = event.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name

    this.setState({
      [name]: value,
    })
  }

  render () {
    return (
      <div>

        <MainForm/>

        <VisualizeMini/>


      </div>
    )
  }
}

export default Dashboard
