import React from "react";
import { BrowserRouter as Router, Switch, NavLink } from "react-router-dom";
import Route from "react-router-dom/Route";
import List from "../components/List";
import Contribute from "../components/contribution/Contribute";
import NoMatch from "../components/NoMatch";
import CityChart from '../components/stats/CityChart';
import HouseDetails from '../components/houseDetails'
import CurrencyConverter from "../components/currencyConverter"
import Apidoc from "../components/Apidoc";
import MainMap from "../components/MainMap";

class Index extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <div className="header">
            <ul className="navbar">
              <li>
                <NavLink
                  className="nav-link"
                  to="/"
                  exact
                  activeStyle={{ backgroundColor: '#555' }}
                >
                  Home
              </NavLink>
              </li>
              <li>
                <NavLink
                  className="nav-link"
                  to="/list"
                  exact
                  activeStyle={{ backgroundColor: '#555' }}
                >
                  List
              </NavLink>
              </li>
              <li>
                <NavLink
                  className="nav-link"
                  to="/contribute"
                  exact
                  activeStyle={{ backgroundColor: '#555' }}
                >
                  Contribute
              </NavLink>
              </li>
              <li>
                <NavLink
                  className="nav-link"
                  to="/citychart"
                  exact
                  activeStyle={{ backgroundColor: '#555' }}
                >
                  Display charts
							</NavLink>
              </li>
              <li>
                <NavLink
                  className="nav-link"
                  to="/map"
                  exact
                  activeStyle={{ backgroundColor: '#555' }}
                >
                  Map
              </NavLink>
              </li>
              <li>
                <NavLink
                  className="nav-link"
                  to="/doc"
                  exact
                  activeStyle={{ backgroundColor: '#555' }}
                >
                  Api Documentation
              </NavLink>
              </li>
              <li className="nav-currency">
                <CurrencyConverter />
              </li>
            </ul>
          </div>
          <Switch>
            <Route
              path="/"
              exact
              render={() => {
                return <div className="page-home"><h2>Welcome Home</h2></div>;
              }}
            />
            <Route path="/list" exact component={List} />
            <Route path="/contribute" exact component={Contribute} />
            <Route path="/citychart/:city?" component={CityChart} />
            <Route path='/house/:id?' component={HouseDetails} />
            <Route path="/doc" component={Apidoc} />
            <Route path="/map" component={MainMap} />
            <Route component={NoMatch} />
          </Switch>
        </div>
      </Router>
    )
  }
}

export default Index
