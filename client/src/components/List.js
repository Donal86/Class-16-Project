import axios from 'axios';
import { inject, observer } from 'mobx-react';
import React from 'react';

@inject('PropertiesStore')
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

    this.props.history.push({
      ...this.props.location,
      search: this.createQueryString()
    });

    this.getData();
  };

  render() {
    const pages = Math.ceil(this.state.total / 5);
    return (
      <div className='List-page'>
        <div className='List-sidebar'>
          {this.state.total === 1 ? <p> Found {this.state.total} house </p> : <p> Found {this.state.total} houses </p>}
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
          <br />
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

          <div
            onChange={e => {
              this.handleChange('rooms', e.target.value);
            }}>
            <input type='radio' name='rooms' value='1' />
            1+
            <input type='radio' name='rooms' value='2' />
            2+
            <input type='radio' name='rooms' value='3' />
            3+
            <input type='radio' name='rooms' value='4' />
            4+
            <input type='radio' name='rooms' value='5' />
            5+
          </div>
        </div>

        <select
          className='List-sorting'
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

        {this.state.data.length === 0 ? (
          <div className='List-search_no_results'>
            <h2>0 results </h2>{' '}
          </div>
        ) : (
            <div className='List-main'>
              {this.state.data.map(property => (
                <div className='List' key={property.id}>
                  {property.location_city}
                  <br />
                  {property.location_country}
                  <br />
                  Rooms {property.size_rooms}
                  <br />
                  {property.location_address}
                  <br />
                  Price {property.price_value}
                  <br />
                  <a href='http://localhost:3000/list'>{property.link}</a>
                  <br />
                  {property.images && <img width='200' alt='' src={property.images.split(',')[0]} />}
                  <br />
                  {property.market_date}
                </div>
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
    );
  }
}
export default List;
