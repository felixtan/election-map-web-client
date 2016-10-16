import React from 'react'
// import { render } from 'react-dom'
import { TileLayer } from 'react-leaflet'
import basemap from '../config/mapbox.json'

export default function BaseMapLayer(props, context) {
  return (
    <TileLayer url={`${basemap.url}?access_token=${basemap.APIkey}`}
               id={basemap.id}
               attribution={basemap.attribution}/>
  )
}
