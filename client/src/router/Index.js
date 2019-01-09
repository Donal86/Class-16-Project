import React from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import Route from "react-router-dom/Route";
import List from "../components/List";

class Index extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to="/" exact={true}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/list" exact={true}>
                List
              </Link>
            </li>
          </ul>
          <Route
            path="/"
            exact={true}
            render={() => {
              return <h2>Welcome Home</h2>;
            }}
          />

          <Route path="/list" component={List} />
        </div>
      </Router>
    );
  }
}

export default Index;
