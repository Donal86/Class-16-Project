import React, { Component } from "react"
import './map.css';
import { YMaps, Map, Clusterer, Placemark } from "react-yandex-maps";
import { inject, observer } from 'mobx-react';

@inject('PropertiesStore')
@observer


class HouseMap extends React.Component {

    constructor(props) {
        super(props);
        props.PropertiesStore.listProperties();
    }

    render () {
        //it takes all houses' properties as a json file.
        const { PropertiesStore } = this.props;
        const houses = PropertiesStore.properties.data;
        
        //when clicked a placemarker, you are going to see this content.
        //in the next step, I am going to add <a> for the detailed properties of each house
        const balloonContent = function(item) {
            return `<div class='balloon'> <h3>${item.value} ${item.currency}</h3> <img src=${item.img_link[0]}/> </div>`
        }

        //all placemarkers are here. I created it with map function
        const markerHouses = houses.map((house, key) => 
            <Placemark
                key={key} 
                geometry={[house.lat, house.lng]}
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
                accu['lat'] = accu['lat'] + house.lat / houses.length;
                accu['lng'] = accu['lng'] + house.lng / houses.length;
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