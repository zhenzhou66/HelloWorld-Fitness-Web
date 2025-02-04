import React from "react";
import classes from "../Dashboard.module.css";

const UpperContent = () => {
  return (
    <div className={classes.UpperContent}>
      <div className={classes.Card}>
        <p>Total Revenue</p>
        <h3>$100,000</h3>
      </div>
      <div className={classes.Card}>
        <p>Current Active Members</p>
        <h3>500</h3>
      </div>
      <div className={classes.Card}>
        <p>Total Trainers</p>
        <h3>10</h3>
      </div>
    </div>
  );
};

export default UpperContent;
