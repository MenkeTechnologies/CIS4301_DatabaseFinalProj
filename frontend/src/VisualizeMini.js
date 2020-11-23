import React, { Component } from 'react'
import BarChart from './BarChart'

class VisualizeMini extends Component {
  render () {
    return (
      <div>

        <h2>mini</h2>

        <BarChart data={[5, 10, 1, 3]} size={[500, 500]}/>

      </div>
    )
  }
}

export default VisualizeMini
