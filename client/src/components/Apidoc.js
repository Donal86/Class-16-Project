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
                        <h3>Final Products of API</h3>
                    </a>
        
                    <a href="#contribution">
                        <h3>How to Contribute</h3>
                    </a>

                    <a href="#source">
                    <h3>Sources of The Database</h3>
                    </a>

                    <a href="#about">
                    <h3>About Us</h3>
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
                        <h2>Final Products of API</h2>
                        <h3>1- Showing Data</h3>
                        <p>This API is able to show information/data from worldwide real estate market. Users reach prices, 
                        spesifications and locations of houses for sale in different countries or cities. Users can reach the 
                        data according to filter options or they can sort selected data tables according to preferences. </p>

                        <h3>2- Producing a JSON File</h3>
                        <p>This API is able to produce a JSON file that consists comprehensive data of houses for sale in real 
                        estate market. </p>
                        <h3>3- Presenting Statistics</h3>
                        <p>This API is able to show charts of statistics about daily average prices of market in terms of average 
                        price per m2 or average price per house. Users can analyze the avarage price rates with according to 
                        filter options. </p>
                    </div>
        
                    <div id='contribution'>
                            <h2>How to Contribute</h2>
                            <p>Of course, everyone can contribute to our database. Therefore, the other people can
                            also reach an extensive real estate data. When you make a contribution, your contributed
                            data will be processed with our validation function. All of your valid elements will be insterted
                            into our database and then you will get a report for your invalid elements.Our database is open to 
                            contribution in three different ways:</p>

                            <h3>a. As a URL</h3>
                            <p>You can fetch and contribute by using the URL of the resource. Typically this is an 
                            absolute URL without the host component, e.g. "/path". If the URL has the host of another 
                            site, the request is performed.
                            <br/>
                            Any non-Request object will be converted to a String, making it possible to pass an instance of URL, 
                            for example.
                            <br/>
                            A request can be initialized using another instance of Request in place of the URL. In that case, 
                            the URL and other options are inherited from the provided Request object.</p>

                            <h3>b. As a JSON File</h3>
                            <p>You can upload your JSON file into our database as well. Only thing you should do is to select 
                            your file and click the upload button.</p>

                            <h3>c. As a JSON Text</h3>
                            <p>In this opportunity of contribution, you should copy your JSON file and paste to our text area.
                            Then just click the upload button and leave the rest to us.</p>


                            <div className="entryFormat">
                                <h3>For all types of contribution please make sure that</h3>
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
                    <p>This API is produced as an educational project by the students of Hack Your Future coding school</p>
                    <p> HackYourFuture is a coding school that provides newcomers with a refugee status an opportunity to 
                    build and improve programming skills. Over the course of seven months professional developers teach 
                    HTML, CSS, GitHub, JavaScript, Node, Databases and React. Problem-solving skills and teamwork are 
                    additional parts of the curriculum. In the last part of the course, students build a final project 
                    to put into practice what they have learned. This API is also a final project and involves mainly the 
                    broad techniques of front-end web developing. </p>
                    </div>
                </div>
            </div>
                
            </div>
        )
    }
}

export default Apidoc;