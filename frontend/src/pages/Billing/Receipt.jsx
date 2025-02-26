import React from "react";
import styles from "./Receipt.module.css";
import logo from "../../assets/logo-black.png";
import PropTypes from "prop-types";


function Receipt({transactionData}) {

    // Formatting date function
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", { timeZone: "Asia/Kuala_Lumpur" });
    }

    return (
        <div className={styles.receiptContainer}>
            
            <h1 className={styles.receiptTitle}>Receipt</h1>

            <div className={styles.logoContainer}>
                <img src={logo} alt="logo" className={styles.logo} />
            </div>

            <div className={styles.receiptHeader}>
                <div className={styles.userInfo}>
                    <p>User ID: <span className={styles.headerData}>{transactionData.user_id}</span> </p>
                </div>
                <div className={styles.dateInfo}>
                    <p>Date: <span className={styles.headerData}>{formatDate(transactionData.payment_date)}</span> </p>
                </div>
            </div>

            <hr className={styles.dottedLine} />

            <div className={styles.membershipInfo}>
                <div className={styles.leftContainer}>
                    <p className={styles.membershipPlanTitle}>Membership Plan:</p>
                    <p className={styles.membershipPlan}>
                        {transactionData.description}
                    </p>
                </div>   
                <p className={styles.price}>{transactionData.amount}</p>
            </div>

            <hr className={styles.dottedLine} />

            <div className={styles.totalSection}>
                <div className={styles.totalItem}>
                    <span className={styles.labelTotal}>Total</span>
                    <span className={styles.amountTotal}>{transactionData.amount}</span>
                </div>
                <div className={styles.totalItem}>
                    <span className={styles.label}>Promotion</span>
                    <span className={styles.amount}>0.00</span>
                </div>
                <div className={styles.totalItem}>
                    <span className={styles.label}>Subtotal</span>
                    <span className={styles.amount}>{transactionData.amount}</span>
                </div>
            </div>

            <hr className={styles.dottedLine} />

            <div className={styles.thankYou}>
                <p>THANK YOU</p>
            </div>
        </div>
    );
}
Receipt.propTypes = {
    transactionData: PropTypes.object.isRequired,
};

export default Receipt;
