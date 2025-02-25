const express = require('express');
const router = express.Router();
const db = require('../db');

// Endpoint to fetch billing details and transaction count separately
router.get('/display', (req, res) => {
    const transactionQuery = 'SELECT * FROM transactions ORDER BY payment_date DESC';
    const countQuery = 'SELECT COUNT(*) AS total_count FROM transactions';

    db.query(transactionQuery, (err, transactions) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while fetching transactions.' });
        }

        // Run the count query separately
        db.query(countQuery, (err, countResult) => {
            if (err) {
                return res.status(500).json({ message: 'Database error while fetching transaction count.' });
            }

            const transactionCount = countResult[0].total_count; 

            return res.json({
                transactions: transactions,  
                transactionCount: transactionCount     
            });
        });
    });
});

router.delete('/delete', async (req, res) => {
    try {
        let { transaction_ids } = req.body;

        if (!transaction_ids || transaction_ids.length === 0) {
            return res.status(400).json({ message: "No transaction selected for deletion." });
        }

        if (!Array.isArray(transaction_ids)) {
            transaction_ids = [transaction_ids]; // Convert single ID to an array
        }

        const deleteQuery = `
            DELETE FROM transactions
            WHERE transaction_id IN (${transaction_ids.map(() => '?').join(',')})
        `;

        const [result] = await db.promise().query(deleteQuery, transaction_ids);

        if (result.affectedRows > 0) {
            return res.status(200).json({ message: 'Transaction(s) deleted successfully!' });
        } else {
            return res.status(404).json({ message: 'No transaction found to delete.' });
        }
    } catch (error) {
        console.error("Error deleting transactions:", error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
