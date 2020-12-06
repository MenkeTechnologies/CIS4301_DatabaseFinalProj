import React, { Component } from 'react';

import {
  createBarChart,
  MAXI_ADAPT_WINDOW,
  svgHeightMaxi,
  svgHeightMini,
  svgWidthMaxi,
  svgWidthMini,
} from '../util/Utils';

class BarChart extends Component {

  createChart () {
    const appState = this.props.state;
    if (this.props.size === 'mini') {

      createBarChart(appState, svgHeightMini, svgWidthMini, this.node);
    } else {

      if (MAXI_ADAPT_WINDOW) {

        createBarChart(appState, window.innerHeight - 80, window.innerWidth,
          this.node);
      } else {

        createBarChart(appState, svgHeightMaxi, svgWidthMaxi, this.node);
      }

    }
  }

  componentDidMount () {
    this.createChart();
  }

  componentDidUpdate () {
    this.createChart();

  }

  render () {
    return <svg ref={node => this.node = node}
                width={500} height={500}>
    </svg>;
  }
}

export default BarChart;
