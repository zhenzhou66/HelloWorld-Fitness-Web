import React from "react";
import classes from "./Feedback.module.css";

export default function Feedback() {
  return (
    <div className={classes.feedbackContainer}>
      <div className={classes.performanceSection}>
        <div className={classes.trainerSection}>Trainer Performance</div>
        <div className={classes.classSection}>Class Performance</div>
      </div>
      <div className={classes.latestFeedback}>coach 1 </div>
    </div>
  );
}
