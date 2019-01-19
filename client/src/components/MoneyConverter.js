import React from "react";
import { inject, observer } from "mobx-react";

@inject("PropertiesStore")
@observer
class MoneyConverter extends React.Component {
  constructor(props) {
    super(props);
    // props.PropertiesStore.listProperties();
    props.PropertiesStore.listCurrencies();
  }

  render() {
    const { PropertiesStore } = this.props;
    return (
      <div>
        <div className="Converter">
          <select
            name="to"
            onChange={event => PropertiesStore.selectHandler(event)}
            value={PropertiesStore.properties.toCurrency}
          >
            {PropertiesStore.properties.currencies.map(cur => (
              <option key={cur}>{cur}</option>
            ))}
          </select>
          <button onClick={PropertiesStore.convertHandler}>Convert</button>

          {PropertiesStore.properties.result && (
            <h3>{PropertiesStore.properties.result}</h3>
          )}
        </div>

        <table>
          <thead>
            <tr>
              <th>House</th>
              <th>Value</th>
              <th>Currency</th>
            </tr>
          </thead>
          <tbody>
            {PropertiesStore.properties.data.map((x, i) => (
              <tr className="dynamicHouses" key={i}>
                <td>house[{i}]</td>
                <td>{x.price_value}</td>
                <td>{x.price_currency}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default MoneyConverter;
