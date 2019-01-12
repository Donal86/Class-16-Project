import React, { Component } from "react";
import Index from "./router/Index";
import MoneyConverter from "./components/MoneyConverter";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Index />
        <MoneyConverter />
      </div>
    );
  }
}

export default App;
