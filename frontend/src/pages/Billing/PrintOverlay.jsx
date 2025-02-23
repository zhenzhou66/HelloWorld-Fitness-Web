import React, { useState, useEffect } from "react";
import styles from "./PrintOverlay.module.css";
import NavBar from "../Analytics/NavBar/NavBar";
import Receipt from "./Receipt";
import PropTypes from "prop-types";
import Invoice from "./Invoice";

function PrintOverlay(
    {
        show,
        onClose,
        transactionData,
    }
) {
    const [selectedComponent, setSelectedComponent] = useState("Invoice");
    const navBarButtons = [
        {
            label: "Invoice", component: "Invoice"
        },
        {
            label: "Receipt", component: "Receipt"
        }

    ]

    const renderComponent = () => {
        switch (selectedComponent) {
            case "Invoice":
                return <Invoice transactionData={transactionData}/>;
            case "Receipt":
                return <Receipt transactionData={transactionData} />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.overlay}>
            
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h3>Invoice & receipt for Transaction ID: 
                        <span className={styles.headerId}>{transactionData.transaction_id}</span>
                        </h3>
                </div>
                <button className={styles.closeButton} onClick={onClose}>
                    X
                </button>
                <div className={styles.navBarSection}>
                    <NavBar setSelectedComponent={setSelectedComponent} buttons={navBarButtons}/>
                </div>

                {/* Receipt or invoice based on active tab */}
                <div className={styles.content}>{renderComponent()}</div>

                <div className={styles.buttonContainer}>
                    <button>Print</button>
                    <button>Send</button>
                </div>


            </div>
        </div>
    );
}


PrintOverlay.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    transactionData:PropTypes.object.isRequired,
};

export default PrintOverlay;
