const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/display', (req, res) => {
    const membersDetails = 'SELECT * FROM user WHERE role = ?';
    const membersCount = 'SELECT COUNT(*) AS membersCount FROM user WHERE role = ?';

    db.query(membersDetails, ["member"], (err, detailResult) => {
        if (err) return res.status(500).json({ message: 'Database error in fetching user details.' });
        
        db.query(membersCount, ["member"], (err, countResult) => {
            if (err) return res.status(500).json({ message: 'Database error in members query.' });
            
            res.status(200).json({
                membersDetails: detailResult || [],
                membersCount: countResult[0].membersCount || 0
            });
        });
    });
});

router.get('/membership-plans', (req, res) => {
    const query = 'SELECT membership_id, plan_name FROM membership';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while fetching membership plans.' });
        }
        res.json(results);
    });
});

router.get('/membership-info/:user_id', (req, res) => {
    const { user_id } = req.params; 
    const query = 'SELECT * FROM user_membership WHERE user_id = ?';
    db.query(query, [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while fetching membership plans.' });
        }
        res.json(results);
    });
});

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/profile_pictures', 
    filename: (req, file, cb) => {
        const username = req.body.username; 
        const ext = path.extname(file.originalname); 
        cb(null, `${username}${ext}`); 
    }
});

const upload = multer({ 
    storage, 
    limits: { fileSize: 10 * 1024 * 1024 } 
});

router.post('/add', upload.single('profilePicture'), (req, res) => {
    const { name, email, phone, username, password, gender, dob, height, weight, membershipPlan, fitnessGoals, dateJoined } = req.body;
    const profilePicture = req.file ? `profile_pictures/${req.file.filename}` : null;

    const checkUsernameQuery = 'SELECT username FROM user WHERE username = ?';

    db.query(checkUsernameQuery, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while checking username.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Username already exists. Please choose another one.' });
        }

        const insertUserQuery = 'INSERT INTO user (username, role, name, gender, email, password, contact_number, date_of_birth, profile_picture, height, weight, fitness_goals, date_joined) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        db.query(insertUserQuery, [username, "member", name, gender, email, password, phone, dob, profilePicture, height, weight, fitnessGoals, dateJoined], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error while adding member.' });
            }
            res.status(201).json({ message: 'Member added successfully!', membershipId: result.insertId });
        });
    });
});

router.delete('/delete', (req, res) => {
    let { user_ids } = req.body; 

    if (!user_ids) {
        return res.status(400).json({ message: "No members selected for deletion." });
    }

    if (!Array.isArray(user_ids)) {
        user_ids = [user_ids];
    }

    const deleteQuery = `
        DELETE FROM user
        WHERE user_id IN (${user_ids.map(() => '?').join(',')}) 
    `;

    db.query(deleteQuery, user_ids, (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while deleting members.', error: err });
        }
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Members deleted successfully!' });
        } else {
            res.status(404).json({ message: 'No members found to delete.' });
        }
    });
});

router.put('/update/:id', (req, res) => {
    const { id } = req.params;
    const { name, email, phone, membershipPlan } = req.body;

    const updateQuery = `
        UPDATE user
        SET name = ?, email = ?, phone = ?, membershipPlan = ?
        WHERE user_id = ?
    `;

    db.query(updateQuery, [name, email, phone, membershipPlan, id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while updating member.' });
        }
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Member updated successfully!' });
        } else {
            res.status(404).json({ message: 'Member not found.' });
        }
    });
});

module.exports = router;
