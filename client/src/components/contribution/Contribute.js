import React from "react";
import { inject, observer } from "mobx-react";
import ResultsTable from "./ResultsTable";
import InsertForm from "./InsertForm";
import './style.css';

@inject("PropertiesStore")
@observer
class Contribute extends React.Component {
  render() {
    const { PropertiesStore } = this.props;
    const insertResults = PropertiesStore.properties.details.length && PropertiesStore.properties.step === 'result' ? (
      <ResultsTable />
    ) : (
        <InsertForm />
      );
    return (
      <div className="page-contribute">
        <h2>Contribute with us! add your properties</h2>
        {insertResults}
      </div>
    );
  }
}

export default Contribute;
