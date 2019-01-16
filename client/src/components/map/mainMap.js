import React from "react"
import './map.css';
import { YMaps, Map, Clusterer, Placemark, ZoomControl, TypeSelector } from "react-yandex-maps";
import { inject, observer } from 'mobx-react';
import PolylineComponent from './polyline.js';

@inject('PropertiesStore')
@observer

class MainMap extends React.Component {
    constructor(props) {
        super(props);
        props.PropertiesStore.listProperties();
    }

    render() {
        //it takes all houses' properties as a json file.
        const { PropertiesStore, id} = this.props;
        const houses = PropertiesStore.properties.data;
        
        let startingCenter = {};
        let zoom = 5;
        let iconOptions = {};
        let polylines = null;

        if(id) {
            const theHouse = houses.filter(house => house.id === id)

            startingCenter = [theHouse.lat, theHouse.lng];

            zoom = 16;

            polylines = <polylineComponent houses={houses} theHouse={theHouse}/>

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
            return `<div class='balloon'> <a href=${'http://localhost:3000/house?id='}> <h3>${item.price_value} ${item.price_currency}</h3> <img src=${item.images.split(',')[0]}/> </a> </div>`
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
                options={house.id === id ? iconOptions : null}
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