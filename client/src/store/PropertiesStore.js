import axios from 'axios';
import { action, computed, observable } from 'mobx';

class PropertiesStore {
  @observable
  properties = {
    data: [],
    status: 'loading',
    result: null,
    fromCurrency: '',
    toCurrency: '',
    amount: 1,
    currencies: [], 
    total: 0
  };

  @action
  listCurrencies() {
    axios
      .get('http://api.openrates.io/latest')
      .then(response => {
        const currencyAr = ['EUR'];
        for (const key in response.data.rates) {
          currencyAr.push(key);
        }
        this.properties.currencies = currencyAr.sort();
      })
      .catch(err => {
        console.log('Opps', err.message);
      });
  }

  @computed
  get propertiesCount() {
    return this.properties.data.length;
  }
  getProperties() {
    return fetch('api/properties').then(response => response.json());
  }

  convertHandler = () => {
    axios
      .get(`http://api.openrates.io/latest?base=${this.properties.fromCurrency}&symbols=${this.properties.toCurrency}`)
      .then(response => {
        this.properties.data.forEach(x => {
          x.price_value = (x.price_value * response.data.rates[this.properties.toCurrency]).toFixed(2);
          x.price_currency = this.properties.toCurrency;
          this.properties.fromCurrency = x.price_currency;
        });
      })
      .catch(err => {
        console.log('Opps', err.message);
      });
  };

  selectHandler = event => {
    this.properties.toCurrency = event.target.value;
  };
}
const store = new PropertiesStore();
export default store;
