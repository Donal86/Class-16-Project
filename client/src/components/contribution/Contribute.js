import React from "react";
import { inject, observer } from "mobx-react";
import ResultsTable from "./ResultsTable";
import InsertForm from "./InsertForm";
import { FaChevronLeft } from "react-icons/fa";
import './style.css';

@inject("PropertiesStore")
@observer
class Contribute extends React.Component {
  goBack = () => {
    this.props.PropertiesStore.changeStep('form');
  }

  render() {
    const { PropertiesStore } = this.props;
    const step = PropertiesStore.properties.step;
    const insertResults = PropertiesStore.properties.details.length && step === 'result' ? (
      <ResultsTable />
    ) : (
        <InsertForm />
      );
    return (
      <div className="page-contribute">
        <h2><button type="button" class="btn btn-dark right" style={hideButton(step)} onClick={() => this.goBack()}><FaChevronLeft className="icon" />Back</button>
          Contribute with us! add your properties</h2>
        {insertResults}
      </div>
    );
  }
}
function hideButton(step) {
  return {
    display: step === 'form' ? 'none' : 'block'
  };
}

export default Contribute;
