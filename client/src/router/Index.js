import React from 'react'
import { BrowserRouter as Router, Link } from 'react-router-dom'
import Route from 'react-router-dom/Route'
import List from '../components/List'
import Details from '../components/houseDetails'

class Index extends React.Component {
  render() {
    return (
      <Router>
        <div>
          <ul>
            <li>
              <Link to='/' exact>
                Home
             </Link>
            </li>
            <li>
              <Link to='/list' exact>
                List
             </Link>
            </li>
          </ul>
          <Route
            path='/'
            exact
            render={() => {
              return <h2>Welcome Home</h2>
            }}
          />

          <Route path='/list' component={List} />
          <Route path='/house' component={Details} />
        </div>
      </Router>
    )
  }
}

export default Index