import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { GeoJson } from 'react-leaflet'
import PopupContainer from './Popup'
import countries from '../fixtures/geojson/countries_110m.json';
import { getAllCountryLevelExecutives } from '../services/ElectedRepsService.js'

export default class GeoJsonLayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeData: countries,
      eventHandlers: this.onEachFeature,
      officials: {},
      popupContent: {
        office: 'Having this here solves the initially',
        officials: [],
        state: 'messed up popup',
        district: 'style problem'
      }
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
  }

  style(feature) {
    // console.log(feature)
    const country = feature.properties.iso_a2
    return {
      // fillColor: getColor(feature.properties.density),
      weight: 1,
      opacity: (country === 'US' ? 1 : 0),
      color: '#ff0000',
      dashArray: '3',
      fillOpacity: 0
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

  onEachFeature(component, feature, layer) {
    layer.on({
      // mouseover: displayProfiles.bind(null, component),
      click: component.displayProfiles
      // dblclick: zoomToState.bind(null, component)
    })
  }

  render() {
    return (
      <GeoJson data={this.state.activeData}
               onEachFeature={this.state.eventHandlers.bind(null, this)}
               ref="geojson"
               style={this.style}>

               <PopupContainer content={this.state.popupContent}/>
      </GeoJson>
    )
  }
}
