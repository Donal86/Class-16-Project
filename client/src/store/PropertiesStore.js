import { observable, action, computed, runInAction } from 'mobx';

class PropertiesStore {
  @observable
  properties = {
    data: [],
    status: 'loading'
  };

  @action
  listProperties() {
    this.properties.status = 'loading';
    this.getProperties()
      .then((properties) => {
        runInAction(() => {
          this.properties.data = properties;
          this.properties.status = 'done';
        });
      })
      .catch((err) => (this.properties.status = 'error'));
  }
  @computed
  get propertiesCount() {
    return this.properties.data.length;
  }
  getProperties() {
    return fetch('api/properties').then((response) => response.json());
  }
}

const store = new PropertiesStore();
export default store;
