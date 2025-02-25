import React from "react";
import classes from "./Financial.module.css";
import RevLineChart from "./FinComponents/RevLineChart";
import RevPieChart from "./FinComponents/RevPieChart";
import UnpaidBarChart from "./FinComponents/UnpaidBarChart";
import RevSourceTable from "./FinComponents/RevSourceTable";

function Financial() {
  return (
    <div className={classes.container}>
      <RevLineChart />

      <div className={classes.midSection}>
        <RevPieChart />
        <UnpaidBarChart />
      </div>
      <div className={classes.lowerSection}>
        <RevSourceTable />
      </div>
    </div>
  );
}

export default Financial;
