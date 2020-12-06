import * as d3 from 'd3';
import React from 'react';

export const restrictionType = 'restriction';
export const stateType = 'state';
export const regionType = 'region';

export const ANY = 'ANY';
export const dashboardPath = '/dashboard';
export const visualizePath = '/visualize';
export const BAR_COLOR = '#ee9922';
const NUM_WEEKS = '3';
const NUM_ROWS = '10';
export const H_LEVEL = 'h6';
export const H_LEVEL_COMP = 'h6';
export const svgWidthMini = 500, svgHeightMini = 625;
export const svgWidthMaxi = 1500, svgHeightMaxi = 1025;

export const DEBUG_GLOBAL = false;
export const MAXI_ADAPT_WINDOW = true;

export const debugLog = (msg) => {

  if (DEBUG_GLOBAL) {
    console.log(msg);
  }

};

export const debugJson = (values) => {

  let json = <div/>;
  if (DEBUG_GLOBAL) {
    json = <pre>{JSON.stringify(values, 0, 4)}</pre>;
  }
  return json;

};

export const createBarChart = (appState, svgHeight, svgWidth, node) => {

  const obj = {};
  let data = {};
  let sourceNames = [], sourceCount = [];
  let chartTitle = '';
  if (appState.initialState.barData.data.length === 0) {

    for (let key in data) {
      if (data.hasOwnProperty(key)) {
        sourceNames.push(key);
        sourceCount.push(parseInt(data[key]));
      }
    }
  } else {

    if (appState.initialState.dataSelValue.cases) {
      chartTitle = 'Covid Cases';
    } else if (appState.initialState.dataSelValue.popHome) {
      chartTitle = 'Population at Home';
    } else {
      chartTitle = 'Number of Trips';
    }

    // let type = appState.initialState.barData.type;
    let allData = appState.initialState.barData.data;

    clearKeys(obj);

    for (let i = 0; i < allData.length; ++i) {
      const [state, data] = Object.values(allData[i]);
      sourceCount.push(data);
      sourceNames.push(state);
      obj[state] = data;
    }

    data = obj;

  }

  let margin = { top: 80, right: 20, bottom: 30, left: 50 };
  let height = svgHeight - margin.top - margin.bottom,
    width = svgWidth - margin.left - margin.right;

  let svg = d3.select(node);
  svg.selectAll('svg > *').remove();

  let x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
    y = d3.scaleLinear().rangeRound([height, 0]);

  x.domain(sourceNames);
  y.domain([0, d3.max(sourceCount, function (d) { return d; })]);

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
    .call(d3.axisLeft(y).ticks(10))
  ;

  svg.append('text')
    .attr('x', (width / 2))
    .attr('y', 20 - (margin.top / 2))
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('text-decoration', 'underline')
    .text(chartTitle);

// Create rectangles
  let bars = svg.selectAll('rect')
    .data(sourceNames)
    .enter()
    .append('g');

  bars.append('rect')
    .attr('class', 'bar')
    .style('fill', BAR_COLOR)
    .attr('x', function (d) { return x(d); })
    .attr('y', function (d) { return y(data[d]); })
    .attr('width', x.bandwidth())
    .attr('height', function (d) { return height - y(data[d]); });

  bars.append('text')
    // .text(function (d) {
    //   return data[d];
    // })
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

export const getApiURL = (data) => {

  if (data) {

    const weeks = data.numWeeks || NUM_WEEKS;
    const row = data.numRecords || NUM_ROWS;

    return `http://localhost:8000/handle/${weeks}/${row}`;
  } else {

    return `http://localhost:8000/handle/${NUM_WEEKS}/${NUM_ROWS}`;
  }
};

export const clearKeys = (obj) => {
  for (const variableKey in obj) {
    if (obj.hasOwnProperty(variableKey)) {
      delete obj[variableKey];
    }
  }

};
