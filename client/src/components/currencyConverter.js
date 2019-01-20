import React from "react";
import { inject, observer } from "mobx-react";

import { SUPPORTED_CURRENCIES } from '../store/PropertiesStore';

@inject("PropertiesStore")
@observer
class CurrencyConverter extends React.Component {
  render() {
    const { PropertiesStore } = this.props;

    return (
      <div>
        <div className="Converter">
          <select
            className="form-control"
            onChange={event => PropertiesStore.selectHandler(event)}
            value={PropertiesStore.properties.toCurrency}
          >
            {SUPPORTED_CURRENCIES.map(currency => (
              <option key={currency}>{currency}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

export default CurrencyConverter;
