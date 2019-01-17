import React from "react"
import './map.css';
import { YMaps, Map, Clusterer, Placemark, ZoomControl, TypeSelector, Polyline } from "react-yandex-maps";
import distanceCalculator from '../util/distanceCalculator';
import { inject, observer } from 'mobx-react';

@inject('PropertiesStore')
@observer

class MainMap extends React.Component {
    constructor(props) {
        super(props);
        props.PropertiesStore.listProperties();
    }

    render() {
        //it takes all houses' properties as a json file.
        const { PropertiesStore, theHouse } = this.props;
        const houses = PropertiesStore.properties.data;
        let startingCenter = {};
        let zoom = 5;
        let iconOptions = {};
        let polylines = null;

        if (theHouse) {
            startingCenter = [theHouse.location_coordinates_lat, theHouse.location_coordinates_lng];

            zoom = 16;

            polylines = houses.map((house, key) => {
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

            iconOptions = {
                iconLayout: 'default#image',
                iconImageHref: 'http://www.icon100.com/up/4068/512/10-home.png',
            }

        } else {
            startingCenter = houses.reduce((accu, house) => {
                if (accu[0] === undefined || accu[1] === undefined) {
                    accu[0] = 0;
                    accu[1] = 0;
                } else {
                    accu[0] = accu[0] + house.location_coordinates_lat / houses.length;
                    accu[1] = accu[1] + house.location_coordinates_lng / houses.length;
                }
                return accu
            }, []);

            zoom = 5;
        }

        //when clicked a placemarker, you are going to see this content.
        //in the next step, I am going to add <a> for the detailed properties of each house
        const balloonContent = function (item) {
            return `<div class='balloon'> <a href=${'http://localhost:3000/house?id=' + item.id}> <h3>${item.price_value} ${item.price_currency}</h3> <img src=${item.images ? item.images[0] : null}/> </a> </div>`
        }

        //all placemarkers are here. I created it with map function
        const markerHouses = houses.map((house, key) =>
            <Placemark
                key={key}
                geometry={[house.location_coordinates_lat, house.location_coordinates_lng]}
                properties={{
                    hintContent: house.title,
                    balloonContent: balloonContent(house)
                }}
                options={theHouse ? (house.id === theHouse.id ? iconOptions : null) : null}
                modules={
                    ['geoObject.addon.balloon', 'geoObject.addon.hint']
                }
            />
        )

        return (

            <YMaps query={{ lang: "en-US" }} >
                <Map defaultState={{
                    'center': startingCenter,
                    'zoom': zoom
                }}
                    height={400}
                    width={1000}
                >

                    {polylines}

                    <Clusterer options={{
                        preset: 'islands#invertedVioletClusterIcons',
                        groupByCoordinates: false
                    }}
                    >
                        {markerHouses}
                    </Clusterer>

                    <ZoomControl
                        options={{
                            size: 'small',
                            zoomDuration: 1000,
                        }}
                    />
                    <TypeSelector defaultState={{ expanded: true }} />

                </Map>
            </YMaps>
        )
    }
}

export default MainMap;