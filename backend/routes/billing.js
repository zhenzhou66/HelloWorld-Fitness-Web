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

router.get('/user-info/:user_id', async (req, res) => {
    const { user_id } = req.params; 

    if (!user_id) { // Fixing the incorrect variable reference
        return res.status(400).json({ message: 'Missing user ID' });
    }

    const userQuery = `
        SELECT u.name, u.email, um.end_date, u.profile_picture FROM user u 
        INNER JOIN user_membership um ON u.user_id = um.user_id 
        WHERE u.user_id = ?
    `;

    db.query(userQuery, [user_id], (err, records) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while fetching user info.', error: err });
        }

        if (records.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.json({ record: records[0] }); 
    });
});

module.exports = router;
