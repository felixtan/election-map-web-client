const basemap = require('../config/index.js').mapbox
import React from 'react'
import { TileLayer } from 'react-leaflet'
import licenseLinks from '../fixtures/licenseLinks'

export default function BaseMapLayer(props, context) {

  const openStreetMapLink = "https://www.openstreetmap.org/"
  const licenseLink = licenseLinks["CC BY-SA 2.0"]
  const mapboxLink = "https://www.mapbox.com/"
  const attrib = `Map data © <a href=${openStreetMapLink} target="_blank">OpenStreetMap</a> contributors, <a href=${licenseLink} target="_blank">CC-BY-SA</a>, Imagery © <a href=${mapboxLink} target="_blank">Mapbox</a>`

  return (
    <TileLayer url={`${basemap.url}?access_token=${basemap.APIkey}`}
               id={basemap.id}
               attribution={attrib}/>
  )
}
