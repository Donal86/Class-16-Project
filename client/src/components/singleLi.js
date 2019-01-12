import React, { Component } from 'react'
import { Link } from 'react-router-dom'
class SingleLi extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const {
            link,
            country,
            city,
            marketDate,
            address,
            parcelArea,
            grossArea,
            netArea,
            rooms,
            price,
            currency,
            title,
            description,
            images,
            lat,
            lng
        } = this.props
        const house = {
            link,
            country,
            city,
            marketDate,
            address,
            parcelArea,
            grossArea,
            netArea,
            rooms,
            price,
            currency,
            title,
            description,
            images,
            lat,
            lng
        }
        return (
            <li>
                <Link to={{ pathname: '/house', state: house }}>click here</Link>
            </li>
        )
    }
}

export default SingleLi