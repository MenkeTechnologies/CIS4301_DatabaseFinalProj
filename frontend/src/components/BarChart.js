import React, { Component } from 'react';
import * as d3 from 'd3';

import { clearKeys } from '../util/Utils';

class BarChart extends Component {

  componentDidMount () {
    this.createBarChart();
  }

  componentDidUpdate () {
    this.createBarChart();
  }

  createBarChart = () => {

    const appState = this.props.state;

    const node = this.node;
    const obj = {};
    let data;
    let sourceNames = [], sourceCount = [];
    if (appState.initialState.barData.data.length === 0) {

      data = {};
      for (let key in data) {
        if (data.hasOwnProperty(key)) {
          sourceNames.push(key);
          sourceCount.push(parseInt(data[key]));
        }
      }
    } else {

      let type = appState.initialState.barData.type;
      let allData = appState.initialState.barData.data;

      const bars = [];
      const labels = [];
      clearKeys(obj);

      for (var i = 0; i < allData.length; ++i) {
        const [state, data] = Object.values(allData[i]);
        sourceCount.push(data);
        sourceNames.push(state);
        obj[state] = data;
      }

      data = obj;

    }

    let margin = { top: 20, right: 20, bottom: 30, left: 40 };
    let svgWidth = 720, svgHeight = 300;
    let height = svgHeight - margin.top - margin.bottom,
      width = svgWidth - margin.left - margin.right;

    let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
      y = d3.scaleLinear().rangeRound([height, 0]);

    x.domain(sourceNames);
    y.domain([0, d3.max(sourceCount, function (d) { return d; })]);

    let svg = d3.select(node);

    svg.selectAll('svg > *').remove();

    svg.attr('height', svgHeight)
      .attr('width', svgWidth);

    svg = svg.append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    svg.append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', 'translate(0,' + height + ')')
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(y).ticks(5))
    ;

// Create rectangles
    let bars = svg.selectAll('rect')
      .data(sourceNames)
      .enter()
      .append('g');

    bars.append('rect')
      .attr('class', 'bar')
      .style('fill', '#ee9922')
      .attr('x', function (d) { return x(d); })
      .attr('y', function (d) { return y(data[d]); })
      .attr('width', x.bandwidth())
      .attr('height', function (d) { return height - y(data[d]); });

    bars.append('text')
      .text(function (d) {
        return data[d];
      })
      .attr('x', function (d) {
        return x(d) + x.bandwidth() / 2;
      })
      .attr('y', function (d) {
        return y(data[d]) - 5;
      })
      .attr('font-family', 'sans-serif')
      .attr('font-size', '14px')
      .attr('fill', 'black')
      .attr('text-anchor', 'middle');

    // const dataMax = max(data);
    //
    // const yScale = scaleLinear()
    //   .domain([0, dataMax])
    //   .range([0, this.props.size[1]]);
    // select(node).selectAll('rect').data(data).enter().append('rect');
    //
    // select(node).selectAll('rect').data(data).exit().remove();
    //
    // select(node)
    //   .selectAll('rect')
    //   .data(obj)
    //   .style('fill', '#ee9922')
    //   .attr('class', 'label')
    //   .attr('x', (d, i) => {
    //     // console.log(`\n_____________'d1' = '${JSON.stringify(d)}'_____________\n`);
    //     return i * 25;
    //   })
    //   .attr('y', d => {
    //     // console.log(`\n_____________'d2' = '${JSON.stringify(d)}'_____________\n`);
    //     return this.props.size[1] - yScale(d);
    //   })
    //   .attr('height', d => yScale(d))
    //   .attr('width', 25)
    //   .text((d) => {
    //     // console.log(`\n_____________'d3' = '${JSON.stringify(d)}'_____________\n`);
    //     return d.value;
    //   });
  };

  render () {
    return <svg ref={node => this.node = node}
                width={500} height={500}>
    </svg>;
  }
}

export default BarChart;
