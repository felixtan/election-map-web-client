import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { MapControl } from 'react-leaflet'
import Profile from '../components/RepProfile'
import stateCodeToName from '../fixtures/statesLetterCodeToName'
import countryCodeToNames from '../fixtures/countryISOA2toNames'

export default class RepInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: props.selected,
      candidates: props.candidates
    }
    // this.context.map = props.map
    // console.log(this)

    this.getNumberSuffix = this.getNumberSuffix.bind(this)
    this.getOfficeTitle = this.getOfficeTitle.bind(this)
    this.activeElections = this.activeElections.bind(this)
    this.candidatesSectionStyle = this.candidatesSectionStyle.bind(this)
    this.getCongressionalDistrictName = this.getCongressionalDistrictName.bind(this)
  }

  getNumberSuffix(districtNum) {
    const n = typeof districtNum === 'string' ? districtNum : districtNum.toString()
    const lastDigit = n[n.length-1]
    const lastTwoDigits = n.length >= 2 ? n.substring(n.length-2, n.length) : undefined

    // st
    // nd
    // rd
    // th

    if (n.length >= 2 && (lastTwoDigits == 11 || lastTwoDigits == 12)) {
      return 'th'
    } else {
      switch(lastDigit) {
        case '1':
          return 'st'
          break
        case '2':
          return 'nd'
          break
        case '3':
          return 'rd'
          break
        default:
          return 'th'
      }
    }

  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps)
    if (this.state.selected === null
      || this.state.selected.reps[0].name !== nextProps.selected.reps[0].name
      || this.state.selected.branchOfGov !== nextProps.selected.branchOfGov
      || this.state.selected.levelOfGov !== nextProps.selected.levelOfGov
      || this.state.selected.state !== nextProps.selected.state
      || this.state.selected.district !== nextProps.selected.district) {
      this.setState({ selected: nextProps.selected, candidates: nextProps.candidates })
    }
    // console.log(this.state)
  }



  // This is temporary
  // TODO: update each rep object to store office title
  getOfficeTitle(rep) {
    if (typeof rep.office === 'undefined' || rep.office === null || (typeof rep.office === 'string' && rep.office.length === 0)) {
      if (this.state.selected.levelOfGov === 'country') {
        if (this.state.selected.branchOfGov === 'legislativeUpper') {
          return `${countryCodeToNames[this.state.selected.country].informal} Senator from ${stateCodeToName[this.state.selected.state]}`
        } else if (this.state.selected.branchOfGov === 'legislativeLower') {
          return `${countryCodeToNames[this.state.selected.country].informal} Representative from the ${this.getCongressionalDistrictName()} Congressional District of ${stateCodeToName[this.state.selected.state]}`
        } else {
          return 'Unhandled Office'
        }
      } else {
        return 'Unhandled Office'
      }
    } else {
      return rep.office + " of America"
    }
  }

  getCongressionalDistrictName() {
    if (this.state.selected.district !== null) {
      if (!isNaN(this.state.selected.district)) {
        return `${this.state.selected.district}${this.getNumberSuffix(this.state.selected.district)}`
      } else {
        return this.state.selected.district
      }
    }
  }

  // Temporary
  // TODO: store election name for each level and branch in elections data from backend
  getElectionName() {
    if (this.state.selected.levelOfGov === 'country') {
      if (this.state.selected.branchOfGov === 'executive') {
        return `Candidates for the 2016 ${countryCodeToNames[this.state.selected.country].informal} Presidential Election`
      } else if (this.state.selected.branchOfGov === 'legislativeUpper') {
        return `Candidates for the 2016 ${countryCodeToNames[this.state.selected.country].informal} Senate Election in ${stateCodeToName[this.state.selected.state]}`
      } else if (this.state.selected.branchOfGov === 'legislativeLower') {
        return `Candidates for the 2016 ${countryCodeToNames[this.state.selected.country].informal} House of Representatives Election in the ${this.getCongressionalDistrictName()} Congressional District of ${stateCodeToName[this.state.selected.state]}`
      } else {
        return `Undhandled election name for levelOfGov=country, branchOfGov=${this.state.selected.branchOfGov}`
      }
    } else {
      return `Undhandled election name for levelOfGov=${this.state.selected.levelOfGov}`
    }
  }

  activeElections() {
    return this.state.candidates.length > 0
  }

  candidatesSectionStyle() {
    if (this.activeElections()) {
      return {}
    } else {
      return {
        display: 'none'
      }
    }
  }

  render() {
    let incumbents, candidates;

    // const listStyle = {
    //   listStyleType: 'none',
    //   marginBottom: '5px'
    // }

    if (this.state.selected === null) {
      return (<h2>Select an area.</h2>)
    } else {
      if (this.state.candidates !== null && this.state.candidates.length > 0) {
        candidates = this.state.candidates.map((can, index, cans) => {
          return (
            <Profile rep={can}
                     country={this.state.selected.country}
                     state={this.state.selected.state}
                     district={this.state.selected.district}
                     key={index}
                     last={cans.length-1} />
          )
        })
      }

      incumbents = this.state.selected.reps.map((rep, index, reps) => {
        return (
          <Profile rep={rep}
                   country={this.state.selected.country}
                   state={this.state.selected.state}
                   district={this.state.selected.district}
                   key={index}
                   last={reps.length-1} />)
      })

      // {/* To render multiple elements, wrap them inside a container */}
      return (
        <div id="rep-profiles-container" className='w3-container'>
          <div id='incumbent' className='w3-card-2'>
            <h2 className='w3-header w3-center'>{this.getOfficeTitle(this.state.selected.reps[0])}</h2>
          </div>
          <ul className='w3-ul'>
            {incumbents}
          </ul>
          <div id='election-challengers' className='w3-card-2' style={this.candidatesSectionStyle()}>
            <h2 className='w3-header w3-center'>{this.getElectionName()}</h2>
          </div>
          <ul className='w3-ul'>
            {candidates}
          </ul>
        </div>
      )
    }
  }
}
