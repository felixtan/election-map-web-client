import React from 'react'
import partyCodeToName from '../fixtures/partyCodeToName'
import partyCodeToColor from '../fixtures/partyColors'
import countryCodeToNames from '../fixtures/countryISOA2toNames'
import licenseLinks from '../fixtures/licenseLinks'

const attribStyle = {
  fontSize: '9px'
}

const linkStyle = {
  color: 'black'
}

export default function ImageAttribution(props, context) {
  if (props.photo === undefined || props.photo.attrib === undefined || props.photo.attrib === null || props.photo.attrib === 'public domain') {
    return (
      <p style={attribStyle}></p>
    )
  } else {
    const parts = props.photo.attrib.substring(2).split('/')
    const author = parts[0]
    const license = parts[1]
    const source = (props.photo.source !== undefined && props.photo.source !== null && props.photo.source !== '') ? props.photo.source : null

    return (
      <span style={attribStyle}>
        <a className='attrib-link' style={linkStyle} href={source} target="_blank">{author}</a> / <a className='attrib-link' style={linkStyle} href={licenseLinks[license]} target="_blank">{license}</a>
      </span>
    )
  }
}
