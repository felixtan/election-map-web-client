import React from 'react'

export default function PopupProfile(props, context) {
  // console.log(props)
  const h4 = {
    margin: 'auto'
  }
  const imgStyle = {
    height: '100px',
    width: '80px',
    margin: 'auto' }
  const divStyle = {
    display: 'inline-block',
    margin: '10px',
    textAlign: 'center'
  }

  return (
    <div style={divStyle}>
      <img style={imgStyle} src={props.official.photoUrl} />
      <h4 style={h4}>{props.office}</h4>
      <h4 style={h4}>{props.official.name}</h4>
      <h4 style={h4}>{props.official.party}</h4>
    </div>
  )
}
