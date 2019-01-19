import { observable, action, computed, runInAction } from "mobx";
import axios from 'axios';

class PropertiesStore {
  @observable
  properties = {
    data: [],
    status: "loading",
    toCurrency: localStorage.getItem("toCurrency"),
    currencies: []
  };

  @action
  listProperties() {
    this.properties.status = "loading";
    this.getProperties(this.properties.toCurrency)
      .then(properties => {
        runInAction(() => {
          this.properties.data = properties;
          this.properties.status = "done";
        });
      })
      .catch(err => (this.properties.status = "error"));
  }

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
        console.log(err.message);
      });
  }

  @computed
  get propertiesCount() {
    return this.properties.data.length;
  }
  getProperties(currency) {
    return fetch("api/properties?currency="+currency).then(response => response.json());
  }

  selectHandler = event => {
    this.properties.toCurrency = event.target.value;
    localStorage.setItem("toCurrency", event.target.value);
    this.listProperties();
  };
}
const store = new PropertiesStore();
export default store;