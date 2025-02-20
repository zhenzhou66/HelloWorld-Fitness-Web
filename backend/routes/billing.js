const express = require('express');
const router = express.Router();
const db = require('../db');

// Endpoint to fetch billing details and transaction count separately
router.get('/display', (req, res) => {
    const transactionQuery = 'SELECT * FROM transactions';
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

            const transactionCount = countResult[0].total_count; // Extract the count value

            return res.json({
                transactions: transactions,  // Full list of transactions
                transactionCount: transactionCount     // Total transaction count
            });
        });
    });
});

module.exports = router;
