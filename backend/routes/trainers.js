const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/display', (req, res) => {
    const trainersDetails = 'SELECT * FROM user WHERE role = ?';
    const trainersCount = 'SELECT COUNT(*) AS trainersCount FROM user WHERE role = ?';

    db.query(trainersDetails, ["trainer"], (err, detailResult) => {
        if (err) return res.status(500).json({ message: 'Database error in fetching user details.' });
        
        db.query(trainersCount, ["trainer"], (err, countResult) => {
            if (err) return res.status(500).json({ message: 'Database error in trainers query.' });
            
            res.status(200).json({
                trainersDetails: detailResult || [],
                trainersCount: countResult[0].trainersCount || 0
            });
        });
    });
});

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: path.resolve(__dirname, '../../uploads/profile_pictures'), 
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
    const { name, email, phone, username, password, gender, dob, height, weight, fitnessGoals, dateJoined } = req.body;
    const profilePicture = req.file ? `profile_pictures/${req.file.filename}` : null;

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    if (calculateAge(dob) < 18) {
        return res.status(400).json({ message: 'You must be at least 18 years old to register.' });
    }

    const checkUsernameQuery = 'SELECT username FROM user WHERE username = ?';

    db.query(checkUsernameQuery, [username], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while checking username.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Username already exists. Please choose another one.' });
        }

        const insertUserQuery = `
            INSERT INTO user (username, role, name, gender, email, password, contact_number, date_of_birth, profile_picture, height, weight, fitness_goals, date_joined) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(insertUserQuery, [username, "trainer", name, gender, email, password, phone, dob, profilePicture, height, weight, fitnessGoals, dateJoined], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error while adding trainer.' });
            }
            res.status(201).json({ message: 'Trainer added successfully!' });
        });
    });
});

const fs = require('fs');
const util = require('util');
const unlinkAsync = util.promisify(fs.unlink);

router.delete('/delete', async (req, res) => {
    let { user_ids } = req.body; 

    if (!user_ids) {
        return res.status(400).json({ message: "No trainers selected for deletion." });
    }

    if (!Array.isArray(user_ids)) {
        user_ids = [user_ids];
    }

    try {
        // Get profile pictures of users before deleting them
        const [users] = await db.promise().query(
            `SELECT profile_picture FROM user WHERE user_id IN (${user_ids.map(() => '?').join(',')})`,
            user_ids
        );

        // Delete profile pictures from the filesystem
        for (const user of users) {
            if (user.profile_picture) {
                const filePath = path.join(__dirname, '../../uploads', user.profile_picture);
                if (fs.existsSync(filePath)) {
                    await unlinkAsync(filePath);
                }
            }
        }

        const deleteQuery = `
            DELETE FROM user
            WHERE user_id IN (${user_ids.map(() => '?').join(',')}) 
        `;

        const [result] = await db.promise().query(deleteQuery, user_ids);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Trainers and profile pictures deleted successfully!' });
        } else {
            res.status(404).json({ message: 'No trainers found to delete.' });
        }
    } catch (err) {
        console.error('Error deleting trainers:', err);
        res.status(500).json({ message: 'Internal server error.', error: err });
    }
});

router.get('/trainer-info/:user_id', (req, res) => {
    const { user_id } = req.params; 
    const query = `
        SELECT * 
        FROM user 
        WHERE user_id = ?`;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while fetching trainer\'s info.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(results[0]);
    });
});

router.put('/update', (req, res) => {
    const {contact_number, date_joined, date_of_birth, email, fitness_goals, gender, height, name, password, profile_picture, role, user_id, username, weight} = req.body;

    const calculateAge = (date_of_birth) => {
        const birthDate = new Date(date_of_birth);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    
    if (calculateAge(date_of_birth) < 18) {
        return res.status(400).json({ message: 'You must be at least 18 years old to register.' });
    }

    const checkUsernameQuery = 'SELECT username FROM user WHERE username = ? AND user_id != ?';
    db.query(checkUsernameQuery, [username, user_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while checking username.' });
        }
        if (result.length > 0) {  // If a matching username is found
            return res.status(400).json({ message: 'Username already exists.' });
        }

        const updateQuery = `
        UPDATE user
        SET username = ?, name = ?, gender = ?, email = ?, contact_number = ?, date_of_birth = ?, height = ?, weight = ?, fitness_goals = ?
        WHERE user_id = ?
        `;

        db.query(updateQuery, [username, name, gender, email, contact_number, date_of_birth, height, weight, fitness_goals, user_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error while updating trainer.' });
            }
            if (result.affectedRows > 0) {
                res.status(200).json({ message: 'Trainer updated successfully!' });
            } else {
                res.status(404).json({ message: 'Trainer not found.' });
            }
        });
    });
});

module.exports = router;
