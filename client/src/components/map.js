import React from 'react'
import { Map, Marker } from 'yandex-map-react'

const MyHouseMap = props => {
  const mapState = {
    controls: ['default']
  }
  return (
    <Map
      state={mapState}
      onAPIAvailable={function () {
        console.log('API loaded')
      }}
      center={[props.lat, props.lng]}
      zoom={10}
      loadOptions={{ lang: 'en-US' }}
    >
      <Marker lat={props.lat} lon={props.lng} />
    </Map>
  )
}

export default MyHouseMap
