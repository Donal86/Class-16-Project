import React, { Component } from 'react'
import queryString from 'query-string'
import MainMap from './MainMap'
import './houseDetails.css'
import { toJS } from 'mobx'

import {
  Carousel,
  CarouselItem,
  CarouselControl,
  CarouselIndicators,
  Card,
  CardTitle,
  CardText,
  Modal,
  ModalBody,
  Row,
  Col
} from 'reactstrap'
import { inject, observer } from 'mobx-react'

@inject('PropertiesStore')
@observer
class HouseDetails extends Component {
  constructor(props) {
    super(props)
    this.props.PropertiesStore.houseDetails(
      queryString.parse(this.props.location.search).id
    )
    this.state = {
      imgItems: [],
      activeIndex: 0,
      imgModal: {},
      modal: false
    }
  }

  async componentDidMount() {
    const { PropertiesStore } = this.props
    await PropertiesStore.houseDetails(
      queryString.parse(this.props.location.search).id
    )
    const myHouse = PropertiesStore.properties.singleHouse
    const houseArr = toJS(myHouse)
    const houseObj = houseArr.length < 1 ? null : { ...houseArr[0] }
    if (houseObj.images) {
      const imgArr = houseObj.images.split(',')
      const imgItems = imgArr.map((img, i) => {
        let index = i + 1
        return { src: img, altText: 'image ' + index }
      })
      this.setState({ imgItems })
    }
  }

  onExiting = () => {
    this.animating = true
  }

  onExited = () => {
    this.animating = false
  }

  next = () => {
    if (this.animating) return
    const nextIndex =
      this.state.activeIndex === this.state.imgItems.length - 1
        ? 0
        : this.state.activeIndex + 1
    this.setState({ activeIndex: nextIndex })
  }

  previous = () => {
    if (this.animating) return
    const nextIndex =
      this.state.activeIndex === 0
        ? this.state.imgItems.length - 1
        : this.state.activeIndex - 1
    this.setState({ activeIndex: nextIndex })
  }

  goToIndex = newIndex => {
    if (this.animating) return
    this.setState({ activeIndex: newIndex })
  }

  toggle = (imgSrc, altTxt) => {
    this.setState({
      modal: !this.state.modal,
      imgModal: { imgSrc, altTxt }
    })
  }

  modalShowOneImage = () => {
    const { imgSrc, altTxt } = this.state.imgModal
    return (
      <div>
        <Modal isOpen={this.state.modal} toggle={this.toggle}>
          <ModalBody>
            <img src={imgSrc} alt={altTxt} className='modal-image' />
          </ModalBody>
        </Modal>
      </div>
    )
  }

  addDecimalPoints = number => {
    let output = number.toString()
    let nrArr = output.split('').reverse()
    let newValue = ''
    for (let i = 0; i < nrArr.length; i++) {
      if (i % 3 === 0 && i !== 0) {
        newValue += '.'
      }
      newValue += nrArr[i]
    }
    output = newValue
      .split('')
      .reverse()
      .join('')
    return output
  }

  render() {
    const { PropertiesStore } = this.props
    const myHouse = PropertiesStore.properties.singleHouse
    const houseArr = toJS(myHouse)
    const houseObj = { ...houseArr[0] }

    const cur = this.props.PropertiesStore.properties.toCurrency;

    const {
      id,
      link,
      title,
      description,
      location_country,
      location_city,
      market_date,
      location_address,
      size_grossm2,
      size_netm2,
      size_parcelm2,
      size_rooms,
      price_value,
      price_currency
    } = houseObj
    const priceValue = !price_value ? null : this.addDecimalPoints(price_value)
    const marketDate = market_date ? market_date.split('T')[0] : null
    const { imgItems, activeIndex } = this.state
    const myMap = houseObj ? <MainMap theHouse={houseObj} /> : null

    const slides = imgItems.map((item, i, el) => {
      return (
        <CarouselItem
          className='custom-tag'
          onExiting={this.onExiting}
          onExited={this.onExited}
          key={'carouseHouse' + i}
        >
          <img
            src={item.src}
            alt={item.altText}
            onClick={() => this.toggle(item.src, item.altText)}
            style={{ cursor: 'pointer' }}
          />
        </CarouselItem>
      )
    })
    return !link ? (
      <div className='notFound'>
        <div>
          House No. {queryString.parse(this.props.location.search).id + ' '}is not
          found
        </div>
        <img
          className='notFoundImg'
          src={require('./notfound.png')}
          alt='notfound'
        />
        <h2 className="notFoundHeader">House Is Not Found</h2>
      </div>
    ) : (
        <div className='single-house-container'>
          {this.modalShowOneImage()}
          <Carousel
            activeIndex={activeIndex}
            next={this.next}
            previous={this.previous}
          >
            <CarouselIndicators
              items={imgItems}
              activeIndex={activeIndex}
              onClickHandler={this.goToIndex}
            />
            {slides}
            <CarouselControl
              direction='prev'
              directionText='Previous'
              onClickHandler={this.previous}
            />
            <CarouselControl
              direction='next'
              directionText='Next'
              onClickHandler={this.next}
            />
          </Carousel>
          <hr />
          <h2>{title}</h2>
          <Row>
            <Col sm='6' md='4'>
              <Card body>
                <CardTitle>Country</CardTitle>
                <CardText>{location_country}</CardText>
              </Card>
            </Col>
            <Col sm='6' md='4'>
              <Card body>
                <CardTitle>City</CardTitle>
                <CardText>{location_city}</CardText>
              </Card>
            </Col>
            <Col sm='6' md='4'>
              <Card body>
                <CardTitle>Address</CardTitle>
                <CardText>{location_address}</CardText>
              </Card>
            </Col>
            <Col sm='6' md='4'>
              <Card body>
                <CardTitle>Price</CardTitle>
                <CardText>
                  {houseObj.price_value.toLocaleString('en-US', {
                    style: 'currency',
                    currency: houseObj.price_currency,
                  })}

                </CardText>
                <CardText>{houseObj.price_value_converted.toLocaleString('en-US', {
                  style: 'currency',
                  currency: cur,
                })}</CardText>
              </Card>
            </Col>
            <Col sm='6' md='4'>
              <Card body>
                <CardTitle>Rooms</CardTitle>
                <CardText>{size_rooms}</CardText>
              </Card>
            </Col>
            {!size_grossm2 ? null : (
              <Col sm='6' md='4'>
                <Card body>
                  <CardTitle>Gross Size</CardTitle>
                  <CardText>{size_grossm2 + ' m2'}</CardText>
                </Card>
              </Col>
            )}
            {!size_parcelm2 ? null : (
              <Col sm='6' md='4'>
                <Card body>
                  <CardTitle>Parcel Size</CardTitle>
                  <CardText>{size_parcelm2 + ' m2'}</CardText>
                </Card>
              </Col>
            )}
            {!size_netm2 ? null : (
              <Col sm='6' md='4'>
                <Card body>
                  <CardTitle>Net Size</CardTitle>
                  <CardText>{size_netm2 + ' m2'}</CardText>
                </Card>
              </Col>
            )}
            <Col sm='6' md='4'>
              <Card body>
                <CardTitle>Market Date</CardTitle>
                <CardText>{marketDate}</CardText>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md='10'>
              <Card body>
                <CardTitle>Link</CardTitle>
                <CardText>
                  <a href={link}>{link}</a>
                </CardText>
              </Card>
            </Col>
          </Row>
          <Row className='justify-content-center'>
            <Col md='10'>
              <Card body>
                <CardTitle>Description</CardTitle>
                <CardText>{description}</CardText>
              </Card>
            </Col>
          </Row>

          <div className='mapContainer'>{myMap}</div>
        </div>
      )
  }
}

export default HouseDetails
