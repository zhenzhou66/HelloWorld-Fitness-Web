import React from "react";
import classes from "../Financial.module.css";

const ChartInfo = ({ title, amount, description }) => {
  return (
    <div className={classes.infoContainer}>
      <h2 className={classes.infoTitle}>{title}</h2>
      <div className={classes.infoDetails}>
        <p className={classes.infoAmount}>${amount}</p>
        <p className={classes.infoDescription}>{description}</p>
      </div>
    </div>
  );
};

export default ChartInfo;
