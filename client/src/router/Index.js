import React from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import List from '../components/List';

class Index extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to='/' exact="true">
                Home
              </Link>
            </li>
            <li>
              <Link to='/list' exact="true">
                List
              </Link>
            </li>
          </ul>
          <Route
            path='/'
            exact={true}
            render={() => {
              return <h2>Welcome Home</h2>;
            }}
          />

          <Route path='/list' component={List} />
        </div>
      </Router>
    );
  }
=======
import { BrowserRouter as Router, Link, Switch } from 'react-router-dom';
import Route from 'react-router-dom/Route';
import List from '../components/List';
import CityChart from '../components/stats/CityChart';

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
						<li>
							<Link to={{ pathname: "citychart" }} exact={true}>
								Display charts
							</Link>
						</li>
					</ul>
					<Switch>
						<Route
							path="/"
							exact={true}
							render={() => {
								return <h2>Welcome Home</h2>;
							}}
						/>
						<Route path="/list" component={List} />
						<Route path="/citychart" component={CityChart} />
					</Switch>
				</div>
			</Router>
		);
	}
>>>>>>> add chart code
}

export default Index;
