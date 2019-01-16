import React from "react";
import { inject, observer } from "mobx-react";

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
    const tableElements = PropertiesStore.properties.details.map(
      (el, index) => (
        <div key={index}>
          <div>
            <p>valid:</p>
            <p>{el.insertedItems}</p>
          </div>
          <div>
            <p>failed:</p>
            <p>{el.errors}</p>
          </div>
          <div>
            details:
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
          <p>Results:</p>
          {tableElements}
          <button onClick={this.LoadMore}>Load More</button>
        </div>
      </div>
    );
  }
}

export default ResultsTable;
