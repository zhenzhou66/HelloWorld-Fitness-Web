import React from "react";
import classes from "./ClassAtd.module.css";
import SumStats from "./ClassAtdComponents/SumStats";
import PopChart from "./ClassAtdComponents/PopChart";
import AtdTable from "./ClassAtdComponents/AtdTable";

function ClassAtd() {
  return (
    <div className={classes.container}>
      <div className={classes.upperSection}>
        <PopChart />
        <SumStats />
      </div>
      <div className={classes.lowerSection}>
        <AtdTable />
      </div>
    </div>
  );
}

export default ClassAtd;
