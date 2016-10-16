import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { GeoJson } from 'react-leaflet'
import PopupContainer from './Popup'
import states from '../fixtures/geojson/us-states-20m-census2015.json';
import { getAllCountryLegislatorsUpper } from '../services/ElectedRepsService.js'
import statesLetterCodeToName from '../fixtures/statesLetterCodeToName.js'

export default class GeoJsonLayer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activeData: states,
      eventHandlers: this.onEachFeature,
      officials: {},
      popupContent: {
        office: '',
        officials: [],
        state: '',
        district: ''
      }
    }

    getAllCountryLegislatorsUpper('us').then(res => {
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
    const geojson = component.refs.geojson.leafletElement
    const state = e.target.feature.properties.STUSPS
    component.setState({ popupContent: {
      office: 'US Senate',
      officials: component.state.officials[state],
      state: statesLetterCodeToName[state],
      district: null
    }})
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
