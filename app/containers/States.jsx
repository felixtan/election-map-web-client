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
      mousedOverFeature: null,
      defaultPatterns: props.defaultPatterns,
      electionPatterns: null,
      geoData: states,
      country: 'US',
      adminSubdiv1: '',
      reps: props.reps,
      elections: props.elections,
      popupContent: {
        office: '',
        reps: [],
        state: '',
        district: ''
      },
      electionColorDelay: props.electionColorDelay,
      ticks: 0,
      levelOfGov: 'country',
      branchOfGov: 'legislativeUpper'
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
    const pattern = this.state.defaultPatterns[state]

    return {
      fillPattern: pattern,
      fillOpacity: 0.4,
      stroke: this.state.elections[state].length > 0,
      color: null,
      // opacity: this.state.elections[state].length > 0 ? 0.75 : 0,
      weight: 2.0,
      className: this.state.elections[state].length > 0 ? 'election-status-active' : 'election-status-inactive'
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
    component.setState({ popupContent: {
      office: 'US Senate',
      reps: component.state.reps[state],
      state: statesLetterCodeToName[state],
      district: null
    }})
  }

  highlightFeature(e) {
    // this.setState({ electionColor: false })
    const state = e.target.feature.properties.STUSPS
    this.setState({ mousedOverFeature: state })
    e.target.setStyle({ color: '#000000', 'opacity': 0.5 })
  }

  resetHighlight(e) {
    // this.setState({ electionColor: true })
    this.setState({ mousedOverFeature: null })
    this.refs.geojson.leafletElement.resetStyle(e.target)
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

               <PopupContainer content={this.state.popupContent}/>
      </GeoJson>
    )
  }
}
