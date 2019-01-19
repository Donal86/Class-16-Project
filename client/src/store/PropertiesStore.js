import axios from 'axios';
import { action, computed, observable, runInAction } from 'mobx';

class PropertiesStore {
  @observable
  properties = {
    data: [],
    singleHouse: {},
    status: 'loading',
    result: null,
    fromCurrency: '',
    toCurrency: '',
    amount: 1,
    currencies: [],
    total: 0,
    insertStatus: "loading",
    errorCode: 200,
    step: 'form',
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

  houseDetails(id) {
    this.properties.status = 'loading'
    this.getSingleHouse(id)
      .then(house => {
        runInAction(() => {
          this.properties.singleHouse = house.length < 1 ? null : house
          this.properties.status = 'done'
        })
      })
      .catch(err => (this.properties.status = 'error'))
  }

  @action createProperty(jsonInput) {
    this.properties.insertStatus = 'loading';
    this.properties.details = [];
    this.postProperty(jsonInput)
      .then(result => {
        runInAction(() => {
          if (result.status === 400) {
            this.properties.insertStatus = 'error';
            this.properties.errorCode = 400;
            return;
          }
          if (result.status === 500) {
            this.properties.insertStatus = 'error'
            this.properties.errorCode = 500;
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
  @action changeStep(step) {
    this.properties.step = step;
  }

  @computed get detailsOfHouse() {
    return this.properties.singleHouse
  }

  @computed
  get propertiesCount() {
    return this.properties.data.length
  }

  getProperties() {
    return fetch('api/properties').then(response => response.json());
  }

  postProperty(jsonInput) {
    return axios.post("api/contribute", jsonInput).then(response => {

      return response.data;
    }).catch((err) => err.response);
  }

  getSingleHouse(id) {
    return fetch(`api/house?id=${id}`)
      .then(response => response.json())
      .catch(err => console.log('line 70 store', err))
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
