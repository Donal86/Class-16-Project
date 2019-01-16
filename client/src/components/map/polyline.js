import React from "react"
import { Polyline } from "react-yandex-maps";
import distanceCalculator from '../../util/distanceCalculator';

class PolylineComponent extends React.Component {

    render() {
        //it takes all houses' properties as a json file.
        const { houses, theHouse } = this.props;
        console.log('asdasdasd')

        const polylines = houses.map((house, key) => {
                const distance = distanceCalculator(house.location_coordinates_lat, house.location_coordinates_lng, theHouse.location_coordinates_lat, theHouse.location_coordinates_lng)
                const distanceDecimal = Math.floor(distance * 100) / 100
                const isSmallDistance = distance < 1
    
                return isSmallDistance ?
                    <Polyline
                        key={key}
                        geometry={[[theHouse.location_coordinates_lat, theHouse.location_coordinates_lng], [house.location_coordinates_lat, house.location_coordinates_lng]]}
                        properties={{
                            hintContent: distanceDecimal.toString() + ' km'
                        }}
                        modules={
                            ['geoObject.addon.hint']
                        }
                        options={{
                            balloonCloseButton: false,
                            strokeColor: '#000',
                            strokeWidth: 4,
                            strokeOpacity: 0.5,
                        }}
                    /> : null
    
            })

        return (
            {polylines}
        )
    }
}

export default PolylineComponent;