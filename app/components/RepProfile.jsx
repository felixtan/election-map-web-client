import React from 'react'
import partyCodeToName from '../../server/utils/partyCodesToName'
import partyCodeToColor from '../fixtures/partyColors'

const partyNameToCode = _.reduce(partyCodeToName, (res, name, code) => {
  res[name] = code
  return res
}, {})

const normalizePartyName = (name) => {
  return (!_.includes(name, 'Party') && name !== 'Independent') ? `${name} Party` : name
}

const picStyle = {
  width: '50%',
  margin: 'auto',
  display: 'block'
}

const profileStyle = (index, last) => {
  if (last >= 1 && index === last) {
    return { marginTop: '5px' }
  } else if (last >= 1 && index > 0) {
    return { marginTop: '5px', marginBottom: '5px' }
  } else {
    return {}
  }
}

const partyColorBarStyle = (partyName) => {
  return {
    backgroundColor: partyCodeToColor[partyNameToCode[partyName]],
    borderRadius: '20px',
    height: '5px',
    width: '75px',
    margin: 'auto'
  }
}

const filter = (props) => {
  const partiesToFilter = ['Conservative Party', 'Independence Party', 'Write-In']
  return !_.includes(partiesToFilter, props.rep.party)
}

// "w3-container"
export default function Sidebar(props, context) {

  const getImg = () => {
    if (typeof props.rep.photoUrl === 'undefined' || props.rep.photoUrl === "") {
      return '../../img/blank-profile-pic.png'
    } else {
      return props.rep.photoUrl
    }
  }

  if (filter(props)) {
    return (
      <li className="w3-container">
        <img src={getImg()} style={picStyle} />
        <div className="w3-container w3-center">
          <h5>{props.rep.name}</h5>
          <h6>{props.rep.party}</h6>
          <div className="party-color-bar" style={partyColorBarStyle(normalizePartyName(props.rep.party))}></div>
        </div>
      </li>
    )
  } else {
    return <span style={{ display: 'none' }}></span>
  }
}
