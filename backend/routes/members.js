const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/display', (req, res) => {
    const membersDetails = 'SELECT * FROM user WHERE role = ?';

    db.query(membersDetails, ["member"], (err, detailResult) => {
        if (err) return res.status(500).json({ message: 'Database error in fetching user details.' });
        
        res.status(200).json({
            membersDetails: detailResult || []
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
    
    const insertUserQuery = 'INSERT INTO user (username, role, name, gender, email, password, contact_number, date_of_birth, profile_picture, height, weight, fitness_goals, date_joined) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

    db.query(insertUserQuery, [username, "member", name, gender, email, password, phone, dob, profilePicture, height, weight, fitnessGoals, dateJoined], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while adding member.' });
        }
        res.status(201).json({ message: 'Member added successfully!', membershipId: result.insertId });
    });
});

module.exports = router;
