import React from "react";
import { inject, observer } from "mobx-react";
import ResultsTable from "../components/ResultsTable";

@inject("PropertiesStore")
@observer
class Contribute extends React.Component {
  insertJson = e => {
    e.preventDefault();
    if (this.inputFromText.value) {
      const jsonFromText = { type: "json", json: this.inputFromText.value };
      this.props.PropertiesStore.createProperty(jsonFromText);
    } else if (this.inputFromUrl.value) {
      const jsonFromUrl = { type: "url", url: this.inputFromUrl.value };
      this.props.PropertiesStore.createProperty(jsonFromUrl);
    }
  };
  render() {
    const { PropertiesStore } = this.props;
    const insertResults = PropertiesStore.properties.details.length ? (
      <ResultsTable />
    ) : null;
    return (
      <div className="pages">
        <h2>Contribute with us! add your properties</h2>
        <p>
          See our contribution conditions
          <a href="http://www.google.com"> here</a>.
        </p>
        <div className="insert-form">
          {this.props.PropertiesStore.properties.insertStatus === "error" ? (
            <p className="error">
              Please make sure you entered valid inputs
              <a href="http://www.google.com"> see contribution conditions</a>.
            </p>
          ) : this.props.PropertiesStore.properties.insertStatus === "done" ? (
            <p className="succeed">Valid!</p>
          ) : null}
          <form onSubmit={e => this.insertJson(e)}>
            <div className="form-row">
              <div className="col-7">
                <textarea
                  className="form-control"
                  placeholder="insert JSON"
                  ref={input => (this.inputFromText = input)}
                />
                <div />
                <div>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="Enter api for JSON url"
                    ref={input => (this.inputFromUrl = input)}
                  />
                </div>
              </div>
            </div>
            <div className="col-auto">
              <button type="submit" className="btn btn-primary mb-2">
                Insert
              </button>
            </div>
          </form>
        </div>
        <div>{insertResults}</div>
      </div>
    );
  }
}

export default Contribute;
