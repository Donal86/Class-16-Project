import React, { Component } from 'react'
import { Link } from 'react-router-dom'
class SingleLi extends Component {
  constructor (props) {
    super(props)
  }
  render () {
    const { id } = this.props

    return (
      <li>
        <Link to={`/house?id=${id}`}>click here</Link>
      </li>
    )
  }
}

export default SingleLi
