import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { GeoJson } from 'react-leaflet'
import congressionalDistricts from '../fixtures/geojson/cb_2015_cd114_20m.json';
import fipsToState from '../fixtures/statesFIPSToLetterCodes.js'

export default class GeoJsonLayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      layerControl: props.layerControl,
      geoData: congressionalDistricts,
      levelOfGov: 'country',
      branchOfGov: 'legislativeLower',
      country: 'US',
      reps: props.reps,
      elections: props.elections,
    }

    this.onEachFeature = this.onEachFeature.bind(this)
    this.style = this.style.bind(this)
    this.getColor = this.getColor.bind(this)
    this.displayProfiles = this.displayProfiles.bind(null, this)
    this.highlightFeature = this.highlightFeature.bind(this)
    this.resetHighlight = this.resetHighlight.bind(this)
  }

  style (feature) {
    const geoId = feature.properties.GEOID
    const stateFIPS = geoId.substring(0, 2)
    const state = fipsToState[stateFIPS]
    const dist = (geoId.substring(2, geoId.length) === '00' || state === 'DC' || state === 'PR') ? 1 : parseInt(geoId.substring(2, geoId.length))
    const stateDoc = this.state.elections[state]
    // if (typeof stateDoc[dist] === 'undefined') console.log(`geo${geoId} dist:${dist} state:${state}`)
    // if (typeof stateDoc[dist] === 'undefined') console.log(stateDoc)
    let cans = stateDoc[dist].candidates
    const territories = ['DC', 'PR', 'GU', 'VI', 'AS', 'UM', 'MP']

    //  && (dist !== 98 || dist !== 7 && state !== 'GA')
    if (!_.includes(territories, state)) {
      if (cans === undefined) {
        // console.log(`${state} ${dist}`)
        cans = []
      }
      return {
        fillColor: this.getColor(state, dist),
        fillOpacity: 0.4,
        color: 'red',
        opacity: cans.length > 0 ? 0.5 : 0,
        weight: 1.5,
        className: cans.length > 0 ? 'election-status-active' : 'election-status-inactive'
      }
    } else {
      return {}
    }
  }

  getColor(state, dist) {
    if (typeof this.state.reps[state] === 'undefined' || typeof this.state.reps[state][dist] === 'undefined' || this.state.reps[state][dist].name === 'Vacant') {
      // if (state === 'AZ') console.log(`${dist}`)
      // GA 7 is undefined
      return 'eeeeee';
    } else {
      const rep = this.state.reps[state][dist]
      if (rep.party === undefined) console.log(rep)
      const party = rep.party.replace(/Party/g, '').trim()

      switch (party) {
        case 'Democratic':
          return '#0000ff';
        case 'Republican':
          return '#ff0000';
        default:
          return 'eeeeee';
      }
    }
  }

  displayProfiles(component, e) {
    const feature = e.target.feature
    const geoId = feature.properties.GEOID
    const stateFIPS = geoId.substring(0, 2)
    const state = fipsToState[stateFIPS]
    let dist = (geoId.substring(2, geoId.length) === '00') ? 1 : parseInt(geoId.substring(2, geoId.length))

    // for some reason, it's 98
    if (state === 'PR' || state === 'DC') dist = 1

    // console.log(component.state.elections[state])
    component.props.layerControl.props.onSelect({
      reps: [component.state.reps[state][dist]],
      country: component.state.country,
      state: state,
      district: Object.keys(component.state.reps[state]).length === 1 ? 'At-large' : dist,
      levelOfGov: component.state.levelOfGov,
      branchOfGov: component.state.branchOfGov,
    }, component.state.elections[state][dist])
  }

  highlightFeature(e) {
    const feature = e.target.feature
    const geoId = feature.properties.GEOID
    const stateFIPS = geoId.substring(0, 2)
    const state = fipsToState[stateFIPS]
    let dist = (geoId.substring(2, geoId.length) === '00') ? 1 : parseInt(geoId.substring(2, geoId.length))

    this.props.layerControl.props.onHover({
      country: this.state.country,
      state: state,
      district: Object.keys(this.state.reps[state]).length === 1 ? 'At-large' : dist,
      levelOfGov: this.state.levelOfGov,
      branchOfGov: this.state.branchOfGov,
    })

    e.target.setStyle({ color: '#000000', 'opacity': 0.5, 'weight': 2.0 })
    e.target.bringToFront()
  }

  resetHighlight(e) {
    this.refs.geojson.leafletElement.resetStyle(e.target)
    this.props.layerControl.props.onHover(null)
  }

  onEachFeature (component, feature, layer) {
    layer.on({
      mouseover: component.highlightFeature,
      mouseout: component.resetHighlight,
      click: component.displayProfiles
    })
  }

  render() {
    return (
      <GeoJson data={this.state.geoData}
               onEachFeature={this.onEachFeature.bind(null, this)}
               ref="geojson"
               style={this.style}>
      </GeoJson>
    )
  }
}
