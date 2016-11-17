import React from 'react'
import partyCodeToName from '../../server/data/partyCodeToName'
import partyCodeToColor from '../fixtures/partyColors'
import countryCodeToNames from '../fixtures/countryISOA2toNames'

const licenseLinks = {
  "CC BY 4.0": "https://creativecommons.org/licenses/by/4.0/",
  "CC BY 3.0": "https://creativecommons.org/licenses/by/3.0/",
  "CC BY 2.0": "https://creativecommons.org/licenses/by/2.0/",
  "CC BY-SA 2.0": "https://creativecommons.org/licenses/by-sa/2.0/",
  "CC BY-SA 3.0": "https://creativecommons.org/licenses/by-sa/3.0/",
  "CC BY-SA 4.0": "https://creativecommons.org/licenses/by-sa/4.0/"
}

const attribStyle = {
  fontSize: '8px'
}

const linkStyle = {
  color: 'black'
}

export default function ImageAttribution(props, context) {
  if (props.photo.attrib === undefined || props.photo.attrib === null || props.photo.attrib === 'public domain') {
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
        <a className='attrib-link' style={linkStyle} href={source} target="_blank">{author}</a>/
        <a className='attrib-link' style={linkStyle} href={licenseLinks[license]} target="_blank">{license}</a>
      </span>
    )
  }
}
