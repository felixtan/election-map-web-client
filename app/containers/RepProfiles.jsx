import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import Profile from '../components/RepProfile'
import stateCodeToName from '../fixtures/statesLetterCodeToName'
import countryCodeToNames from '../fixtures/countryISOA2toNames'
import { getCongressionalDistrictName } from '../utils/helpers'

export default class RepInfo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: props.selected,
      elections: props.elections
    }

    this.getOfficeTitle = this.getOfficeTitle.bind(this)
    this.activeElections = this.activeElections.bind(this)
    this.candidatesSectionStyle = this.candidatesSectionStyle.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps)
    if (this.state.selected === null
      || this.state.selected.reps[0].name !== nextProps.selected.reps[0].name
      || this.state.selected.branchOfGov !== nextProps.selected.branchOfGov
      || this.state.selected.levelOfGov !== nextProps.selected.levelOfGov
      || this.state.selected.state !== nextProps.selected.state
      || this.state.selected.district !== nextProps.selected.district) {
      this.setState({ selected: nextProps.selected, elections: nextProps.elections })
    }
    // console.log(this.state)
  }

  // This is temporary
  // TODO: update each rep object to store office title
  getOfficeTitle(rep) {
    // console.log(rep)
    if (typeof rep.office === 'undefined' || rep.office === null || (typeof rep.office === 'string' && rep.office.length === 0)) {
      if (this.state.selected.levelOfGov === 'country') {
        if (this.state.selected.branchOfGov === 'legislativeUpper') {
          return `${countryCodeToNames[this.state.selected.country].informal} Senator from ${stateCodeToName[this.state.selected.state]}`
        } else if (this.state.selected.branchOfGov === 'legislativeLower') {
          return `${countryCodeToNames[this.state.selected.country].informal} Representative from the ${getCongressionalDistrictName(this.state.selected.district)} Congressional District of ${stateCodeToName[this.state.selected.state]}`
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

  // Temporary
  // TODO: store election name for each level and branch in elections data from backend
  getElectionName() {
    if (this.state.selected.levelOfGov === 'country') {
      if (this.state.selected.branchOfGov === 'executive') {
        return `Candidates for the 2016 ${countryCodeToNames[this.state.selected.country].informal} Presidential Election`
      } else if (this.state.selected.branchOfGov === 'legislativeUpper') {
        return `Candidates for the 2016 ${countryCodeToNames[this.state.selected.country].informal} Senate Election in ${stateCodeToName[this.state.selected.state]}`
      } else if (this.state.selected.branchOfGov === 'legislativeLower') {
        return `Candidates for the 2016 ${countryCodeToNames[this.state.selected.country].informal} House of Representatives Election in the ${getCongressionalDistrictName(this.state.selected.district)} Congressional District of ${stateCodeToName[this.state.selected.state]}`
      } else {
        return `Undhandled election name for levelOfGov=country, branchOfGov=${this.state.selected.branchOfGov}`
      }
    } else {
      return `Undhandled election name for levelOfGov=${this.state.selected.levelOfGov}`
    }
  }

  activeElections() {
    return (typeof this.state.elections.candidates !== 'undefined' && this.state.elections.candidates.length > 0)
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
    let incumbents = []
    let candidates = [];

    // const listStyle = {
    //   listStyleType: 'none',
    //   marginBottom: '5px'
    // }

    if (this.state.selected === null) {
      return (<h2>Select an area.</h2>)
    } else {
      // console.log(this.state)
      if (this.state.elections !== null && typeof this.state.elections.candidates !== 'undefined' && this.state.elections.candidates.length > 0) {
        candidates = this.state.elections.candidates.reduce((res, can, index) => {
          const profile = (
            <Profile rep={can}
                     type="candidate"
                     levelOfGov={this.state.selected.levelOfGov}
                     branchOfGov={this.state.selected.branchOfGov}
                     country={this.state.selected.country}
                     state={this.state.selected.state}
                     district={this.state.selected.district}
                     key={index}
                     candidates={this.state.elections.candidates}
                     winner={this.state.elections.winner} />
          )

          if (this.state.elections.winner.name === can.name) {
            // if (this.state.selected.state === 'MI' && this.state.selected.district == 10) console.log(can.name)
            res.unshift(profile)
          } else {
            res.push(profile)
          }

          return res
        }, [])
      }

      incumbents = this.state.selected.reps.map((rep, index, reps) => {
        return (
          <Profile rep={rep}
                   type="incumbent"
                   levelOfGov={this.state.selected.levelOfGov}
                   branchOfGov={this.state.selected.branchOfGov}
                   country={this.state.selected.country}
                   state={this.state.selected.state}
                   district={this.state.selected.district}
                   key={index}
                   candidates={this.state.elections.candidates} />)
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
