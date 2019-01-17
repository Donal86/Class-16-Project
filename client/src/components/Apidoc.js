import React from "react";
import './apidoc.css';

class Apidoc extends React.Component {

    render () {
        
        const jsonFileFormat = {
            "link": "string url - NOT NULL",
            "title": "string - NOT NULL",
            "location": {
                "country": "string - NOT NULL",
                "city": "string - NOT NULL",
                "address": "string - NOT NULL, IF coordinates NULL",
                "coordinates": {
                    "lat": "number - NOT NULL, IF address NULL",
                    "lng": "number - NOT NULL, IF address NULL"
                }
            },
            "market_date": "valid date OR now( ) - NOT NULL",
            "size": {
                "parcel_m2": "number - NOT NULL, IF gross_m2 AND net_m2 NULL",
                "gross_m2": "number - NOT NULL, IF parcel_m2 AND net_m2 NULL",
                "net_m2": "number - NOT NULL, IF gross_m2 AND parcel_m2 NULL",
                "rooms": "number - NOT NULL"
            },
            "price": {
                "value": "number - NOT NULL",
                "currency": "string - 3chars - NOT NULL"
            },
            "description": "string",
            "images": "Array ['string -url', 'string -url']",
            "sold": "boolean - NOT NULL"
        }

        return(
            <div className="addElement">
            <h1>API Documentation</h1>
            <div className='index-content'>
                <div className='index'>
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
        
                <div className='content'>
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