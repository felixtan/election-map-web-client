import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { Map } from 'react-leaflet'
import BaseMapLayer from './BaseMap'
import LayerControl from './LayerControl'

export default class PoliticsMap extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
        center: [39.833, -98.583],
        zoom: 4,
        style: {
          height: "100%",
          width: "100%",
          position: "absolute",
        },
    }
  }

  render () {
    return (
      <Map center={this.state.center}
           zoom={this.state.zoom}
           style={this.state.style}
           scrollWheelZoom={true}
           ref="map">

           <BaseMapLayer />
           <LayerControl />
      </Map>
    )
  }
}
