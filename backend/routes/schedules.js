const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/display', (req, res) => {
    const classDetails = 'SELECT c.*, t.name, t.profile_picture FROM classes c INNER JOIN user t ON c.trainer_id = t.user_id';
    const classCount = 'SELECT COUNT(*) AS classCount FROM classes';

    db.query(classDetails, (err, detailResult) => {
        if (err) return res.status(500).json({ message: 'Database error in fetching class query.' });
        
        db.query(classCount, (err, countResult) => {
            if (err) return res.status(500).json({ message: 'Database error in counting class query.' });
            
            res.status(200).json({
                classDetails: detailResult || [],
                classCount: countResult[0].classCount || 0
            });
        });
    });
});

router.get('/participants/:class_id', (req, res) => {
    const { class_id } = req.params;
    const getParticipantsQuery = "SELECT c.*, u.name, u.profile_picture FROM class_participants c INNER JOIN user u ON c.user_id = u.user_id WHERE c.class_id = ?";

    db.query(getParticipantsQuery, [class_id], (err, participantResult) => {
        if (err) return res.status(500).json({ message: 'Database error in fetching participants query.' });

        return res.status(200).json({ participants: participantResult });
    });
});

module.exports = router;
