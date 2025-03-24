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
            label: new Date(0, i).toLocaleString("en", { month: "long" }), 
            Amount: 0, 
        }));

        results.forEach((row) => {
            data[row.month - 1].Amount = row.totalMembers;
        });

        res.status(200).json(data);
    });
});

router.get("/getAttendanceCode", (req, res) => {
    const query = `SELECT code FROM attendance_code 
                   WHERE class_id IS NULL AND available_from < NOW() AND available_until > NOW()`;

    db.query(query, (error, results) => {
        if (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "No active attendance code" });
        }
        res.json({ success: true, code: results[0].code });
    });
});

router.post("/generateAttendanceCode", async (req, res) => {
    function generateRandomCode() {
        return String(Math.floor(Math.random() * 1000)).padStart(3, "0");
    }

    async function insertAttendanceCode() {

        const code = generateRandomCode();
        const checkQuery = `SELECT * FROM attendance_code WHERE code = ? AND available_from < NOW() AND available_until > NOW()`;
        const insertQuery = `INSERT INTO attendance_code (code, available_from, available_until) 
                             VALUES (?, NOW(), TIMESTAMP(DATE(NOW()), '23:59:59'))`;

        try {
            const [existing] = await db.promise().query(checkQuery, [code]);

            if (existing.length > 0) {
                return insertAttendanceCode(); 
            }

            // Insert new unique code
            await db.promise().query(insertQuery, [code]);
            res.json({ success: true, code });

        } catch (error) {
            return res.status(500).json({ error: "Database query failed" });
        }
    }

    insertAttendanceCode();
});

module.exports = router;
