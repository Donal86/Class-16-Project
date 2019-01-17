import React from "react";
import { inject, observer } from "mobx-react";

@inject("PropertiesStore")
@observer
class CurrencyConverter extends React.Component {
  render() {
    const { PropertiesStore } = this.props;
    const currencies = [
      "EUR", "USD", "GBP", "RUB", "TRY", "HRK", "HUF", "IDR", "PHP",  "RON", "ISK", "SEK", "THB", "PLN", "CAD", "AUD", "MYR", "NZD", "CHF", "DKK", "SGD", "CNY", "BGN", "CZK", "BRL", "JPY", "KRW", "INR", "MXN", "HKD", "ZAR", "ILS", "NOK"];
    return (
      <div>
        <div className="Converter">
          <select
            name="to"
            onChange={event => PropertiesStore.selectHandler(event)}
            value={PropertiesStore.properties.toCurrency}
          >
            {currencies.map(currency => (
              <option key={currency}>{currency}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

export default CurrencyConverter;
