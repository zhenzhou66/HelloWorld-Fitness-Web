import React, { useState, useEffect } from "react";
import styles from "./PrintOverlay.module.css";

function PrintOverlay(){

    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          {/* Close button */}
          <button className={styles.closeButton} onClick={()=>{}}>
            X
          </button>

          {/* Navbar for toggling between Invoice and Receipt */}
          {/* <nav className={styles.navbar}>
            <button
              className={`${styles.navButton} ${
                activeTab === "invoice" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("invoice")}
            >
              Invoice
            </button>
            <button
              className={`${styles.navButton} ${
                activeTab === "receipt" ? styles.active : ""
              }`}
              onClick={() => setActiveTab("receipt")}
            >
              Receipt
            </button>
          </nav> */}

          {/* Content based on active tab */}
          <div className={styles.content}>{renderContent()}</div>

          {/* Print button */}
          <div className={styles.buttonContainer}>
            <button
              className={styles.printButton}
              onClick={() => onPrint(activeTab)}
            >
              Print {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </button>
          </div>
        </div>
      </div>
    );
}



export default PrintOverlay;