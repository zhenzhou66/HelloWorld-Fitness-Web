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
                announcementDetails: detailResult || [],
                announcementCount: countResult[0].notificationCount || 0
            });
        });
    });
});

router.delete('/delete', async (req, res) => {
    let { notification_ids } = req.body;

    if (!notification_ids) {
        return res.status(400).json({ message: "No announcement selected for deletion." });
    }

    if (!Array.isArray(notification_ids)) {
        notification_ids = [notification_ids];
    }

    try {
        // Delete announcement from the database
        const deleteQuery = `
            DELETE FROM notifications
            WHERE notification_id IN (${notification_ids.map(() => '?').join(',')})
        `;

        const [result] = await db.promise().query(deleteQuery, notification_ids);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Announcement successfully deleted!' });
        } else {
            res.status(404).json({ message: 'No announcement found to delete.' });
        }

    } catch (err) {
        console.error('Error deleting announcements:', err);
        res.status(500).json({ message: 'Internal server error.', error: err });
    }
});

module.exports = router;