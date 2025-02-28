import React from "react";
import classes from "./Feedback.module.css";
import TrainerPerformance from "./FeedbackComponents/TrainerPerformance";
import ClassPerformance from "./FeedbackComponents/ClassPerformace";
import LatestFeedback from "./FeedbackComponents/LatestFeedback";
export default function Feedback() {
  return (
    <div className={classes.feedbackContainer}>
      <div className={classes.performanceSection}>
        <div className={classes.trainerSection}>
          <TrainerPerformance />
        </div>
        <div className={classes.classSection}>
          <ClassPerformance />
        </div>
      </div>
      <div className={classes.latestFeedback}>
        <LatestFeedback />
      </div>
    </div>
  );
}
