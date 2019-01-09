import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
  state = { properties: [] };

  componentDidMount() {
    fetch("/api/properties")
      .then(res => res.json())
      .then(properties => this.setState({ properties }));

    this.postData();
  }
  postData = () => {
    return fetch("/api/contribute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ msg: "Hello from client" })
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
