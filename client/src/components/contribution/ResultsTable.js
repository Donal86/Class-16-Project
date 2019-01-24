import React from "react";
import { inject, observer } from "mobx-react";
import ReactJson from 'react-json-view';

@inject("PropertiesStore")
@observer
class ResultsTable extends React.Component {
  state = {
    limit: 2,
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
      (errMsgLength && this.state.limit < errMsgLength) && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={this.LoadMore}
        >
          Load More
        </button>
      );
    const tableElements = PropertiesStore.properties.details.map(
      (el, index) => (
        <div className="result-div" key={index}>
          <div>
            <span>
              <strong>Valid: </strong>
            </span>
            <span>{el.insertedItems}</span>
            <hr />
          </div>
          <div>
            <span>
              <strong>Failed: </strong>
            </span>
            <span>{el.errors}</span>
            <hr />
          </div>
          <div>
            <strong>Details:</strong>
            {el.errMessages.length ? (
              el.errMessages.slice(0, this.state.limit).map((msg, i) => (
                <div className="error-msg" key={i}>
                  <span className="red-color">Error message: </span>
                  {msg.messages}
                  <ReactJson src={msg.raw} name={false} enableClipboard={false} displayDataTypes={false} />
                  <hr />
                </div>
              ))
            ) : (
                <span> All valid</span>
              )}
          </div>
        </div>
      )
    );
    return (
      <div className="pages">
        <div className="result-table">
          <h4>Results:</h4>
          {tableElements}
          {showButton}
        </div>
      </div>
    );
  }
}

export default ResultsTable;
