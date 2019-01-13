import React from "react";
import { inject, observer } from "mobx-react";

@inject("PropertiesStore")
@observer
class ResultsTable extends React.Component {
  render() {
    const { PropertiesStore } = this.props;
    const tableElements = PropertiesStore.properties.details.map(
      (el, index) => (
        <tbody key={index}>
          <tr>
            <td>processed:</td>
            <td>{el.insertedItems}</td>
          </tr>
          <tr>
            <td>failed:</td>
            <td>{el.errors}</td>
          </tr>
          <tr>
            <td>details:</td>
            <td>
              {el.errMessages.length
                ? el.errMessages.map(item => item.error)
                : "All valid :) "}
            </td>
          </tr>
        </tbody>
      )
    );
    return (
      <table className="result-table">
        <thead>
          <tr>
            <th>Results:</th>
          </tr>
        </thead>
        {tableElements}
      </table>
    );
  }
}

export default ResultsTable;
