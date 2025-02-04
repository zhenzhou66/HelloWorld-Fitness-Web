const express = require('express');
const router = express.Router();
const db = require('../db');

// Endpoint to fetch dashboard statistics
router.get('/stats', (req, res) => {
    const currentYear = new Date().getFullYear();
    const revenueQuery = 'SELECT SUM(amount) AS totalRevenue FROM transactions WHERE YEAR(payment_date) = ?';
    const membersQuery = 'SELECT COUNT(*) AS activeMembers FROM user_membership WHERE status = "Active"';
    const trainersQuery = 'SELECT COUNT(*) AS totalTrainers FROM user WHERE role = "trainer"';

    db.query(revenueQuery, [currentYear], (err, revenueResult) => {
        if (err) return res.status(500).json({ message: 'Database error in revenue query.' });
        
        db.query(membersQuery, (err, membersResult) => {
            if (err) return res.status(500).json({ message: 'Database error in members query.' });
            
            db.query(trainersQuery, (err, trainersResult) => {
                if (err) return res.status(500).json({ message: 'Database error in trainers query.' });
                
                res.status(200).json({
                    totalRevenue: revenueResult[0].totalRevenue || 0,
                    activeMembers: membersResult[0].activeMembers || 0,
                    totalTrainers: trainersResult[0].totalTrainers || 0
                });
            });
        });
    });
});

router.get("/active-members/:year", (req, res) => {
    const year = req.params.year;
    const query = `
        SELECT 
            MONTH(start_date) AS month, 
            COUNT(*) AS totalMembers 
        FROM user_membership 
        WHERE YEAR(start_date) = ? 
        GROUP BY MONTH(start_date) 
        ORDER BY month;
    `;

    db.query(query, [year], (err, results) => {
        if (err) return res.status(500).json({ message: "Database error.", error: err });

        const data = Array.from({ length: 12 }, (_, i) => ({
            label: new Date(0, i).toLocaleString("en", { month: "long" }), // Converts month number to name
            Amount: 0, // Default to zero in case some months have no data
        }));

        results.forEach((row) => {
            data[row.month - 1].Amount = row.totalMembers;
        });

        res.status(200).json(data);
    });
});

module.exports = router;
