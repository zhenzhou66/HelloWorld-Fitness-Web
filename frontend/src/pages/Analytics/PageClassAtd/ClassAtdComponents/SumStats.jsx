import React from "react";
import classes from "../ClassAtd.module.css";

function SumStats() {
  return (
    <div className={classes.rightsection}>
      <h3> Summarry Statistics</h3>

      <div className={classes.stat}>
        <h4> Total Students</h4>
        <p> 100</p>
      </div>
      <div className={classes.stat}>
        <h4> Present</h4>
        <p> 80</p>
      </div>
      <div className={classes.stat}>
        <h4> Absent</h4>
        <p> 20</p>
      </div>
    </div>
  );
}

export default SumStats;
