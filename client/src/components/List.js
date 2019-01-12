import React from 'react'
import { inject, observer } from 'mobx-react'

import SingleLi from './singleLi'

@inject('PropertiesStore')
@observer
class List extends React.Component {
  constructor(props) {
    super(props)
    props.PropertiesStore.listProperties()
  }
  render() {
    const { PropertiesStore } = this.props

    return (
      <React.Fragment>
        <ul>
          {PropertiesStore.properties.data.map((el, i) => {
            return (
              <SingleLi
                key={'propH' + i}
                link={el.link}
                country={el.location_country}
                city={el.location_city}
                marketDate={el.market_date}
                address={el.location_address}
                parcelArea={el.size_parcelm2}
                grossArea={el.size_grossm2}
                netArea={el.size_netm2}
                rooms={el.size_rooms}
                price={el.price_value}
                currency={el.price_currency}
                title={el.title}
                description={el.description}
                images={el.images}
                lat={el.location_coordinates_lat}
                lng={el.location_coordinates_lng}
              />
            )
          })}
        </ul>
        <pre>{JSON.stringify(PropertiesStore.properties.data, null, 2)}</pre>
      </React.Fragment>
    )
  }
}

export default List