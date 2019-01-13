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
    total: 0,
    insertStatus: "loading",
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

  @action createProperty(jsonFromText) {
    this.properties.insertStatus = "loading";
    this.postProperty(jsonFromText)
      .then(result => {
        runInAction(() => {
          this.properties.details.push(result);
          this.properties.insertStatus = "done";
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
    return axios
      .post("api/contribute", jsonInput)
      .then(response => {
        if (response.status === 400 || response.status === 500) {
          return Promise.reject(
            new Error(
              "Invalid Please make sure you entered the right data form ..."
            )
          );
        }
        return response.data;
      })
      .catch(err => {
        console.log(err);
      });
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
