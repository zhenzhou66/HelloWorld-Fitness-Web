import React from "react";
import "./Invoice.module.css";

function Receipt() {
    return (
        <div className="receipt-container">
            <h2 className="receipt-title">Receipt</h2>
            <div className="receipt-header">
                <div className="user-info">
                    <p>User: UID:001</p>
                </div>
                <div className="date-info">
                    <p>Date: 3/2/2025</p>
                </div>
            </div>
            <hr className="dotted-line" />
            <div className="membership-info">
                <p className="membership-plan-title">Membership Plan:</p>
                <p className="membership-plan">Standard Monthly Membership (January 2025)</p>
                <p className="price">30.00</p>
            </div>
            <hr className="dotted-line" />
            <div className="total-section">
                <div className="total-item">
                    <span className="label">Total</span>
                    <span className="amount">30.00</span>
                </div>
                <div className="total-item">
                    <span className="label">Promotion</span>
                    <span className="amount">0.00</span>
                </div>
                <div className="total-item">
                    <span className="label">Subtotal</span>
                    <span className="amount">30.00</span>
                </div>
            </div>
            <hr className="dotted-line" />
            <div className="thank-you">
                <p>THANK YOU</p>
            </div>
        </div>
    );
}

export default Receipt;
