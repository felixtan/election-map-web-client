import React from 'react'
import partyCodeToName from '../fixtures/partyCodeToName'
import partyCodeToColor from '../fixtures/partyColors'
import countryCodeToNames from '../fixtures/countryISOA2toNames'
import ImageAttribution from '../components/ImageAttribution'
import statesLetterCodeToName from '../fixtures/statesLetterCodeToName'
import { ordinalizeDistrict } from '../utils/helpers'
const blankProfileImg = process.env.NODE_ENV === 'production' ? './img/blank-profile-pic.png' : '../app/public/img/blank-profile-pic.png'

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
  const partiesToFilter = ['Conservative Party', 'Independence Party', 'Write-In', "Constitution Party"]
  return !_.includes(partiesToFilter, props.rep.party)
}

/*
  Determine if a sitting representative's seat is up for re-relection.
  If it is, apply the class .seat-up-for-election which imbues the representative's
  portrait with a red border.

  It's straightforward for house reps but more complex for senators because not all
  senatorial seats are up for election and only one senator of any state is up for
  re-election at any time barring a special election.
*/
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
      let x = _.find(props.candidates, can => {
        return _.includes(can.party, incumbentParty)
      })

      seatUpForElection = x === undefined ? false : _.includes(x.name.toLowerCase(), incumbentLastName.toLowerCase())
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
    seatUpForElection = _.includes(open[props.state].toLowerCase(), incumbentLastName.toLowerCase())
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

  if (winner !== undefined && winner.name !== undefined && winner.name !== null && winner.name !== '' && _.includes(winner.name.toLowerCase(), lastName.toLowerCase()) && party === winner.party) {
    return "election-winner"
  } else {
    return ""
  }
}

const iconLinkStyle = {
  height: '30px',
  weight: '30px',
}

const iconLinkRowStyle = {
  marginTop: '10px'
}

const iconTextStyle = {
  textAlign: 'center'
}

const repLinkStyle = {
  color: 'black',
}

const getOffice = (levelOfGov, branchOfGov, name) => {
  if (levelOfGov === 'country') {
    if (branchOfGov === 'executive') {
      return ""   // world leaders are easy search results
    } else if (branchOfGov === 'legislativeUpper') {
      return "Senator"
    } else if (branchOfGov === 'legislativeLower') {
      return "Representative"
    } else {
      console.log(`Couldn't get office for ${name}`)
    }
  } else if (levelOfGov === 'adminSubDiv1') {
    if (branchOfGov === 'executive') {
      return "Governor"
    } else if (branchOfGov === 'legislativeUpper') {
      return "State Senator"
    } else if (branchOfGov === 'legislativeLower') {
      return "State Assembly"
    } else {
      console.log(`Couldn't get office for ${name}`)
    }
  } else if (levelOfGov === 'local') {

  } else {
    console.log(`Couldn't get office for ${name}`)
  }
}

// TODO: Year should come from the data/backend
const getElection = (props, year) => {
  const levelOfGov = props.levelOfGov
  const branchOfGov = props.branchOfGov
  const country = props.country
  const state = props.state !== null ? statesLetterCodeToName[props.state] : null
  const dist = props.district !== null ? ordinalizeDistrict(props.district) : null

  if (levelOfGov === 'country') {
    if (branchOfGov === 'executive') {
      return `${year} presidential election candidate`
    } else if (branchOfGov === 'legislativeUpper') {
      return `${year} ${state} senate election candidate`
    } else if (branchOfGov === 'legislativeLower') {
      return `${year} ${state} ${dist} district house election candidate`
    } else {
      console.log(`Couldn't get office for ${name}`)
    }
  } else if (levelOfGov === 'adminSubDiv1') {
    if (branchOfGov === 'executive') {
      return "Governor"
    } else if (branchOfGov === 'legislativeUpper') {
      return "State Senator"
    } else if (branchOfGov === 'legislativeLower') {
      return "State Assembly"
    } else {
      console.log(`Couldn't get office for ${name}`)
    }
  } else if (levelOfGov === 'local') {
    //
  } else {
    console.log(`Couldn't get office for ${name}`)
  }
}

const createGoogleSearchUrl = (props) => {
  // console.log(props)
  const name = props.rep.name.toLowerCase().split(' ')
  const country = countryCodeToNames[props.country].informal.toLowerCase().split(' ')

  const officeOrElection = (props.type === 'incumbent') ? getOffice(props.levelOfGov, props.branchOfGov, props.rep.name).toLowerCase().split(' ') : getElection(props, 2016).toLowerCase().split(' ')
  const query = (props.type === 'incumbent') ? _.concat(name, country, officeOrElection).join('+') : _.concat(name, officeOrElection).join('+')
  return `http://www.google.com/search?q=${query}`
}

const createAttrib = (photo) => {
  if (photo.attrib === undefined || photo.attrib === null || photo.attrib === 'public domain') {
    return
  } else {
    // remove "by"
    return photo.attrib.substring(2)
  }
}

// "w3-container"
export default function Sidebar(props, context) {
  // console.log(props.rep.name)
  // console.log(createQueryString(props))

  const getImg = () => {
    if (props.rep.photo === undefined || props.rep.photo.url === null || props.rep.photo.url === undefined || props.rep.photo.url === "") {
      return blankProfileImg
    } else {
      return props.rep.photo.url
    }
  }

  if (props.type === 'candidate') {
    if (filter(props)) {
      return (
        <li className="w3-container">
          <div className="w3-container w3-center">
            <img src={getImg()} className={getCandidateClassName(props)} style={picStyle} />
            {/*<p style={attribStyle}>{createAttrib(props.rep.photo)}</p>*/}
            <ImageAttribution photo={props.rep.photo} />
          </div>
          <div className="w3-container w3-center">
            <h5><a className='rep-link' style={repLinkStyle} href={createGoogleSearchUrl(props)} target='_blank'>{props.rep.name}</a></h5>
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
        <div className="w3-container w3-center">
          <img src={getImg()} className={getIncumbentClassName(props)} style={picStyle} />
          {/*<p style={attribStyle}>{createAttrib(props.rep.photo)}</p>*/}
          <ImageAttribution photo={props.rep.photo} />
        </div>
        <div className="w3-container w3-center">
          <h5><a className='rep-link' style={repLinkStyle} href={createGoogleSearchUrl(props)} target='_blank'>{props.rep.name}</a></h5>
          <h6>{normalizePartyName(props.rep.party)}</h6>
          <div className="party-color-bar" style={partyColorBarStyle(normalizePartyName(props.rep.party))}></div>
        </div>
      </li>
    )
  }
}
