import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { Map, ZoomControl } from 'react-leaflet'
import BaseMapLayer from './BaseMap'
import LayerControl from './LayerControl'
import Sidebar from './Sidebar'
import AreaInfo from './AreaInfo'

// TODO: make sure the transition time is the same as this.state.electionColorDelay
require('../styles/components/electionColor.css')
// require('../../node_modules/leaflet/dist/leaflet.css')

export default class PoliticsMap extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        center: [39.833, -98.583],  // centered on US
        // center: [-1.809697, -53.484192],  // somewhere in brazil on the amazon river
        // center: [38.89511, -77.03637],  // washington dc
        zoom: 4,
        style: {
          height: "100%",
          width: "100%",
          // position: "relative"
          position: "absolute",
        },
        highlighted: null,
        selected: null,
        elections: null
    }

    this.onSelect = this.onSelect.bind(this)
    this.onHover = this.onHover.bind(this)
    // console.log(this)
  }

  onSelect(selected, elections) {
    this.setState({ selected: selected, elections: elections })
    // console.log(this.state)
  }

  onHover(highlighted) {
    this.setState({ highlighted: highlighted })
    // console.log(this.state.highlighted)
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
           <LayerControl onSelect={this.onSelect} onHover={this.onHover} />
           <Sidebar selected={this.state.selected} elections={this.state.elections} />
           <AreaInfo highlighted={this.state.highlighted} elections={this.state.elections} />
      </Map>
    )
  }
}
