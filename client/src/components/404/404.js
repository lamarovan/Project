import React from "react";
import { Link } from "react-router-dom";

import "./404.scss";

const NotFound = props => {
  return (
    <div className="not-found">
      <Link to="/dashboard">
        <b>404</b>
      </Link>
      <br />
      <h3>The requested page was not found on our server.</h3>
    </div>
  );
};

export default NotFound;
