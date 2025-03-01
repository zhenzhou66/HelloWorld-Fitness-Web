const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/display', (req, res) => {
    const notificationDetails = 'SELECT * FROM notifications';
    const notificationCount = 'SELECT COUNT(*) AS notificationCount FROM notifications';

    db.query(notificationDetails, (err, detailResult) => {
        if (err) return res.status(500).json({ message: 'Database error in fetching user details.' });
        
        db.query(notificationCount, (err, countResult) => {
            if (err) return res.status(500).json({ message: 'Database error in members query.' });
            
            res.status(200).json({
                notificationDetails: detailResult || [],
                notificationCount: countResult[0].notificationCount || 0
            });
        });
    });
});

module.exports = router;