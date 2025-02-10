import React from "react";
import classes from "./GymAtd.module.css";
import InfoCards from "./GymAtdComponents/InfoCards";
import AtdChart from "./GymAtdComponents/AtdChart";
import RecentTable from "./GymAtdComponents/RecentTable";

function GymAtd() {
  return (
    <div className={classes.container}>
      <InfoCards />
      <AtdChart />
      <RecentTable />
    </div>
  );
}

export default GymAtd;
