/* eslint-disable no-use-before-define */
import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { regionType, stateType } from '../util/Utils'

import usaStates from '../data/states.js'
import restrictions from '../data/restriction'
import regionNames from '../data/regions'

export default function ComboBox (props) {

  let opts

  if (props.type === stateType) {
    opts = Object.keys(usaStates)
  } else if (props.type === regionType) {
    opts = regionNames
  } else {
    opts = restrictions
  }

  return (
    <Autocomplete
      id="combo-box-demo"
      options={opts}
      value={props.init}
      getOptionLabel={(option) => option}
      onChange={props.cb}
      renderInput={(params) => <TextField {...params} label={props.type}

                                          variant="outlined"/>}
    />
  )
}
