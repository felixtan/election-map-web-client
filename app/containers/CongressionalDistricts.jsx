import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { GeoJson } from 'react-leaflet'
import PopupContainer from './Popup'
import congressionalDistricts from '../fixtures/geojson/cb_2015_cd114_20m.json';
import fipsToState from '../fixtures/statesFIPSToLetterCodes.js'

export default class GeoJsonLayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      layerControl: props.layerControl,
      mousedOverFeature: null,
      geoData: congressionalDistricts,
      levelOfGov: 'country',
      branchOfGov: 'legislativeLower',
      country: 'US',
      adminSubdiv1: '',
      reps: props.reps,
      elections: props.elections,
      electionColorDelay: props.electionColorDelay,
      ticks: 0,
      popupContent: {
        office: '',
        reps: [],
        state: '',
        district: ''
      }
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
    const dist = (geoId.substring(2, geoId.length) === '00') ? 1 : parseInt(geoId.substring(2, geoId.length))
    const stateDoc = this.state.elections[state]
    const distDoc = stateDoc[dist]
    const territories = ['DC', 'PR', 'GU', 'VI', 'AS', 'UM', 'MP']

    if (!_.includes(territories, state) && geoId !== this.state.mousedOverFeature) {
      return {
        fillColor: this.getColor(state, dist),
        fillOpacity: 0.4,
        stroke: distDoc.length > 0,
        color: null,
        weight: 1.5,
        className: distDoc.length > 0 ? 'election-status-active' : 'election-status-inactive'
      }
    } else {
      return {}
    }
  }

  getColor(state, dist) {
    const rep = this.state.reps[state][dist]
    const party = rep.party

    switch (party) {
      case 'Democratic':
        return '#0000ff';
      case 'Republican':
        return '#ff0000';
      default:
        return 'eeeeee';
    }
  }

  displayProfiles(component, e) {
    const feature = e.target.feature
    const geoId = feature.properties.GEOID
    const stateFIPS = geoId.substring(0, 2)
    const state = fipsToState[stateFIPS]
    const dist = (geoId.substring(2, geoId.length) === '00') ? 1 : parseInt(geoId.substring(2, geoId.length))

    component.setState({ popupContent: {
        office: 'US House of Representatives',
        reps: component.state.reps[state][dist]
      }
    })
  }

  highlightFeature(e) {
    const geoId = e.target.feature.properties.GEOID
    // this.setState({ electionColor: true })
    this.setState({ mousedOverFeature: geoId })
    e.target.setStyle({ color: '#000000', 'opacity': 0.5 })
  }

  resetHighlight(e) {
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
