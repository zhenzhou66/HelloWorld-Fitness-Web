// import React, { useState, useEffect } from "react";
// import styles from "./PrintOverlay.module.css";
// import NavBar from "../Analytics/NavBar/NavBar";
// import Receipt from "./Receipt";
// import PropTypes from "prop-types";
// import Invoice from "./Invoice";

// function PrintOverlay(
//     {
//         show,
//         onClose,
//         transactionData,
//     }
// ) {
//     const [selectedComponent, setSelectedComponent] = useState("Invoice");
//     const navBarButtons = [
//         {
//             label: "Invoice", component: "Invoice"
//         },
//         {
//             label: "Receipt", component: "Receipt"
//         }

//     ]

//     const renderComponent = () => {
//         switch (selectedComponent) {
//             case "Invoice":
//                 return <Invoice transactionData={transactionData}/>;
//             case "Receipt":
//                 return <Receipt transactionData={transactionData} />;
//             default:
//                 return null;
//         }
//     };

//     return (
//         <div className={styles.overlay}>
            
//             <div className={styles.modal}>
//                 <div className={styles.header}>
//                     <h3>Invoice & receipt for Transaction ID:&nbsp;
//                         <span className={styles.headerId}>{transactionData.transaction_id}</span>
//                         </h3>
//                 </div>
//                 <button className={styles.closeButton} onClick={onClose}>
//                     X
//                 </button>
//                 <div className={styles.navBarSection}>
//                     <NavBar setSelectedComponent={setSelectedComponent} buttons={navBarButtons}/>
//                 </div>

//                 {/* Receipt or invoice based on active tab */}
//                 <div className={styles.content}>{renderComponent()}</div>

//                 <div className={styles.buttonContainer}>
//                     <button className={styles.sendButton} onClick={onClose}>Back</button>
//                     <button className={styles.printButton} onClick={() => { }}>Print</button>
//                 </div>


//             </div>
//         </div>
//     );
// }


// PrintOverlay.propTypes = {
//     show: PropTypes.bool.isRequired,
//     onClose: PropTypes.func.isRequired,
//     transactionData:PropTypes.object.isRequired,
// };

// export default PrintOverlay;


import React, { useState, useEffect } from "react";
import styles from "./PrintOverlay.module.css";
import NavBar from "../Analytics/NavBar/NavBar";
import Receipt from "./Receipt";
import Invoice from "./Invoice";
import PropTypes from "prop-types";

function PrintOverlay({ show, onClose, transactionData }) {
    const [selectedComponent, setSelectedComponent] = useState("Invoice");
    const [isPrinting, setIsPrinting] = useState(false);

    useEffect(() => {
        if (isPrinting) {
            setTimeout(() => {
                const printContent = document.getElementById("printable-content");
                if (!printContent) return;

                const newWindow = window.open("", "_blank");

                const stylesheets = [...document.styleSheets].map((styleSheet) => {
                    try {
                        return styleSheet.cssRules
                            ? [...styleSheet.cssRules].map((rule) => rule.cssText).join("\n")
                            : "";
                    } catch (e) {
                        return "";
                    }
                }).join("\n");

                newWindow.document.write(`
                    <html>
                        <head>
                            <title>Print Invoice/Receipt</title>
                            <style>${stylesheets}</style>
                        </head>
                        <body>
                            ${printContent.innerHTML}
                        </body>
                    </html>
                `);

                newWindow.document.close();
                newWindow.print();

                setIsPrinting(false); // Reset printing state
            }, 100); // Short delay ensures correct rendering
        }
    }, [isPrinting]); // Runs when isPrinting changes

    const handlePrint = () => {
        setIsPrinting(true); // This triggers the effect
    };

    const navBarButtons = [
        { label: "Invoice", component: "Invoice" },
        { label: "Receipt", component: "Receipt" }
    ];

    const renderComponent = () => {
        return selectedComponent === "Invoice" ? (
            <Invoice transactionData={transactionData} />
        ) : (
            <Receipt transactionData={transactionData} />
        );
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>
                        Invoice & Receipt for Transaction ID:&nbsp;
                        <span className={styles.headerId}>{transactionData.transaction_id}</span>
                    </h3>
                </div>
                <button className={styles.closeButton} onClick={onClose}>X</button>

                <div className={styles.navBarSection}>
                    <NavBar setSelectedComponent={setSelectedComponent} buttons={navBarButtons} />
                </div>

                {/* Receipt or Invoice based on active tab */}
                <div id="printable-content" className={styles.content}>{renderComponent()}</div>

                <div className={styles.buttonContainer}>
                    <button className={styles.sendButton} onClick={onClose}>Back</button>
                    <button className={styles.printButton} onClick={handlePrint}>Print</button>
                </div>
            </div>
        </div>
    );
}

PrintOverlay.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    transactionData: PropTypes.object.isRequired,
};

export default PrintOverlay;
