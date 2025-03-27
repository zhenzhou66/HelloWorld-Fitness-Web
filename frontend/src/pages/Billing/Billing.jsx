import React, { useState, useEffect } from "react";
import styles from "./Billing.module.css";
import { Printer, Trash, X } from "lucide-react";
import PrintOverlay from "./PrintOverlay.jsx";

export default function Billing() {
  const [transactions, setTransactions] = useState([]); // Store transaction data
  const [transactionCount, setTransactionCount] = useState(0); // Store total count
  const [statusFilter, setStatusFilter] = useState(""); // Store selected status
  const [selectedTransaction, setSelectedTransaction]=useState(null);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); //show delete overlay
  const [showPrintOverlay, setShowPrintOverlay] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


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
    return date.toLocaleDateString("en-GB", { timeZone: "Asia/Kuala_Lumpur" });
  }

  //Filter Transactions
  const filteredTransactions = transactions.filter(
    (transaction) =>
      statusFilter === "" || transaction.payment_status === statusFilter
  );

  //Delete transaction function
  const [transactionsToDelete, setTransactionsToDelete] = useState([]);
  const handleDeleteClick = (transaction_id = null) => {
      let selectedTransactionIds;
  
      if (transaction_id) {
        selectedTransactionIds = [transaction_id];
      } else {
        selectedTransactionIds = Object.keys(selectedTransactions).filter(id => selectedTransactions[id]);
          
          if (selectedTransactionIds.length === 0) {
              alert("Please select at least one transaction to delete.");
              return;
          }
      }
      setTransactionsToDelete(selectedTransactionIds);
      setShowDeleteConfirm(true);
  };

  const handleDelete = () => {
      fetch(`http://localhost:5000/api/billing/delete`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ transaction_ids: transactionsToDelete }),
      })
      .then(response => response.json())
      .then(data => {
          alert(data.message);
          fetchTransactions(); 
          setSelectedTransactions({});
          setSelectAll(false);
          setShowDeleteConfirm(false);
          setTransactionsToDelete([]);
      })
      .catch(error => {
          console.error("Error deleting transactions:", error);
      });
  };    

  const fetchTransactions = () => {
    fetch("http://localhost:5000/api/billing/display")
      .then((response) => response.json())
      .then((data) => {
        setTransactions(data.transactions);
        setTransactionCount(data.transactionCount);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching stats:", error));
  };

   // For Select All Function
  const [SelectAll, setSelectAll] = useState(false);
  const [selectedTransactions, setSelectedTransactions] = useState({});

  const handleSelectAll = (event) => {
      const isChecked = event.target.checked;
      setSelectAll(isChecked);
  
      const updatedTransaction = {};
      currentTransactions.forEach(transaction => {
        updatedTransaction[transaction.transaction_id] = isChecked;
      });
  
      setSelectedTransactions(updatedTransaction);
  };

  const handleSelectTransactions = (event, transaction_id) => {
      const isChecked = event.target.checked;
  
      setSelectedTransactions((prev) => {
          const updatedTransaction = { ...prev, [transaction_id]: isChecked };
  
          const allSelected = Object.values(updatedTransaction).every((val) => val === true);
          setSelectAll(allSelected);
  
          return updatedTransaction;
      });
  };

  // Bottom Page Function
  const [currentPage, setCurrentPage] = useState(1);
  const transactionPerPage = 9;

  const totalPages = Math.ceil(transactionCount / transactionPerPage);
  const startIndex = (currentPage - 1) * transactionPerPage;
  const endIndex = startIndex + transactionPerPage;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

const handlePrintClick=(transaction)=>{
  setSelectedTransaction(transaction);

  fetch(`http://localhost:5000/api/billing/user-info/${transaction.user_id}`)
  .then((response) => response.json())
  .then((data) => {
    setSelectedTransaction((prev) => ({ ...prev, ...data.record }));
    setShowPrintOverlay(true);
  })
  .catch((error) => console.error("Error fetching stats:", error));
}

  return (
    <div className={styles.billingContent}>
      {/* top row function for table */}
      <div className={styles.billingFunction}>
        <h3>
          All Billing&nbsp;&nbsp;
          <span className={styles.transactionCount}>({transactionCount})</span>
        </h3>

        {/* dropdown sort by */}
        <div className={styles.billingActions}>
          <select
            className={styles.statusFilter}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="" disabled hidden>
              Filter By
            </option>
            <option value="">All</option>
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            <option value="Overdue">Overdue</option>
          </select>
          <button className={styles.deleteTransactionButton} onClick={() => handleDeleteClick(null)}>Delete Selected</button>
        </div>
      </div>

      {/*transaction table */}
      <table className={styles.transactionTable}>
        <thead>
          <tr>
            <th className={styles.checkboxuserid}>
              <div className={styles.checkboxContainer}>
                <input type="checkbox" checked={SelectAll} onChange={handleSelectAll} />
                <span>Transaction ID</span>
              </div>
            </th>
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
                  <input type="checkbox" checked={selectedTransactions[transaction.transaction_id] || false} onChange={(e) => handleSelectTransactions(e, transaction.transaction_id)} />
                  <span>{transaction.transaction_id}</span>
                </div>
              </td>

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
                <button className={styles.printButton} onClick={() => handlePrintClick(transaction)}>
                  <Printer size={20} />
                </button>
                <button
                  className={styles.trashButton}
                  onClick={() => handleDeleteClick(transaction.transaction_id)}
                >
                  <Trash size={20} />
                </button>

                {
                  showPrintOverlay && selectedTransaction && (
                    <PrintOverlay
                      show={showPrintOverlay}
                      onClose={() => { setShowPrintOverlay(false) }}
                      transactionData={selectedTransaction}
                    />
                  )
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* For Admin to Delete Transaction(Overlay) */}
      {showDeleteConfirm && (
          <div className={styles.modalOverlayDeleteM}>
              <div className={styles.modalDeleteM} style={{ textAlign: "center" }}>
                  <button className={styles.closeButton} onClick={() => setShowDeleteConfirm(false)}>
                  <X size={24} />
                  </button>
                  <Trash className={styles.deleteIcon} size={40}/>
                  <p style={{ marginBottom: "30px" }}>Are you sure you want to delete this transaction?</p>
                  <div className={styles.modalButtons}>
                      <button className={styles.cancelDeleteButton} onClick={() => setShowDeleteConfirm(false)}>
                          No, cancel
                      </button>
                      <button className={styles.confirmDeleteButton} onClick={handleDelete}>
                          Yes, I'm sure
                      </button>
                  </div>
              </div>
          </div>
      )}

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
