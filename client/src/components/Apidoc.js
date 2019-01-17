import React from "react";
import './apidoc.css';

class Apidoc extends React.Component {

    render () {
        
        const jsonFileFormat = {
            "link": "string url - not null",
            "title": "string - not null",
            "location": { //"object - not null"
                "country": "string - not null",
                "city": "string - not null",
                "address": "string",
                "coordinates": {
                    "lat": "number",
                    "lng": "number"
                }
                // "address || coordinates -> not null"
            },
            "market_date": "valid date OR now( ) - not null",
            "size": {
                "parcel_m2": "number",
                "gross_m2": "number",
                "net_m2": "number",
                // parcel_m2 || gross_m2 || net_m2 -> not null
                "rooms": "number - not null"
            },
            "price": {
                "value": "number - not null",
                "currency": "string - 3chars - not null"
            },
            "description": "string",
            "images": "Array ['string -url', 'string -url']",
            "sold": "boolean - not null"
        }

        return(
            <div className="addElement">
            <h1>API Documentation</h1>
            <div class='index-content'>
                <div class='index'>
                    <a href="#introduction">
                        <h3>Introduction</h3>
                    </a>
        
                    <a href="#getting">
                        <h3>Getting JSON File</h3>
                    </a>
        
                    <a href="#contribution">
                        <h3>Contribution</h3>
                    </a>

                    <a href="#about">
                    <h3>About Us</h3>
                    </a>

                    <a href="#source">
                    <h3>Sources of The Database</h3>
                    </a>
                </div>
        
                <div class='content'>
                    <div id='introduction'>
                        <h2>Introduction</h2>
                        <p>The Open Source Factory is to aim that the information reaches people freely. In This
                            context, <strong>Free Real Estate</strong> serves real estate information to developers
                            in a free and useful way. Developers can get the information as json file effortlessly and
                            in the meantime, we display the houses in mesmerising way for everyone.
                            We always make an effort to keep updated our database and moreover expand it. Nevertheless,
                            we are open for your valuable contribution. By uploading new house information into our 
                            system, you can help us out to attain our global goal.</p>
                    </div>
        
                    <div id='getting'>
                        <h2>Getting JSON File</h2>
                        <p>getting json file bla bla bla</p>
                    </div>
        
                    <div id='contribution'>
                            <h2>How to Contribute</h2>
                            <h3>As a URL</h3>
                            <p>contrasdasdasdasdasd json file bla bla bla</p>

                            <h3>As a JSON File</h3>
                            <p>asdasddasdasd</p>

                            <h3>As a JSON Text</h3>
                            <div className="entryFormat">
                                <h3>Please make sure that</h3>
                                <ul>
                                    <li>
                                        Your JSON file must be an array.
                                    </li>
                                    <li>
                                        Every element in the array must be an object.
                                    </li>
                                    <li>
                                        Every object must be in below format:
                                    </li>
                                    <pre>{JSON.stringify(jsonFileFormat, undefined, 2)}</pre>
                                </ul>
                            </div>
                    </div>

                    <div id='source'>
                        <h2>Sources of The Database</h2>
                        <p>Our aim is to enhance our database regularly by collecting live real estate market data from different
                        countries. Also our database is open to contribute in terms of public users. So this living database updates
                        itself continuously.</p>
                    </div>

                    <div id='about'>
                    <h2>About Us</h2>
                    <p>gettasd;'lkas'daslkdfile bla bla bla</p>
                    </div>
                </div>
            </div>
                
            </div>
        )
    }
}

export default Apidoc;