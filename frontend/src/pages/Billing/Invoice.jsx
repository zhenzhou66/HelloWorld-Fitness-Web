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
      
    const [userInfo, setUserInfo]=useState(null);

    // Fetch user data from backend
    useEffect(() => {
        fetch(`http://localhost:5000/api/billing/user-info?transaction_id=${transactionData.transaction_id}`)
        .then((response) => {
            if (!response.ok) throw new Error("Failed to fetch data");
            return response.json();
        })
        .then((data) => {
            setUserInfo(data.record);
            console.log(userInfo);
        })
        .catch((error) => {
            setError(error.message);
        });
    }, [transactionData.transaction_id]);

    return (
        <div className={styles.receiptContainer}>

            <h1 className={styles.receiptTitle}>Invoice</h1>

            <div className={styles.logoContainer}>
                <img src={logo} alt="logo" className={styles.logo} />
            </div>

            <div className={styles.receiptHeader}>
                <div className={styles.userInfo}>
                    <p>User ID: <span className={styles.headerData}>{userInfo.user_id}</span> </p>
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
                            <img src={logo} alt="Profile" className={styles.mprofilePicture} />
                            <div className={styles.mprofileDetails}>
                                <span className={styles.mprofileName}>EmilyLai</span>
                                <span className={styles.mprofileEmail}>emily.lai@gmail.com</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.invoiceDetail}>
                        <p>Invoice Detail</p>
                        <p className={styles.dueDate}>
                            Due Date: <span className={styles.dueDateData}>15/2/2025</span>
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
