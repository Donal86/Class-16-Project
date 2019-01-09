import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = { properties: [] };

  componentDidMount() {
    fetch("/api/properties")
      .then(res => res.json())
      .then(properties => this.setState({ properties }));

    this.postData([1, 2, 3]);
  }
  postData = (data) => {
    return fetch("/api/contribute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    }).then(response => console.log(response.json()));
  };

  render() {
    return (
      <div className="App">
        <h1>result</h1>
        {this.state.properties.result}
      </div>
    );
  }
}

export default App;
