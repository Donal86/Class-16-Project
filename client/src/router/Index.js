import React from "react";
import { BrowserRouter as Router, Switch, NavLink } from "react-router-dom";
import Route from "react-router-dom/Route";
import List from "../components/List";
import Contribute from "../components/contribution/Contribute";
import NoMatch from "../components/NoMatch";
import CityChart from '../components/stats/CityChart';

class Index extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <ul className="navbar">
            <li>
              <NavLink
                className="nav-link"
                to="/"
                exact
                activeStyle={{ color: "gray" }}
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                className="nav-link"
                to="/list"
                exact
                activeStyle={{ color: "gray" }}
              >
                List
              </NavLink>
            </li>
            <li>
              <NavLink
                className="nav-link"
                to="/contribute"
                exact
                activeStyle={{ color: "gray" }}
              >
                Contribute
              </NavLink>
            </li>
            <li>
              <NavLink
                className="nav-link"
                to={{ pathname: "citychart" }}
                exact
                activeStyle={{ color: "gray" }}
              >
                Display charts
							</NavLink>
            </li>
          </ul>
          <Switch>
            <Route
              path="/"
              exact
              render={() => {
                return <h2>Welcome Home</h2>;
              }}
            />
            <Route path="/list" exact component={List} />
            <Route path="/contribute" exact component={Contribute} />
            <Route path="/citychart/:city?" component={CityChart} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default Index;
