import React from 'react'
import { render } from 'react-dom'
import Control from 'react-leaflet-control';
import AreaInfo from '../components/AreaInfo'

export default class AreaInfoContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      highlighted: props.highlighted,
      elections: props.elections,
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ highlighted: nextProps.highlighted, elections: nextProps.elections })
  }

  render() {
    return (
      <Control position='bottomright'>
        <AreaInfo highlighted={this.state.highlighted} elections={this.state.elections} />
      </Control>
    )
  }
}
