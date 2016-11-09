import React from 'react'
import statesLetterCodeToName from '../fixtures/statesLetterCodeToName'
import countryISOA2toNames from '../fixtures/countryISOA2toNames'
import { getCongressionalDistrictName } from '../utils/helpers'

const districtNameStyle = (props) => {
  if (props.highlighted.district !== undefined && props.highlighted.district !== null) {
    return {
      fontWeight: 'bold'
    }
  } else {
    return {
      display: 'none'
    }
  }
}

const stateNameStyle = (props) => {
  if (props.highlighted.state !== undefined && props.highlighted.state !== null) {
    return {
      fontWeight: 'bold'
    }
  } else {
    return {
      display: 'none'
    }
  }
}

const countryNameStyle = (props) => {
  return {
    fontWeight: 'bold'
  }
}

export default function AreaInfo(props, context) {
  // console.log(props)
  if (props.highlighted === null) {
    return (
      <div className='w3-container area-info' style={countryNameStyle()}>
      </div>
    )
  } else {
    //  className="w3-right-align"
    return (
      <div className='w3-container area-info'>
        <p style={districtNameStyle(props)}>{getCongressionalDistrictName(props.highlighted.district)} Congressional District</p>
        <p style={stateNameStyle(props)}>{statesLetterCodeToName[props.highlighted.state]}</p>
        <p style={countryNameStyle(props)}>{countryISOA2toNames[props.highlighted.country].informal}</p>
      </div>
    )
  }
}
