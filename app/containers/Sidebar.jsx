import React, { PropTypes } from 'react'
import { render } from 'react-dom'
import RepProfiles from './RepProfiles'

require('../js/leaflet-sidebar.js')

export default class SidebarContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: props.selected,
      elections: props.elections
    }

    this.onMouseOver = this.onMouseOver.bind(this)
    this.onMouseOut = this.onMouseOut.bind(this)
    this.onTouchStart = this.onTouchStart.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
  }

  componentDidMount() {
    let sidebar = L.control.sidebar('sidebar').addTo(this.props.map)

    // When notification animation ends, reset the class so that the animation can be reused
    document.getElementById('profile-load-notification').addEventListener("animationend", e => { e.target.className = "" })
  }

  componentWillReceiveProps(nextProps) {
    // console.log(nextProps)
    if (this.state.selected === null
      || this.state.selected.reps[0].name !== nextProps.selected.reps[0].name
      || this.state.selected.branchOfGov !== nextProps.selected.branchOfGov
      || this.state.selected.levelOfGov !== nextProps.selected.levelOfGov
      || this.state.selected.state !== nextProps.selected.state
      || this.state.selected.district !== nextProps.selected.district) {
      this.setState({ selected: nextProps.selected, elections: nextProps.elections })
      // console.log(this.state)
      // Notify the user that profile data is loading in the sidebar
      // without this condition, it blinks on hover/mouseover
      if (nextProps.selected !== null) {
        if (_.includes(document.getElementById('sidebar').className, 'collapsed')) {
          document.getElementById('profile-load-notification').className = 'notification-blink'
        }
      }
    }
    // console.log(this.state)
  }

  /*
    Wihtout the mouseover and mouseout events, the sidebar isn't scrollable on mobile.
    It has something to do with react-leaflet.

    Relevant:
    https://gis.stackexchange.com/questions/104507/disable-panning-dragging-on-leaflet-map-for-div-within-map
  */
  onMouseOver() {
    this.props.map.dragging.disable()
    this.props.map.scrollWheelZoom.disable()
    this.props.map.doubleClickZoom.disable()
  }

  onMouseOut() {
    this.props.map.dragging.enable()
    this.props.map.scrollWheelZoom.enable()
    this.props.map.doubleClickZoom.enable()
  }

  onTouchStart() {
    this.props.map.dragging.disable()
    this.props.map.scrollWheelZoom.disable()
    this.props.map.doubleClickZoom.disable()
  }

  onTouchEnd() {
    this.props.map.dragging.enable()
    this.props.map.scrollWheelZoom.enable()
    this.props.map.doubleClickZoom.enable()
  }

  render() {
    return (
      <div id="sidebar"
           className="sidebar collapsed"
           onMouseOver={this.onMouseOver}
           onMouseOut={this.onMouseOut}
           onTouchStart={this.onTouchStart}
           onTouchEnd={this.onTouchEnd}>
          {/*<!-- Nav tabs -->*/}
          <div className="sidebar-tabs">
              <ul role="tablist">
                  <li>
                    <a href="#profile" role="tab">
                      <i className="fa fa-bars"></i>
                      <span id='profile-load-notification'></span>
                    </a>
                  </li>
                  {/*<li><a href="#ballot" role="tab"><i className="fa fa-check-square-o"></i></a></li>*/}
              </ul>
          </div>

          {/*<!-- Tab panes -->*/}
          <div className="sidebar-content">

              <div className="sidebar-pane" id="profile">

                  <h1 className="sidebar-header">
                      Representatives Profile
                      <span className="sidebar-close"><i className="fa fa-caret-left"></i></span>
                  </h1>

                  <RepProfiles selected={this.state.selected} elections={this.state.elections} />
              </div>
          </div>
      </div>
    )
  }
}
