import React from "react";
import classes from "../GymAtd.module.css";

function InfoCards() {
  return (
    <div className={classes.upperSection}>
      <div className={classes.card}>
        <p>Total Check-ins Today</p>
        <h3>15</h3>
      </div>
      <div className={classes.card}>
        <p>Average Attendance per Day</p>
        <h3>15</h3>
      </div>
      <div className={classes.card}>
        <p>Attendance Rate</p>
        <h3>50%</h3>
      </div>
      <div className={classes.card}>
        <p>Peak Attendance Hour</p>
        <h3>5:00 AM</h3>
      </div>
    </div>
  );
}

export default InfoCards;
