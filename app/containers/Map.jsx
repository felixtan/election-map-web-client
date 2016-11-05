import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { Map, ZoomControl } from 'react-leaflet'
import BaseMapLayer from './BaseMap'
import LayerControl from './LayerControl'
import Sidebar from './Sidebar.jsx'

// TODO: make sure the transition time is the same as this.state.electionColorDelay
require('../styles/components/electionColor.css')
// require('../../node_modules/leaflet/dist/leaflet.css')

export default class PoliticsMap extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        center: [39.833, -98.583],
        zoom: 4,
        style: {
          height: "100%",
          width: "100%",
          // position: "relative"
          position: "absolute",
        },
        selected: null,
        candidates: null
    }

    this.onSelect = this.onSelect.bind(this)
    // console.log(this)
  }

  onSelect(selected, candidates) {
    this.setState({ selected: selected, candidates: candidates })
    // console.log(this.state)
  }

  componentDidMount() {
    this.refs.map.leafletElement.invalidateSize()
  }

  render () {
    return (
      <Map center={this.state.center}
           zoom={this.state.zoom}
           style={this.state.style}
           scrollWheelZoom={true}
           zoomControl={false}
           ref="map">

           <ZoomControl position='topright' />
           <BaseMapLayer />
           <LayerControl onSelect={this.onSelect} />
           <Sidebar selected={this.state.selected} candidates={this.state.candidates} />
      </Map>
    )
  }
}
