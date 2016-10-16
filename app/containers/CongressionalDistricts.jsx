import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { GeoJson } from 'react-leaflet'
import PopupContainer from './Popup'
import congressionalDistricts from '../fixtures/geojson/cb_2015_cd114_20m.json';
import { getAllCountryLegislatorsLower } from '../services/ElectedRepsService.js'
import fipsToState from '../fixtures/statesFIPSToLetterCodes.js'

export default class GeoJsonLayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeData: congressionalDistricts,
      eventHandlers: this.onEachFeature,
      officials: {},
      popupContent: {
        office: '',
        officials: [],
        state: '',
        district: ''
      }
    }

    getAllCountryLegislatorsLower('us').then(res => {
      if (res.status !== 200) {
        console.log(`Looks like there was a problem. Status Code: + ${res.status}`)
        console.error(res)
      }

      res.json().then(officials => {
        delete officials._id
        this.setState({ officials: officials })
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

  style (feature) {
    return {
      // fillColor: getColor(feature.properties.density),
      weight: 1,
      opacity: 1,
      color: '#ff0000',
      dashArray: '3',
      fillOpacity: 0
    }
  }

  displayProfiles(component, e) {
    let geojson = component.refs.geojson.leafletElement
    let stateFIPS = e.target.feature.properties.STATEFP
    let state = fipsToState[stateFIPS]
    let district = parseInt(e.target.feature.properties.CD114FP).toString()
    component.setState({ popupContent: {
        office: 'US House of Representatives',
        officials: component.state.officials[state][district]
      }
    })
  }

  onEachFeature (component, feature, layer) {
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
