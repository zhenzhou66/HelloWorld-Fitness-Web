import React, { useState, useRef } from "react";
import classes from "./Analytics.module.css";
import ClassAtd from "./PageClassAtd/ClassAtd";
import Financial from "./PageFinancial/Financial";
import GymAtd from "./PageGymAtd/GymAtd";
import NavBar from "./NavBar/NavBar";
// import ReactToPrint from "react-to-print";

function Analytics() {
  const [selectedComponent, setSelectedComponent] = useState("PageOne");
  const contentRef = useRef(null); // Reference for printing and previewing

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

  // Function to extract CSS styles from the current document
  const getStyles = () => {
    let styles = "";
    document.querySelectorAll("link[rel='stylesheet'], style").forEach((style) => {
      styles += style.outerHTML; // Extract all stylesheet links and inline styles
    });
    return styles;
  };

  // Function to preview in a new tab with original CSS
  const handlePreview = () => {
    if (contentRef.current) {
      const newWindow = window.open("", "_blank");
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
              <title>Preview Report</title>
              ${getStyles()} <!-- Include extracted styles -->
            </head>
            <body>
              <div class="${classes.AnalyticsContainer}">
                <div class="${classes.componentContainer}">
                  ${contentRef.current.innerHTML}
                </div>
              </div>
            </body>
          </html>
        `);
        newWindow.document.close();
      }
    }
  };

  // Function to print report with original CSS
  const handlePrint = () => {
    if (contentRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Report</title>
              ${getStyles()} <!-- Include extracted styles -->
              <script>
                window.onload = function() {
                  window.print();
                  window.onafterprint = function() { window.close(); };
                };
              </script>
            </head>
            <body>
              <div class="${classes.AnalyticsContainer}">
                <div class="${classes.componentContainer}">
                  ${contentRef.current.innerHTML}
                </div>
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  return (
    <div className={classes.AnalyticsContainer}>
      <NavBar setSelectedComponent={setSelectedComponent} buttons={buttons} />

      {/* Reference wrapper for printable content */}
      <div className={classes.componentContainer} ref={contentRef}>
        {renderComponent()}
      </div>

      <div className={classes.rightButtons}>
        <button className={classes.previewButton} onClick={handlePreview}>
          Preview
        </button>
        <button className={classes.generateReportButton} onClick={handlePrint}>
          Generate Report
        </button>
      </div>
    </div>
  );
}

export default Analytics;

