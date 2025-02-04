import React from "react";
import { useState } from "react";
import UpperContent from "./DashboardComponents/UpperContent";
import MiddleContent from "./DashboardComponents/MiddleContent";
import classes from "./Dashboard.module.css";
function Dashboard() {
  return (
    <div className={classes.DashboardContainer}>
      <div className={classes.DashboardContent}>
        <UpperContent />
        <MiddleContent />

        <div className={classes.LowerContent}></div>
      </div>
    </div>
  );
}

export default Dashboard;
