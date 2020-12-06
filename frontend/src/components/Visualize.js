import React from 'react';
import BarChart from './BarChart';

const Visualize = (props) => {
  const appState = props.state;
  return (
    <div>

      <BarChart state={appState} size={'maxi'}/>

    </div>
  );

};

export default Visualize;
