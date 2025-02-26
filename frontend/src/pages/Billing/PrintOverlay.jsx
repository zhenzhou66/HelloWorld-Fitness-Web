import React, { useState, useRef } from "react";
import styles from "./PrintOverlay.module.css";
import NavBar from "../Analytics/NavBar/NavBar";
import Receipt from "./Receipt";
import PropTypes from "prop-types";
import Invoice from "./Invoice";

function PrintOverlay({ show, onClose, transactionData }) {
    const [selectedComponent, setSelectedComponent] = useState("Invoice");
    const printRef = useRef(null); 

    const navBarButtons = [
        { label: "Invoice", component: "Invoice" },
        { label: "Receipt", component: "Receipt" }
    ];

    const renderComponent = () => {
        switch (selectedComponent) {
            case "Invoice":
                return <Invoice transactionData={transactionData} ref={printRef} />;
            case "Receipt":
                return <Receipt transactionData={transactionData} ref={printRef} />;
            default:
                return null;
        }
    };

    // Print Function
    const handlePrint = () => {
        if (printRef.current) {
            const printContent = printRef.current.innerHTML;
            const originalContent = document.body.innerHTML;

            document.body.innerHTML = printContent; 
            window.print(); 
            document.body.innerHTML = originalContent; 
            window.location.reload(); 
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>Invoice & receipt for Transaction ID:&nbsp;
                        <span className={styles.headerId}>{transactionData.transaction_id}</span>
                    </h3>
                </div>
                <button className={styles.closeButton} onClick={onClose}>X</button>
                <div className={styles.navBarSection}>
                    <NavBar setSelectedComponent={setSelectedComponent} buttons={navBarButtons} />
                </div>

                {/* Receipt or invoice based on active tab */}
                <div className={styles.content} ref={printRef}>{renderComponent()}</div>

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
