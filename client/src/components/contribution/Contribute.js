import React from "react";
import { inject, observer } from "mobx-react";
// import ResultsTable from "./ResultsTable";
import InsertForm from "./InsertForm";
import { Redirect } from "react-router-dom";

@inject("PropertiesStore")
@observer
class Contribute extends React.Component {
  render() {
    const { PropertiesStore } = this.props;
    const insertResults = PropertiesStore.properties.details.length ? (
      <Redirect to="/contribute/result" />
    ) : (
      <InsertForm />
    );
    return (
      <div className="pages">
        <h2>Contribute with us! add your properties</h2>
        <div className="container">
          <div className="guide-link-div">
            {/* fake link for now, I'll change it when the guid page is ready! */}
            <a className="guide-link" href="http://www.google.com">
              guide
            </a>
          </div>
          {insertResults}
        </div>
      </div>
    );
  }
}

export default Contribute;
