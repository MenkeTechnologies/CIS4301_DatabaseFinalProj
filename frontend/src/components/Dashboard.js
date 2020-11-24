import React, { Component } from 'react'
import MainForm from './MainForm'
import VisualizeMini from './VisualizeMini'
import { Grid, Typography } from '@material-ui/core'

class Dashboard extends Component {

  constructor (props) {
    super(props)

  }

  componentDidMount () {

  }

  render () {
    return (
      <div>

        <Grid container alignItems="flex-start" spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" align="center" component="h1" gutterBottom>
              Covid Travel Data Home
            </Typography>
          </Grid>
          <Grid item sm={12} md={6}>
            <MainForm state={this.props.state}/>
          </Grid>

          <Grid item sm={12} md={6}>
            <VisualizeMini state={this.props.state}/>
          </Grid>
        </Grid>


      </div>
    )
  }
}

export default Dashboard
