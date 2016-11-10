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
      electionColorDelay: props.electionColorDelay,
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

    // console.log(props.elections.candidates)
  }

  style(feature) {
    const country = feature.properties.iso_a2
    const activeElections = this.state.elections.candidates.length > 0
    return {
      fillColor: this.getColor(country),
      fillOpacity: 0.4,
      color: 'red',
      opacity: activeElections ? 0.5 : 0,
      weight: 2.5,
      className: activeElections ? 'election-status-active' : 'election-status-inactive'
    }
  }

  getColor(country) {
    // const reps = country === 'US' ? this.state.reps[country] : null
    const headOfGovernment = (typeof this.state.reps !== 'undefined' && this.state.reps !== null) ? this.state.reps['headOfGovernment'] : null
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
      const headOfGovernment = component.state.reps.headOfGovernment

      // component.setState({ popupContent: {
      //     office: headOfGovernment.office,
      //     reps: headOfGovernment,
      //     state: country.admin
      //   }
      // })

      component.props.layerControl.props.onSelect({
        reps: [headOfGovernment],
        country: e.target.feature.properties.iso_a2,
        state: null,
        district: null,
        levelOfGov: component.state.levelOfGov,
        branchOfGov: component.state.branchOfGov,
      }, component.state.elections)
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

    this.props.layerControl.props.onHover({
      country: country,
      state: null,
      district: null,
      levelOfGov: this.state.levelOfGov,
      branchOfGov: this.state.branchOfGov,
    })

    e.target.setStyle({ color: '#000000', 'opacity': 0.5, 'weight': 3.0 })
    e.target.bringToFront()
  }

  resetHighlight(e) {
    this.refs.geojson.leafletElement.resetStyle(e.target)
    this.props.layerControl.props.onHover(null)
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

               {/*<PopupContainer content={this.state.popupContent}/>*/}
      </GeoJson>
    )
  }
}
