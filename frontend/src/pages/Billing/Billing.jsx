import React, { useState, useEffect } from "react";
import styles from "./Billing.module.css";
import { Printer, Trash, X } from "lucide-react";
import ConfirmModal from "../../components/ConfirmDelete/ConfirmDelete.jsx";


export default function Billing() {
  const [transactions, setTransactions] = useState([]); // Store transaction data
  const [transactionCount, setTransactionCount] = useState(0); // Store total count
  const [statusFilter, setStatusFilter] = useState(""); // Store selected status
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); //show delete overlay

  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch billing data from backend
  useEffect(() => {
    fetch("http://localhost:5000/api/billing/display") 
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((data) => {
        setTransactions(data.transactions); // Store data in state
        setTransactionCount(data.transactionCount); 
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  // Formatting date function
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { timeZone: 'Asia/Kuala_Lumpur' }); 
}

//Filter Transactions
const filteredTransactions = transactions.filter(transaction => 
  statusFilter === "" || transaction.payment_status === statusFilter
);


// Bottom Page Function
    const [currentPage, setCurrentPage] = useState(1);
    const transactionPerPage = 9;

    const totalPages = Math.ceil(transactionCount / transactionPerPage);
    const startIndex = (currentPage - 1) * transactionPerPage;
    const endIndex = startIndex + transactionPerPage;
    const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    }


  return (
    <div className={styles.billingContent}>

      {/* top row function for table */}
      <div className={styles.billingFunction}>

          <h3>All Billing&nbsp;&nbsp;
              <span className={styles.transactionCount}>({transactionCount})</span>
          </h3>
          {/* small function */}
          <div className={styles.billingActions}>
          <select 
            className={styles.statusFilter} 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
            
          </div>
      </div>

        {/*transaction table */}
        <table className={styles.transactionTable}>
          <thead>
            <tr>
              <th className={styles.checkboxuserid}>
                  <div className={styles.checkboxContainer}>
                      <input type="checkbox" checked={false} onChange={()=>{}} />
                  </div>
              </th>
              <th>Transaction ID</th>
              <th>User ID</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
              
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr key={transaction.transaction_id}>
                <td className={styles.checkboxuserid}>
                    <div className={styles.checkboxContainer}>
                        <input type="checkbox" checked={false} onChange={()=>{}}/>
                    </div>
                </td>
                <td>{transaction.transaction_id}</td>
                <td>{transaction.user_id}</td>
                <td>{transaction.description}</td>
                <td>${transaction.amount}</td>
                <td>{formatDate(transaction.payment_date) || "—"}</td>
                <td
                  className={
                    transaction.payment_status === "Paid"
                      ? styles.paid
                      : transaction.payment_status === "Overdue"
                      ? styles.overdue
                      : styles.pending
                  }
                >
                  {transaction.payment_status}
                </td>
                <td>
                    <button className={styles.printButton} onClick={() => {}}>
                        <Printer size={20} />
                    </button>
                    <button className={styles.trashButton} onClick={() => setShowDeleteConfirm(true)}>
                        <Trash size={20} />
                    </button>

{/* using confirmDelete component for overlay */}
                    {showDeleteConfirm && <ConfirmModal
                      show={showDeleteConfirm}
                      onClose={() => setShowDeleteConfirm(false)}
                      onConfirm={()=>{}} //handle delete backend logic
                      message="Are you sure you want to delete this transaction?"
                      confirmText="Yes, I'm sure"
                      cancelText="No, cancel"
                    />
                    }
                    
                </td>
    
              </tr>
            ))}
          </tbody>
        </table>

        {/* pages under table */}

        <div className={styles.pagination}>
            {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1} 
                  className={currentPage === index + 1 ? styles.active : ""}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
            ))}
        </div>


    </div>
  );
}

