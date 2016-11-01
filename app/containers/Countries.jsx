import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { GeoJson } from 'react-leaflet'
import PopupContainer from './Popup'
import countries from '../fixtures/geojson/countries_110m.json';

export default class GeoJsonLayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      layerControl: props.layerControl,
      leafletMap: null,
      geoData: countries,
      reps: props.reps,
      elections: props.elections,
      mousedOverFeature: null,
      popupContent: {
        office: 'Having this here solves the initially',
        reps: [],
        state: 'messed up popup',
        district: 'style problem'
      },
      electionColorDelay: props.electionColorDelay,
      ticks: 0,
      levelOfGov: 'country',
      branchOfGov: 'executive'
    }

    this.onEachFeature = this.onEachFeature.bind(this)
    this.style = this.style.bind(this)
    this.displayProfiles = this.displayProfiles.bind(null, this)
    this.getColor = this.getColor.bind(this)
    this.filterCountries = this.filterCountries.bind(this)
    this.highlightFeature = this.highlightFeature.bind(this)
    this.resetHighlight = this.resetHighlight.bind(this)
  }

  style(feature) {
    const country = feature.properties.iso_a2
    return {
      fillColor: this.getColor(country),
      fillOpacity: 0.4,
      stroke: this.state.elections.length > 0,
      color: null,
      weight: 2.5,
      className: this.state.elections.length > 0 ? 'election-status-active' : 'election-status-inactive'
    }
  }

  getColor(country) {
    const reps = country === 'US' ? this.state.reps[country] : null
    const headOfGovernment = (reps !== null && typeof reps !== 'undefined') ? reps['headOfGovernment'] : null
    const party = headOfGovernment !== null ? headOfGovernment.party : null

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
    const geojson = component.refs.geojson
    const map = geojson.context.map
    const country = e.target.feature.properties.iso_a2
    if (country === 'US') {
      const headOfGovernment = component.state.reps[country].headOfGovernment
      component.setState({ popupContent: {
          office: headOfGovernment.office,
          reps: headOfGovernment,
          state: country.admin
        }
      })
    } else {
      // geojson.leafletElement._popupContent._close()
      geojson.closePopup()
    }
  }

  // only US for now
  filterCountries(feature, layer) {
    const country = feature.properties.iso_a2
    return country === 'US'
    // return true
  }

  highlightFeature(e) {
    const country = e.target.feature.properties.iso_a2
    // this.setState({ electionColor: false })
    this.setState({ mousedOverFeature: country })
    e.target.setStyle({ color: '#000000', 'opacity': 0.5 })
  }

  resetHighlight(e) {
    // this.setState({ electionColor: true })
    this.setState({ mousedOverFeature: null })
    this.refs.geojson.leafletElement.resetStyle(e.target)
  }

  onEachFeature(component, feature, layer) {
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
               style={this.style}
               filter={this.filterCountries}>

               <PopupContainer content={this.state.popupContent}/>
      </GeoJson>
    )
  }
}
