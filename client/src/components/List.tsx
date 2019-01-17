// import axios from 'axios';
// import { inject, observer } from 'mobx-react';
// import React from 'react';
// type ListState = any & { data: undefined[], total: number };
// @inject('PropertiesStore')
// @observer
// class List extends React.Component<{}, ListState> {
//   constructor(props) {
//     super(props);
//     props.PropertiesStore.listProperties();
//     this.parseParamsFromUrl();
//     this.getData();
//   }
//   async getData() {
//     try {
//       const res = await axios.get(`/api/properties?${this.createQueryString()}`);
//       this.setState({
//         ...res.data
//       });
//       console.log(res.data);
//     } catch (err) {}
//   }
//   createQueryString() {
//     return Object.keys(this.params)
//       .filter(name => this.params[name])
//       .map(name => `${name}=${this.params[name]}`)
//       .join('&');
//   }
//   state = {
//     data: [],
//     total: 0
//   };
//   parseParamsFromUrl = () => {
//     const { search } = this.props.location;
//     this.params = {
//       page: 1,
//       price_min: 0,
//       price_max: 100000000,
//       order: 'market_date_asc',
//       rooms: 1
//     };
//     this.static = {
//       cities: [],
//       countries: []
//     };
//     if (search.length > 1) {
//       const params = search
//         .slice(1)
//         .split('&')
//         .reduce((params, pair) => {
//           const [name, value] = pair.split('=');
//           params[name] = value;
//           return params;
//         }, {});
//       Object.assign(this.params, params);
//     }
//   };
//   handleChange = (field, value) => {
//     this.params[field] = value;
//     this.props.history.push({
//       ...this.props.location,
//       search: this.createQueryString()
//     });
//     this.getData();
//   };
//   render() {
//     const pages = Math.ceil(this.state.total / 5);
//     // console.log(this.state.data)
//     let x = this.state.data.map((el, i) => el.location_city);
//     return (
//       <div className="List-page">
//         <div className="List-sidebar">
//           {this.state.total == 1 ? <p> Found {this.state.total} house </p> : <p> Found {this.state.total} houses </p>}
//           <p>Current parameters </p>
//           <select
//             value={this.params.city}
//             onChange={e => {
//               this.handleChange('city', e.target.value);
//             }}
//           >
//             <option value="">select city</option>
//             {['Basel', 'Amsterdam'].map(field => <option value={field}>{field}</option>)}
//           </select>
//           <hr />

//           <select
//             value={this.params.country}
//             onChange={e => {
//               this.handleChange('country', e.target.value);
//             }}
//           >
//             <option value="">select country</option>
//             {['Netherlands', 'France'].map(field => <option value={field}>{field}</option>)}
//           </select>

//           <select
//             value={this.params.order}
//             onChange={e => {
//               this.handleChange('order', e.target.value);
//             }}
//           >
//             {['price_value', 'market_date'].map(field => (
//               <React.Fragment>
//                 <option value={`${field}_asc`}>{field} asc</option>
//                 <option value={`${field}_desc`}>{field} desc</option>
//               </React.Fragment>
//             ))}
//           </select>
//           <input
//             type="number"
//             value={this.params.price_min}
//             onChange={e => {
//               this.handleChange('price_min', e.target.value);
//             }}
//           />
//           <input
//             type="number"
//             value={this.params.price_max}
//             onChange={e => {
//               this.handleChange('price_max', e.target.value);
//             }}
//           />

//           <div
//             onChange={e => {
//               this.handleChange('rooms', e.target.value);
//             }}
//           >
//             <input type="radio" name="rooms" value="1" />
//             1+
//             <input type="radio" name="rooms" value="2" />
//             2+
//             <input type="radio" name="rooms" value="3" />
//             3+
//             <input type="radio" name="rooms" value="4" />
//             4+
//             <input type="radio" name="rooms" value="5" />
//             5+
//           </div>
//         </div>

//         {this.state.data.length === 0 ? (
//           <div className="List-search_no_results">
//             <h2>0 results </h2>Kakie esche filtry nado sdelat???????????Jenya bayu bayushki bayu ne lojisya na krau pridet serenkiy volchok i ukusit za bochok!{' '}
//           </div>
//         ) : (
//           <div className="List-main">
//             {this.state.data.map(property => (
//               <div className="List" key={property.id}>
//                 {property.location_city}
//                 <br />
//                 {property.location_country}
//                 <br />
//                 Rooms {property.size_rooms}
//                 <br />
//                 {property.sold}
//                 <br />
//                 {property.price_value} <a href="">{property.link}</a>
//                 <br />
//                 {property.images && <img width="200" src={property.images.split(',')[0]} />}
//                 <br />
//                 {property.market_date}
//                 <br />
//                 <br />
//                 <br />
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="List-pagination">
//           {pages > 0 && (
//             <ul>
//               {Array(pages)
//                 .fill(0)
//                 .map((el, index) => (
//                   <li
//                     onClick={() => {
//                       this.handleChange('page', index + 1);
//                     }}
//                     className={`${this.params.page - 1 === index ? 'active' : ''}`}
//                   >
//                     {index + 1}
//                   </li>
//                 ))}
//             </ul>
//           )}
//         </div>
//       </div>
//     );
//   }
// }
// export default List;
