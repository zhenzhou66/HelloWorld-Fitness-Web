import React, { useState, useEffect } from "react";
import styles from "./PrintOverlay.module.css";
import NavBar from "../Analytics/NavBar/NavBar";
import Receipt from "./Receipt";
import PropTypes from "prop-types";

function PrintOverlay(
    {
        show,
        onClose,
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
                return <Receipt />;
            case "Receipt":
                return <Receipt />;
            default:
                return null;
        }
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                {/* Close button */}
                <button className={styles.closeButton} onClick={onClose}>
                    X
                </button>
                <div className={styles.navBarSection}>
                    <NavBar setSelectedComponent={setSelectedComponent} buttons={navBarButtons}/>
                </div>

                {/* Receipt or invoice based on active tab */}
                <div className={styles.content}>{renderComponent()}</div>


            </div>
        </div>
    );
}



export default PrintOverlay;

PrintOverlay.propTypes = {
    show: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};