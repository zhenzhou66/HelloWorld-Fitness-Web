import React from "react";
import classes from "./ClassAtd.module.css";
import SumStats from "./ClassAtdComponents/SumStats";
import PopChart from "./ClassAtdComponents/PopChart";

function ClassAtd() {
  return (
    <div className={classes.container}>
      <div className={classes.upperSection}>
        <PopChart />
        <SumStats />
      </div>
      <div className={classes.lowerSection}>atdtable</div>
    </div>
  );
}

export default ClassAtd;
