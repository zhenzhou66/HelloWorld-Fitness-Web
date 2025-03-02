const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/displayLatestFeedback', (req, res) => {
    const feedbackQuery = `SELECT *, member.name AS memberName, trainer.name AS trainerName
                            FROM feedback f
                            INNER JOIN classes c ON f.class_id = c.class_id
                            INNER JOIN user trainer ON f.trainer_id = trainer.user_id
                            INNER JOIN user member ON f.member_id = member.user_id
                            ORDER BY f.feedback_date DESC
                            LIMIT 3;
                            `;

    db.query(feedbackQuery, (err, feedback) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while fetching feedback.' });
        }

        res.json({ feedback });
    });
});


module.exports = router;