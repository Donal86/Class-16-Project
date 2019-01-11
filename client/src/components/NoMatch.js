import React from "react";
import { Link } from "react-router-dom";

class NoMatch extends React.Component {
  render() {
    return (
      <div className="pages">
        <h2>404</h2>
        <h4>Sorry, the page you are looking for doesn't exist!</h4>
        <div className="page-not-found-img">
          <img
            src="https://images.vexels.com/media/users/3/143466/isolated/preview/b47bfb19d11e66c3be00ccb0632047ce-simple-magnifying-glass-by-vexels.png"
            width="300"
            height="300"
            alt="404 img"
          />
        </div>
        <Link to="/">
          <button type="button" class="btn btn-dark">
            BACK TO HOME PAGE
          </button>
        </Link>
      </div>
    );
  }
}

export default NoMatch;
