import React from "react";
import classes from "./Analytics.module.css";
import { useState } from "react";
import ClassAtd from "./PageClassAtd/ClassAtd";
import Financial from "./PageFinancial/Financial";
import GymAtd from "./PageGymAtd/GymAtd";
import NavBar from "./NavBar/NavBar";

function Analytics() {
  const [selectedComponent, setSelectedComponent] = useState("PageOne");

//customizing nav bar buttons
  const buttons = [
    { label: "Gym Attendance", component: "PageOne" },
    { label: "Class Attendance", component: "PageTwo" },
    { label: "Financial", component: "PageThree" },
  ];

  const renderComponent = () => {
    switch (selectedComponent) {
      case "PageOne":
        return <GymAtd />;
      case "PageTwo":
        return <ClassAtd />;
      case "PageThree":
        return <Financial />;
      default:
        return null;
    }
  };

  return (
    <div className={classes.AnalyticsContainer}>
      <NavBar setSelectedComponent={setSelectedComponent} buttons={buttons} />
      <div className={classes.componentContainer}>
        {renderComponent()}
        </div>
    </div>
  );
}

export default Analytics;
