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

router.get('/displayTrainerRating', (req, res) => {
    const trainerFeedbackQuery = `SELECT 
                                    u.*, 
                                    COUNT(f.feedback_id) AS ratingAmount, 
                                    IFNULL(AVG(f.trainer_rating), 0) AS avgRating  
                                FROM user u
                                LEFT JOIN feedback f ON u.user_id = f.trainer_id  
                                WHERE u.role = "trainer"
                                GROUP BY u.user_id
                                ORDER BY avgRating DESC`;

    db.query(trainerFeedbackQuery, (err, trainerFeedback) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while fetching trainer feedback.' });
        }

        res.json({ trainerFeedback });
    });
});

router.get('/trainerFeedbackDetails/:user_id', (req, res) => {
    const { user_id } = req.params; 
    const trainerRatingQuery = `SELECT trainer_rating AS stars, COUNT(trainer_rating) AS count 
                                FROM feedback 
                                WHERE trainer_id = ?
                                GROUP BY trainer_rating
                                ORDER BY trainer_rating DESC`;
    const feedbackDetailQuery = "SELECT * FROM feedback f INNER JOIN user u ON f.member_id = u.user_id WHERE f.trainer_id = ?";
    const defaultStars = [1, 2, 3, 4, 5];

    db.query(trainerRatingQuery, [user_id], (err, trainerRating) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while fetching trainer rating.' });
        }
        
        // Convert query results into a map { stars: count }
        const ratingMap = new Map(trainerRating.map(({ stars, count }) => [stars, count]));

        // Ensure all stars are present, default missing ones to 0
        const ratingBreakdown = defaultStars.map((star) => ({
            stars: star,
            count: ratingMap.get(star) || 0,
        }));
        console.log("ratingBreakdown:", ratingBreakdown);

        db.query(feedbackDetailQuery, [user_id], (err, feedbackDetail) => {
            if (err) {
                return res.status(500).json({ message: 'Database error while fetching trainer feedback detail.' });
            }

            res.status(200).json({
                ratingBreakdown: ratingBreakdown || [],
                feedbackDetail: feedbackDetail || [],
            });
        });
    });
});


module.exports = router;