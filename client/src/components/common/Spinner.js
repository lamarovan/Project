import React from "react";

import spinner from "../../img/spinner.gif";

import "./spinner.scss";

const Spinner = () => {
  return (
    <div className="spinner">
      <img className="indicator" src={spinner} alt="Loading..." />
    </div>
  );
};

export default Spinner;
