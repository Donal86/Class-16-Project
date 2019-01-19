import React from "react";
import { inject, observer } from "mobx-react";

@inject("PropertiesStore")
@observer
class CurrencyConverter extends React.Component {
  constructor(props) {
    super(props);
    props.PropertiesStore.listCurrencies();
  }

  render() {
    const { PropertiesStore } = this.props;

    return (
      <div>
        <div className="Converter">
          <select
            onChange={event => PropertiesStore.selectHandler(event)}
            value={PropertiesStore.properties.toCurrency}
          >
            {PropertiesStore.properties.currencies.map(currency => (
              <option key={currency}>{currency}</option>
            ))}
          </select>
        </div>
      </div>
    );
  }
}

export default CurrencyConverter;