import React from 'react'
import partyCodeToName from '../../server/utils/partyCodesToName'
import partyCodeToColor from '../fixtures/partyColors'

const partyNameToCode = _.reduce(partyCodeToName, (res, name, code) => {
  res[name] = code
  return res
}, {})

const normalizePartyName = (name) => {
  // console.log(name)
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
  // console.log(partyName)
  // console.log(partyCodeToColor[partyNameToCode[partyName]])
  return {
    backgroundColor: partyCodeToColor[partyNameToCode[partyName]],
    borderRadius: '50px',
    height: '5px',
    width: '75px',
    margin: 'auto'
  }
}

const filter = (props) => {
  // console.log(props)
  const partiesToFilter = ['Conservative Party', 'Independence Party', 'Write-In', "Independent", "Constitution Party"]
  return !_.includes(partiesToFilter, props.rep.party)
}

const getIncumbentClassName = (props) => {
  // console.log(props)
  let seatUpForElection = false
  let incumbentLastName = null

  if ((props.rep !== null && props.rep !== undefined) &&
      props.rep.name !== undefined &&
      props.rep.name !== null &&
      props.rep.name !== 'Vacant') {
    const incumbentName = props.rep.name.split(' ')
    incumbentLastName = incumbentName[incumbentName.length-1]
    const incumbentParty = props.rep.party

    if (typeof props.candidates !== 'undefined' && Array.isArray(props.candidates) && props.candidates.length > 0) {
      seatUpForElection = _.includes((_.find(props.candidates, can => {
        return _.includes(can.party, incumbentParty)
      })).name, incumbentLastName)
    }
  }

  /*
    OPEN elections
    TODO: Have senator election objects store the specific seat in contention

    They're all retiring, except for Dan Coats maybe
  */
  const open = {
    CA: "Barbara Boxer",
    MD: "Barbara Mikulski",
    IN: "Daniel Coats",
    NV: "Harry Reid",
    LA: "David Vitter"
  }

  if (_.includes(Object.keys(open), props.state) && incumbentLastName !== null) {
    seatUpForElection = _.includes(open[props.state], incumbentLastName)
  }

  if (props.country === 'US' &&
      props.levelOfGov === 'country' &&
      (props.branchOfGov === 'legislativeLower' || props.branchOfGov === 'executive')) {
    seatUpForElection = true
  }

  if (seatUpForElection) {
    return "seat-up-for-election"
  } else {
    return
  }
}

const getCandidateClassName = (props) => {
  const winner = props.winner

  if (winner === undefined || winner === null) return ""

  const name = props.rep.name.split(' ')
  const lastName = name[name.length-1]
  const party = props.rep.party

  if (_.includes(winner.name, lastName) && party === winner.party) {
    return "election-winner"
  } else {
    return ""
  }
}

// "w3-container"
export default function Sidebar(props, context) {
  // console.log(props)
  const getImg = () => {
    if (typeof props.rep.photo === 'undefined' || typeof props.rep.photo.url === 'undefined' || props.rep.photo.url === "") {
      return '../../img/blank-profile-pic.png'
    } else {
      return props.rep.photo.url
    }
  }

  if (props.type === 'candidate') {
    if (filter(props)) {
      return (
        <li className="w3-container">
          <img src={getImg()} className={getCandidateClassName(props)} style={picStyle} />
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
  } else if (props.type === 'incumbent') {
    return (
      <li className="w3-container">
        <img src={getImg()} className={getIncumbentClassName(props)} style={picStyle} />
        <div className="w3-container w3-center">
          <h5>{props.rep.name}</h5>
          <h6>{normalizePartyName(props.rep.party)}</h6>
          <div className="party-color-bar" style={partyColorBarStyle(normalizePartyName(props.rep.party))}></div>

          {/*<div className="w3-row">
            <div className="w3-container w3-quarter">

            </div>
            <div className="w3-container w3-quarter">
              <h2>w3-quarter</h2>
            </div>
            <div className="w3-container w3-quarter">
              <h2>w3-quarter</h2>
            </div>
            <div className="w3-container w3-quarter">
              <h2>w3-quarter</h2>
            </div>
          </div>*/}

        </div>
      </li>
    )
  }
}
