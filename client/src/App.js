import React, { Component } from "react";
import Index from "./router/Index";
import HouseMap from "./components/HouseMap.js";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Index />
        <HouseMap/>
      </div>
    );
  }
}

export default App;
