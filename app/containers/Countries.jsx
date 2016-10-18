import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { GeoJson } from 'react-leaflet'
import PopupContainer from './Popup'
import countries from '../fixtures/geojson/countries_110m.json';
import { getAllCountryLevelExecutives } from '../services/ElectedRepsService.js'
import elections from '../fixtures/upcomingElections'

// TODO: make sure the transition time is the same as this.state.electionColorDelay
require('../styles/components/electionColor.css')

export default class GeoJsonLayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeData: countries,
      eventHandlers: this.onEachFeature,
      officials: {},
      selected: '',
      popupContent: {
        office: 'Having this here solves the initially',
        officials: [],
        state: 'messed up popup',
        district: 'style problem'
      },
      electionColorDelay: 1000,
      ticks: 0,
      levelOfGov: 'country',
      branchOfGov: 'executive'
    }

    getAllCountryLevelExecutives('us').then(res => {
      if (res.status !== 200) {
        console.log(`Looks like there was a problem. Status Code: + ${res.status}`)
        console.error(res)
      }

      res.json().then(officials => {
        delete officials._id
        this.setState({ officials: officials })
        // console.log(this.state)
      }, err => {
        console.error(err)
      })
    }, err => {
      console.error(err)
    })

    this.onEachFeature = this.onEachFeature.bind(this)
    this.style = this.style.bind(this)
    this.displayProfiles = this.displayProfiles.bind(null, this)
    this.getColor = this.getColor.bind(this)
    this.electionColor = this.electionColor.bind(this)
    this.filterCountries = this.filterCountries.bind(this)
  }

  style(feature) {
    const country = feature.properties.iso_a2
    return {
      fillColor: this.getColor(feature),
      // fillOpacity: (country === 'US' ? 0.25 : 0),
      fillOpacity: 0.25,
      color: '#ff0000',
      // opacity: (country === 'US' ? 1 : 0),
      opacity: 1,
      dashArray: '3',
      weight: 1,
    }
  }

  getColor(feature) {
    const country = feature.properties.iso_a2
    const officials = country === 'US' ? this.state.officials[country] : null
    const headOfGovernment = (officials !== null && typeof officials !== 'undefined') ? officials['headOfGovernment'] : null
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

  // Basic: Choose the two colors representing the political parties of the two
  // top candidates
  electionColor(feature) {
    const country = feature.properties.iso_a2
    const blue = '#0000ff'
    const red = '#ff0000'
    const gray = 'eeeeee'

    if (elections[country]) {
      return {
        fillColor: (this.state.ticks % 2 === 0) ? blue : red
      }
    }
  }

  displayProfiles(component, e) {
    const geojson = component.refs.geojson
    const map = geojson.context.map
    const country = e.target.feature.properties.iso_a2
    if (country === 'US') {
      const headOfGovernment = component.state.officials[country].headOfGovernment
      component.setState({ popupContent: {
          office: headOfGovernment.office,
          officials: headOfGovernment,
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
    // return country === 'US'
    return true
  }

  onEachFeature(component, feature, layer) {
    layer.on({
      click: component.displayProfiles,
    })
  }

  componentDidMount() {
    setInterval(() => {
      this.refs.geojson.leafletElement.setStyle(this.electionColor)
      this.state.ticks = (this.state.ticks === 99) ? 0 : this.state.ticks+1
    }, this.state.electionColorDelay)
  }

  render() {
    return (
      <GeoJson data={this.state.activeData}
               onEachFeature={this.state.eventHandlers.bind(null, this)}
               ref="geojson"
               style={this.style}
               filter={this.filterCountries}>

               <PopupContainer content={this.state.popupContent}/>
      </GeoJson>
    )
  }
}
