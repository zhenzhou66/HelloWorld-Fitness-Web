import styles from "./Invoice.module.css";
import logo from "../../assets/logo-black.png";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react"

function Invoice({ transactionData }) {

    // Formatting date function
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-GB", { timeZone: "Asia/Kuala_Lumpur" });
    }

    return (
        <div className={styles.receiptContainer}>

            <h1 className={styles.receiptTitle}>Invoice</h1>

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
            

            <div className={styles.billContainer}>
                <div className={styles.billSection}>
                    <div className={styles.billTo}>
                        <p className={styles.billToTitle}>Bill To</p>

                        <div className={styles.userProfile}>
                            <img src={transactionData.profile_picture ? `http://localhost:5000/uploads/${transactionData.profile_picture}` :
                 `http://localhost:5000/uploads/default.jpg`} alt="Profile" className={styles.mprofilePicture} />
                            <div className={styles.mprofileDetails}>
                                <span className={styles.mprofileName}>{transactionData.name}</span>
                                <span className={styles.mprofileEmail}>{transactionData.email}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.invoiceDetail}>
                        <p>Invoice Detail</p>
                        <p className={styles.dueDate}>
                            Due Date: <span className={styles.dueDateData}>{formatDate(transactionData.end_date)}</span>
                        </p>
                    </div>
                </div>

            </div>

            


            {/* Product Table */}
            <div className={styles.productRow}>
                <div className={styles.productInfo}>
                    <p className={styles.productTitle}>Product</p>
                </div>
                <div className={styles.qtyInfo}>
                    <p className={styles.productTitle}>QTY</p>
                </div>
                <div className={styles.amountInfo}>
                    <p className={styles.productTitle}>Amount</p>
                </div>
            </div>

            <hr className={styles.dottedLine} />

            <div className={styles.productRowData}>
                <div className={styles.productInfo}>
                    <p className={styles.productName}>{transactionData.description}</p>
                </div>
                <div className={styles.qtyInfo}>
                    <p className={styles.quantity}>1</p>
                </div>
                <div className={styles.amountInfo}>
                    <p className={styles.amount}>
                        {transactionData.amount}
                    </p>
                </div>
            </div>


            <hr className={styles.dottedLine} />

            <div className={styles.totalSectionFlex}>
                <div className={styles.totalSection}>
                    <div className={styles.totalItem}>
                        <span className={styles.labelTotal}>Amount To Pay</span>
                        <span className={styles.amount}>{transactionData.amount}</span>
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

            </div>
            <hr className={styles.dottedLineLast} />







        </div>
    );
}

Invoice.propTypes = {
    transactionData: PropTypes.object.isRequired,
};

export default Invoice;
