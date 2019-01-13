import React, { Component } from "react"
import './map.css';
import { YMaps, Map, Clusterer, Placemark } from "react-yandex-maps";


class HouseMap extends React.Component {

    constructor(props) {
        super(props);
    }

    render () {
        //it takes all houses' properties as a json file.
        const { houses } = this.props;
        
        //when clicked a placemarker, you are going to see this content.
        //in the next step, I am going to add <a> for the detailed properties of each house
        const balloonContent = function(item) {
            return `<div class='balloon'> <h3>${item.price_value} ${item.price_currency}</h3> <img src=${item.images[0]}/> </div>`
        }

        //all placemarkers are here. I created it with map function
        const markerHouses = houses.map((house, key) => 
            <Placemark
                key={key} 
                geometry={[house.location_coordinates_lat, house.location_coordinates_lng]}
                properties= {{
                    hintContent: house.title,
                    balloonContent:balloonContent(house)
                }}
                modules= {
                    ['geoObject.addon.balloon', 'geoObject.addon.hint']
                }
            />
        )
        
        // where should be the starting point? I think averages of the lats and lngs can be a good place.
        //because it is the exact middle of the all placemarkers.
        let startingCenter = houses.reduce((accu, house) => {
            if(accu['lat'] === undefined || accu['lng'] === undefined) {
                accu['lat'] = 0;
                accu['lng'] = 0;
            } else {
                accu['lat'] = accu['lat'] + house.location_coordinates_lat / houses.length;
                accu['lng'] = accu['lng'] + house.location_coordinates_lng / houses.length;
            }
            return accu
        }, {})

        return (

            <YMaps query={{ lang: "en-US" }} >
                <Map defaultState={{
                        'center': [startingCenter.lat, startingCenter.lng],
                        'zoom': 5
                    }}
                    height={400}
                    width={1000}
                >

                    <Clusterer options={{
                            preset: 'islands#invertedVioletClusterIcons',
                            groupByCoordinates: false
                        }}
                    >

                        {markerHouses}

                    </Clusterer>
                
                </Map>
            </YMaps>
            
               
            
        )
    }
}

export default HouseMap;