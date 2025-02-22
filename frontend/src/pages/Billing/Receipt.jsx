import React from "react";
import styles from "./Receipt.module.css";

function Receipt() {
    return (
        <div className={styles.receiptContainer}>
            <h2 className={styles.receiptTitle}>Receipt</h2>

            <div className={styles.receiptHeader}>
                <div className={styles.userInfo}>
                    <p>User: UID:001</p>
                </div>
                <div className={styles.dateInfo}>
                    <p>Date: 3/2/2025</p>
                </div>
            </div>

            <hr className={styles.dottedLine} />

            <div className={styles.membershipInfo}>
                <p className={styles.membershipPlanTitle}>Membership Plan:</p>
                <p className={styles.membershipPlan}>
                    Standard Monthly Membership (January 2025)
                </p>
                <p className={styles.price}>30.00</p>
            </div>

            <hr className={styles.dottedLine} />

            <div className={styles.totalSection}>
                <div className={styles.totalItem}>
                    <span className={styles.label}>Total</span>
                    <span className={styles.amount}>30.00</span>
                </div>
                <div className={styles.totalItem}>
                    <span className={styles.label}>Promotion</span>
                    <span className={styles.amount}>0.00</span>
                </div>
                <div className={styles.totalItem}>
                    <span className={styles.label}>Subtotal</span>
                    <span className={styles.amount}>30.00</span>
                </div>
            </div>

            <hr className={styles.dottedLine} />

            <div className={styles.thankYou}>
                <p>THANK YOU</p>
            </div>
        </div>
    );
}
export default Receipt;
