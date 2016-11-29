import { forIn } from 'lodash'
import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { LayersControl, GeoJson } from 'react-leaflet'
import { getAllElectionsForCountry,
         getAllCountryLevelExecutives,
         getAllCountryLegislatorsUpper,
         getAllCountryLegislatorsLower
} from '../services/ElectedRepsService.js'
import partyCodeToColor from '../fixtures/partyColors'

require('../js/leaflet.pattern-src');

// GeoJson containers
import States from './States'
import CongressionalDistricts from './CongressionalDistricts'
import Countries from './Countries'

export default class LayerControl extends React.Component {
  constructor(props) {
    super(props)
    // console.log(props)
    this.state = {
      leafletMap: props.map,
      country: 'US',
      elections: {},
      countryExecutives: {},
      countryLegislativeUpper: {},
      countryLegislativeLower: {},
      defaultStatePatternsForSenate: {}
    }

    // Methods
    this.createDefaultStripePatternForState = this.createDefaultStripePatternForState.bind(this)
    this.getPartyColor = this.getPartyColor.bind(this)

    getAllCountryLevelExecutives(this.state.country.toLowerCase()).then(res => {
      if (res.status !== 200) {
        // console.log(`Looks like there was a problem. Status Code: + ${res.status}`)
        console.error(res)
      }

      res.json().then(data => {
        delete data._id
        // console.log(data)
        this.setState({
          countryName: data.name,
          countryExecutives: data.representatives
        })
        // console.log(this.state)
      }, err => {
        console.error(err)
      })
    }, err => {
      console.error(err)
    })

    getAllCountryLegislatorsUpper(this.state.country.toLowerCase()).then(res => {
      if (res.status !== 200) {
        // console.log(`Looks like there was a problem. Status Code: + ${res.status}`)
        console.error(res)
      }

      res.json().then(reps => {
        delete reps._id
        this.setState({ countryLegislativeUpper: reps })

        forIn(this.state.countryLegislativeUpper, (reps, stateCode, countryLegislativeUpper) => {
          this.createDefaultStripePatternForState(stateCode, countryLegislativeUpper)
          // this.createElectionStripePatternForState(stateCode, countryLegislativeUpper)
        })

        // console.log(this.state.defaultStatePatternsForSenate)
      }, err => {
        console.error(err)
      })
    }, err => {
      console.error(err)
    })

    getAllCountryLegislatorsLower(this.state.country.toLowerCase()).then(res => {
      if (res.status !== 200) {
        // console.log(`Looks like there was a problem. Status Code: + ${res.status}`)
        console.error(res)
      }

      res.json().then(reps => {
        delete reps._id
        this.setState({ countryLegislativeLower: reps })
        // console.log(this.state.countryLegislativeLower)
      }, err => {
        console.error(err)
      })
    }, err => {
      console.error(err)
    })

    getAllElectionsForCountry(this.state.country).then(res => {
      if (res.status !== 200) {
        // console.log(`Looks like there was a problem. Status Code: + ${res.status}`)
        console.error(res)
      }

      res.json().then(elections => {
        this.setState({ elections: elections })
      }, err => {
        console.error(err)
      })
    }, err => {
      console.error(err)
    })
  }

  getPartyColor(partyName) {
    const code = partyName === '' ? 'IND' : partyName.substring(0, 3)
    // console.log(code)
    // console.log(partyCodeToColor)
    return partyCodeToColor[code.toUpperCase()]
  }

  /*
    called on a single state/adminSubdiv1
    assumed to contain two representatives (US Senate)
    only creates stripe pattern for two colors/parties/reps
  */
  createDefaultStripePatternForState(stateCode, repsMap) {
    const territories = ['DC', 'AS', 'PR', 'GU', 'MP', 'VI', 'UM']   // these do not have senate representation
    const reps = repsMap[stateCode]

    if (territories.indexOf(stateCode) === -1) {
      const party0 = reps[0].party
      const party1 = reps[1].party
      const color0 = this.getPartyColor(party0)
      const color1 = this.getPartyColor(party1)
      // if (stateCode === 'NY') console.log(`${party0} ${party1}`)
      const pattern = new L.StripePattern({
        color: color0,
        spaceColor: color1,
        patternContentUnits: 'objectBoundingBox',
        patternUnits: 'objectBoundingBox',
        height: 0.2,
        angle: 45,
        opacity: 1.0,
        weight: 0.1,
        spaceOpacity: 1.0,
        spaceWeight: 0.1 // not working,
      })

      pattern.addTo(this.state.leafletMap)
      this.setState({ defaultStatePatternsForSenate: { ...this.state.defaultStatePatternsForSenate, [stateCode]: pattern }})
      return pattern
    } else {
      return null
    }
  }

  render () {
    if (typeof this.state.elections.country === 'undefined' || this.state.elections.country === null || Object.keys(this.state.countryLegislativeLower).length === 0) {
      // TODO: spinner?
      return null;
    }

    return (
      <LayersControl ref='layerControl' className='branch-control'>
        <LayersControl.BaseLayer name='Executive' checked={true} ref='countryExecLayer' >
          <Countries elections={this.state.elections.country.executive}
                     reps={this.state.countryExecutives}
                     layerControl={this} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name='Legislative (Senate)' ref='countryLegisUpperLayer'>
          <States elections={this.state.elections.country.legislativeUpper}
                  reps={this.state.countryLegislativeUpper}
                  defaultPatterns={this.state.defaultStatePatternsForSenate}
                  layerControl={this} />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name='Legislative (House)' ref='countryLegisLowerLayer'>
          <CongressionalDistricts elections={this.state.elections.country.legislativeLower}
                                  reps={this.state.countryLegislativeLower}
                                  layerControl={this} />
        </LayersControl.BaseLayer>
      </LayersControl>
    )
  }
}
