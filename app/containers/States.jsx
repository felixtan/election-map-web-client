import { includes } from 'lodash'
import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { GeoJson } from 'react-leaflet'
import PopupContainer from './Popup'
import states from '../fixtures/geojson/us-states-20m-census2015.json';
import statesLetterCodeToName from '../fixtures/statesLetterCodeToName'
import partyCodeToColor from '../fixtures/partyColors'

export default class GeoJsonLayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      layerControl: props.layerControl,
      leafletMap: null,
      defaultPatterns: props.defaultPatterns,
      geoData: states,
      country: 'US',
      reps: props.reps,
      elections: props.elections,
      levelOfGov: 'country',
      branchOfGov: 'legislativeUpper',

      // US specific
      territories: ['DC', 'AS', 'PR', 'GU', 'MP', 'UM', 'VI']
    }

    this.onEachFeature = this.onEachFeature.bind(this)
    this.style = this.style.bind(this)
    this.displayProfiles = this.displayProfiles.bind(null, this)
    this.getPartyColor = this.getPartyColor.bind(this)
    this.highlightFeature = this.highlightFeature.bind(this)
    this.resetHighlight = this.resetHighlight.bind(this)
  }

  style (feature) {
    const state = feature.properties.STUSPS
    const candidates = this.state.elections[state].candidates
    // if (typeof candidates === 'undefined') console.log(this.state.elections[state])
    // if (typeof candidates === 'undefined') console.log(state)

    if (!_.includes(this.state.territories, state)) {
      const pattern = this.state.defaultPatterns[state]
      return {
        fillPattern: pattern,
        fillOpacity: 0.4,
        color: 'red',
        opacity: (Array.isArray(candidates) && candidates.length > 0) ? 0.5 : 0,
        weight: 2.0,
        className: (Array.isArray(candidates) && candidates.length > 0) ? 'election-status-active' : 'election-status-inactive'
      }
    } else {
      return {
        fillColor: 'black',
        fillOpacity: 0.4,
        opacity: 0,
        weight: 2.0,
        className: 'election-status-inactive'
      }
    }
  }

  getPartyColor(partyName) {
    const code = partyName === '' ? 'IND' : partyName.substring(0, 3)
    // console.log(code)
    // console.log(partyCodeToColor)
    return partyCodeToColor[code.toUpperCase()]
  }

  displayProfiles(component, e) {
    const geojson = component.refs.geojson.leafletElement
    const state = e.target.feature.properties.STUSPS

    // console.log(component.state.elections)
    if (!_.includes(component.state.territories, state)) {
      component.props.layerControl.props.onSelect({
        reps: component.state.reps[state],
        country: component.state.country,
        state: state,
        district: null,
        levelOfGov: component.state.levelOfGov,
        branchOfGov: component.state.branchOfGov,
      }, component.state.elections[state])
    }
  }

  highlightFeature(e) {
    const state = e.target.feature.properties.STUSPS

    this.props.layerControl.props.onHover({
      country: this.state.country,
      state: state,
      district: null,
      levelOfGov: this.state.levelOfGov,
      branchOfGov: this.state.branchOfGov,
    })

    e.target.setStyle({ color: '#000000', 'opacity': 0.5, 'weight': 2.5 })
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

               {/*<PopupContainer content={this.state.popupContent}/>*/}
      </GeoJson>
    )
  }
}
