import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { LayersControl, GeoJson } from 'react-leaflet'

// GeoJson containers
import States from './States'
import CongressionalDistricts from './CongressionalDistricts'
import Countries from './Countries'

export default class LayerControl extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render () {
    return (
      <LayersControl>
        <LayersControl.BaseLayer name='Federal Executive' checked={true}>
          <Countries/>
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name='State Executive/Federal Legislature Upper'>
          <States/>
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name='Federal Legislature Lower'>
          <CongressionalDistricts/>
        </LayersControl.BaseLayer>
      </LayersControl>
    )
  }
}
