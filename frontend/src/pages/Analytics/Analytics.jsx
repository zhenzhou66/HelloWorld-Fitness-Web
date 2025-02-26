// import React from "react";
// import classes from "./Analytics.module.css";
// import { useState, useRef } from "react";
// import ClassAtd from "./PageClassAtd/ClassAtd";
// import Financial from "./PageFinancial/Financial";
// import GymAtd from "./PageGymAtd/GymAtd";
// import NavBar from "./NavBar/NavBar";

// function Analytics() {
//   const [selectedComponent, setSelectedComponent] = useState("PageOne");
//   const contentRef = useRef(null);

//   const buttons = [
//     { label: "Gym Attendance", component: "PageOne" },
//     { label: "Class Attendance", component: "PageTwo" },
//     { label: "Financial", component: "PageThree" },
//   ];

//   const renderComponent = () => {
//     switch (selectedComponent) {
//       case "PageOne":
//         return <GymAtd />;
//       case "PageTwo":
//         return <ClassAtd />;
//       case "PageThree":
//         return <Financial />;
//       default:
//         return null;
//     }
//   };

//   return (
//     <div className={classes.AnalyticsContainer}>
//       <NavBar setSelectedComponent={setSelectedComponent} buttons={buttons} />
//       <div className={classes.componentContainer}>{renderComponent()}</div>
//       <div className={classes.rightButtons}>
//         <button className={classes.previewButton}>Preview</button>
//         {/* preview button n generate report button */}
//         <button className={classes.generateReportButton}>
//           Print Report
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Analytics;

// import React, { useState, useRef } from "react";
// import classes from "./Analytics.module.css";
// import ClassAtd from "./PageClassAtd/ClassAtd";
// import Financial from "./PageFinancial/Financial";
// import GymAtd from "./PageGymAtd/GymAtd";
// import NavBar from "./NavBar/NavBar";

// function Analytics() {
//   const [selectedComponent, setSelectedComponent] = useState("PageOne");
//   const contentRef = useRef(null); // Reference for printing and previewing

//   const buttons = [
//     { label: "Gym Attendance", component: "PageOne" },
//     { label: "Class Attendance", component: "PageTwo" },
//     { label: "Financial", component: "PageThree" },
//   ];

//   const renderComponent = () => {
//     switch (selectedComponent) {
//       case "PageOne":
//         return <GymAtd />;
//       case "PageTwo":
//         return <ClassAtd />;
//       case "PageThree":
//         return <Financial />;
//       default:
//         return null;
//     }
//   };

//   // Function to extract CSS styles from the current document
//   const getStyles = () => {
//     let styles = "";
//     document.querySelectorAll("link[rel='stylesheet'], style").forEach((style) => {
//       styles += style.outerHTML; // Extract all stylesheet links and inline styles
//     });
//     return styles;
//   };

//   const handlePreview = () => {
//     if (contentRef.current) {
//       const newWindow = window.open("", "_blank");
//       if (newWindow) {
//         newWindow.document.write(`
//           <html>
//             <head>
//               <title>Preview Report</title>
//               ${getStyles()} <!-- Include styles -->
//               <script src="https://cdn.jsdelivr.net/npm/chart.js"></script> <!-- Load Chart.js -->
//             </head>
//             <body>
//               <div id="content">${contentRef.current.innerHTML}</div>
//               <script>
//                 window.onload = function() {
//                   document.querySelectorAll("canvas").forEach((canvas, index) => {
//                     const ctx = canvas.getContext("2d");
//                     new Chart(ctx, {
//                       type: "line",
//                       data: {
//                         labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//                         datasets: [
//                           {
//                             label: "Active Members",
//                             data: [10, 15, 8, 20, 12, 18, 10, 15, 20, 22, 18, 24],
//                             backgroundColor: "rgb(255, 99, 132)",
//                             borderColor: "rgba(255, 99, 132, 0.2)",
//                             fill: false
//                           }
//                         ]
//                       },
//                       options: {
//                         responsive: true,
//                         maintainAspectRatio: false
//                       }
//                     });
//                   });
//                 };
//               </script>
//             </body>
//           </html>
//         `);
//         newWindow.document.close();
//       }
//     }
//   };  

//   const handlePrint = () => {
//     if (contentRef.current) {
//       const printWindow = window.open("", "_blank");
//       if (printWindow) {
//         printWindow.document.write(`
//           <html>
//             <head>
//               <title>Print Report</title>
//               ${getStyles()} <!-- Include styles -->
//               <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
//             </head>
//             <body>
//               <div id="content">${contentRef.current.innerHTML}</div>
//               <script>
//                 window.onload = function() {
//                   document.querySelectorAll("canvas").forEach((canvas, index) => {
//                     const ctx = canvas.getContext("2d");
//                     new Chart(ctx, {
//                       type: "line",
//                       data: {
//                         labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//                         datasets: [
//                           {
//                             label: "Active Members",
//                             data: [10, 15, 8, 20, 12, 18, 10, 15, 20, 22, 18, 24],
//                             backgroundColor: "rgb(255, 99, 132)",
//                             borderColor: "rgba(255, 99, 132, 0.2)",
//                             fill: false
//                           }
//                         ]
//                       },
//                       options: {
//                         responsive: true,
//                         maintainAspectRatio: false
//                       }
//                     });
//                   });
  
//                   setTimeout(() => {
//                     window.print();
//                     window.onafterprint = function() { window.close(); };
//                   }, 1000);
//                 };
//               </script>
//             </body>
//           </html>
//         `);
//         printWindow.document.close();
//       }
//     }
//   };   

//   return (
//     <div className={classes.AnalyticsContainer}>
//       <NavBar setSelectedComponent={setSelectedComponent} buttons={buttons} />

//       {/* Reference wrapper for printable content */}
//       <div className={classes.componentContainer} ref={contentRef}>
//         {renderComponent()}
//       </div>

//       <div className={classes.rightButtons}>
//         <button className={classes.previewButton} onClick={handlePreview}>
//           Preview
//         </button>
//         <button className={classes.generateReportButton} onClick={handlePrint}>
//           Generate Report
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Analytics;

import React, { useState, useRef } from "react";
import classes from "./Analytics.module.css";
import ClassAtd from "./PageClassAtd/ClassAtd";
import Financial from "./PageFinancial/Financial";
import GymAtd from "./PageGymAtd/GymAtd";
import NavBar from "./NavBar/NavBar";

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

