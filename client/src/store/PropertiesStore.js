import axios from 'axios';
import { action, computed, observable, runInAction } from 'mobx';

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
    total: 0,
    insertStatus: "loading",
    errorMessage: 'something went wrong',
    details: []
  };

  @action
  listCurrencies() {
    axios
      .get('https://api.openrates.io/latest')
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

  @action createProperty(jsonInput) {
    console.log('jsonInput: ', jsonInput);
    this.properties.insertStatus = 'loading';
    this.postProperty(jsonInput)
      .then(result => {
        runInAction(() => {
          if (result.status === 400) {
            this.properties.insertStatus = 'error';
            this.properties.errorMessage = 'Please make sure you entered valid inputs'
            return;
          }
          if (result.status === 500) {
            this.properties.insertStatus = 'error'
            this.properties.errorMessage = 'Something went wrong';
            return;
          } else {
            this.properties.details.push(result);
            this.properties.insertStatus = 'done';
          }
        });
      })
      .catch(err => {
        console.log("err: ", err);
        this.properties.insertStatus = "error";
      });
  }

  @computed
  get propertiesCount() {
    return this.properties.data.length;
  }

  getProperties() {
    return fetch('api/properties').then(response => response.json());
  }

  postProperty(jsonInput) {
    return axios.post("api/contribute", jsonInput).then(response => {

      return response.data;
    }).catch((err) => err.response);
  }

  convertHandler = () => {
    axios
      .get(`https://api.openrates.io/latest?base=${this.properties.fromCurrency}&symbols=${this.properties.toCurrency}`)
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
