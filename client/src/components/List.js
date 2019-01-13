import axios from 'axios';
import { inject, observer } from 'mobx-react';
import React from 'react';
import { Link } from "react-router-dom";
import HouseMap from "./HouseMap.js";

@inject("PropertiesStore")
@observer
class List extends React.Component {
  constructor(props) {
    super(props);

    this.parseParamsFromUrl();
    this.getData();
  }

  async getData() {
    try {
      const res = await axios.get(`/api/properties?${this.createQueryString()}`);
      this.setState({
        ...res.data
      });
    } catch (err) { }
  }

  createQueryString() {
    return Object.keys(this.params)
      .filter(name => this.params[name])
      .map(name => `${name}=${this.params[name]}`)
      .join('&');
  }

  state = {
    data: [],
    total: 0,
    countryCity: []
  };

  parseParamsFromUrl = () => {
    const { search } = this.props.location;
    this.params = {
      page: 1,
      price_min: 0,
      price_max: 100000000,
      order: 'market_date_asc',
      rooms: 1,
      city: '',
      country: ''
    };
    if (search.length > 1) {
      const params = search
        .slice(1)
        .split('&')
        .reduce((params, pair) => {
          const [name, value] = pair.split('=');
          params[name] = value;

          return params;
        }, {});

      Object.assign(this.params, params);
    }
  };

  handleChange = (field, value) => {
    this.params[field] = value;

    if (field !== 'page') {
      this.params.page = 1;
    }

    this.props.history.push({
      ...this.props.location,
      search: this.createQueryString()
    });

    this.getData();
  };

  render() {
    const pages = Math.ceil(this.state.total / 5);

    const cur = this.props.PropertiesStore.properties.toCurrency;

    return (
      <React.Fragment>
        <div className='List-page'>
          <div className='List-sidebar'>
            <div className="List-filters">

              <div className="List-filter">
                <div className="List-filter-label">Country</div>
                <select
                  value={this.params.country}
                  onChange={e => {
                    this.handleChange('country', e.target.value);
                  }}>
                  <option value=''>select country</option>
                  {this.state.countryCity
                    .sort((a, b) => {
                      if (a.location_country > b.location_country) {
                        return 1;
                      } else {
                        return -1;
                      }
                    })
                    .map((field, i) => (
                      <option key={i} value={field.location_country}>
                        {field.location_country}
                      </option>
                    ))}
                </select>
              </div>


              <div className="List-filter">
                <div className="List-filter-label">City</div>
                <select
                  value={this.params.city}
                  onChange={e => {
                    this.handleChange('city', e.target.value);
                  }}>
                  <option value=''>select city</option>
                  {this.state.countryCity
                    .sort((a, b) => {
                      if (a.location_city > b.location_city) {
                        return 1;
                      } else {
                        return -1;
                      }
                    })
                    .map((field, i) => (
                      <option key={i} value={field.location_city}>
                        {field.location_city}
                      </option>
                    ))}
                </select>
              </div>

              <div className="List-filter">
                <div className="List-filter-label">Price</div>
                <input
                  type='number'
                  value={this.params.price_min}
                  onChange={e => {
                    this.handleChange('price_min', e.target.value);
                  }}
                />
                <input
                  type='number'
                  value={this.params.price_max}
                  onChange={e => {
                    this.handleChange('price_max', e.target.value);
                  }}
                />
              </div>

              <div className="List-filter">
                <div className="List-filter-label">Number of rooms</div>
                <div
                  onChange={e => {
                    this.handleChange('rooms', e.target.value);
                  }}>
                  <label>
                    <input type='radio' name='rooms' value='1' />
                    1+
                  </label>
                  <label>
                    <input type='radio' name='rooms' value='2' />
                    2+
                  </label>
                  <label>
                    <input type='radio' name='rooms' value='3' />
                    3+
                  </label>
                  <label>
                    <input type='radio' name='rooms' value='4' />
                    4+
                  </label>
                  <label>
                    <input type='radio' name='rooms' value='5' />
                    5+
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="List-main">
            {this.state.total === 1 ? <div className="List-total"> Found {this.state.total} house </div> : <div className="List-total"> Found {this.state.total} houses </div>}

            <HouseMap houses={this.props.PropertiesStore.properties.data} />

            <div className="List-filter">
              Order by: &nbsp;
              <select
                value={this.params.order}
                onChange={e => {
                  this.handleChange('order', e.target.value);
                }}>
                {['price_value', 'market_date'].map((field, i) => (
                  <React.Fragment key={i}>
                    <option value={`${field}_asc`}>{field} asc</option>
                    <option value={`${field}_desc`}>{field} desc</option>
                  </React.Fragment>
                ))}
              </select>
            </div>

            {this.state.data.length === 0 ? (
              <div className='List-search_no_results'>
                <h2>0 results </h2>{' '}
              </div>
            ) : (
                <div className='List-main'>
                  {this.state.data.map(property => (
                    <Link to={`/house?id=${property.id}`} className='List' key={property.id}>
                      <div className="List-img" style={{
                        backgroundImage: property.images ? `url(${property.images.split(',')[0]})` : ''
                      }}>
                      </div>
                      <div className="List-info">
                        <div className="List-info--price">
                          {property.price_value.toLocaleString('en-US', {
                            style: 'currency',
                            currency: property.price_currency,
                          })}
                          <br />
                          {property.price_value_converted.toLocaleString('en-US', {
                            style: 'currency',
                            currency: cur,
                          })}
                        </div>
                        <div className="List-info--address">
                          {property.location_address} <br />
                          {property.location_city}, {property.location_country}
                        </div>
                        <div className="List-info--rooms">
                          Rooms {property.size_rooms}
                        </div>
                        <div>
                          {property.link}
                        </div>
                        <div>
                          {property.market_date}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            <div className='List-pagination'>
              {pages > 0 && (
                <ul>
                  {Array(pages)
                    .fill(0)
                    .map((el, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          this.handleChange('page', index + 1);
                        }}
                        className={`${this.params.page - 1 === index ? 'active' : ''}`}>
                        {index + 1}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          </div>

        </div>


      </React.Fragment>
    );
  }
}
export default List;
