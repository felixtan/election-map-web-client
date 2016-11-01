import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import { Popup } from 'react-leaflet'
import Profile from '../components/PopupProfile'

require('../styles/components/popup.css')

export default class PopupContainer extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    let profiles;
    if (Array.isArray(this.props.content.reps) && this.props.content.reps.length) {
      profiles = this.props.content.reps.map((o, index) => {
        return (<Profile office={this.props.content.office}
                         official={o}
                         state={this.props.content.state}
                         district={this.props.content.district}
                         key={index} />)
      })
    } else {    // house reps are not stored in arrays
      profiles = [(<Profile office={this.props.content.office}
                            official={this.props.content.reps}
                            state={this.props.content.state}
                            district={this.props.content.district}
                            key={0} />)]
    }

    return (
      <Popup>
        {/* This div is needed because leaflet's popup only expects one child el */}
        <div className="leaflet-popup-content-wrapper-actual">
          {profiles}
        </div>
      </Popup>
    )
  }
}
