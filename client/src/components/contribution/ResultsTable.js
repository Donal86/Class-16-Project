import React from "react";
import { inject, observer } from "mobx-react";
import { Redirect } from "react-router-dom";

@inject("PropertiesStore")
@observer
class ResultsTable extends React.Component {
  state = {
    limit: 2
  };
  LoadMore = () => {
    this.setState({
      limit: this.state.limit + 3
    });
  };

  render() {
    const { PropertiesStore } = this.props;
    const errMsgLength =
      PropertiesStore.properties.details[0].errMessages.length;
    const showButton =
      errMsgLength && this.state.limit < errMsgLength ? (
        <button
          type="button"
          className="btn btn-primary"
          onClick={this.LoadMore}
        >
          Load More
        </button>
      ) : null;
    const tableElements = PropertiesStore.properties.details.map(
      (el, index) => (
        <div key={index}>
          <div>
            <p>
              <strong>valid:</strong>
            </p>
            <p>{el.insertedItems}</p>
          </div>
          <div>
            <p>
              <strong>failed:</strong>
            </p>
            <p>{el.errors}</p>
          </div>
          <div>
            <strong>details:</strong>
            {el.errMessages.length ? (
              el.errMessages.slice(0, this.state.limit).map((msg, i) => (
                <div key={i}>
                  <p>
                    <span>error message: </span>
                    {msg.messages}
                  </p>
                  <pre>{JSON.stringify(msg.raw, null, 4)}</pre>
                </div>
              ))
            ) : (
              <span>All valid</span>
            )}
          </div>
        </div>
      )
    );
    return (
      <div className="pages">
        <div className="result-table">
          <button>Back to form</button>
          <h4>Results:</h4>
          {tableElements}
          {showButton}
        </div>
      </div>
    );
  }
}

export default ResultsTable;
