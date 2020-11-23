/* eslint-disable no-use-before-define */
import React from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { regionType, stateType } from './Utils'

export default function ComboBox (props) {

  let opts;

  if (props.type === stateType) {
    opts = top100Films1
  } else if (props.type === regionType) {
    opts = top100Films2
  } else {
    opts = top100Films3
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

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films1 = [
  'Snatch1',
  '3 Idiots',
  'Monty Python and the Holy Grail'
]

const top100Films2 = [
  'Snatch2',
  '3 Idiots',
  'Monty Python and the Holy Grail'
]

const top100Films3 = [
  'Snatch3',
  '3 Idiots',
  'Monty Python and the Holy Grail'
]
