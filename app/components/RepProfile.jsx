import React from 'react'
import partyCodeToName from '../../server/data/partyCodeToName'
import partyCodeToColor from '../fixtures/partyColors'
import countryCodeToNames from '../fixtures/countryISOA2toNames'
import ImageAttribution from '../components/ImageAttribution'

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

// const profileStyle = (index, last) => {
//   if (last >= 1 && index === last) {
//     return { marginTop: '5px' }
//   } else if (last >= 1 && index > 0) {
//     return { marginTop: '5px', marginBottom: '5px' }
//   } else {
//     return {}
//   }
// }

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
      })).name.toLowerCase(), incumbentLastName.toLowerCase())
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
  // return {
    height: '30px',
    // maxHeight: '100%',
    weight: '30px',
    // maxWidth: '100%'
  // }
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

const createGoogleSearchUrl = (props) => {
  // let terms = props.rep.name + " "
  const name = props.rep.name.toLowerCase().split(' ')
  const country = countryCodeToNames[props.country].informal.toLowerCase().split(' ')
  const office = getOffice(props.levelOfGov, props.branchOfGov, props.rep.name).toLowerCase().split(' ')
  const query = _.concat(name, country, office).join('+')
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
      return '../../img/blank-profile-pic.png'
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

/*
<div className="w3-row-padding w3-center w3-rest" style={iconLinkRowStyle}>
  <div className="w3-container w3-third icon-link" style={iconTextStyle}>
    <a href={props.rep.urls[0]}></a>
    <img src="../../img/icon-wikipedia.png" style={iconLinkStyle}/>
    Wikipedia
  </div>
  <div className="w3-container w3-third icon-link">
    <a href={props.rep.urls[1]}></a>
    <img src="../../img/icon-ballotpedia.png" style={iconLinkStyle}/>
    Ballotpedia
  </div>
  <div className="w3-container w3-third icon-link">
    <a href={props.rep.urls[1]}></a>
    <img src="../../img/icon-united-states-seal.png" style={iconLinkStyle}/>
    Official
  </div>
  {/*<div className="w3-container w3-quarter icon-link">
    <a href={props.rep.urls[1]}></a>
    <img src="../../img/icon-google.png" style={iconLinkStyle}/>
    Google
  </div>
</div>
*/
