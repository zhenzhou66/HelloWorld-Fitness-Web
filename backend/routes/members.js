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

    if (calculateAge(dob) < 12) {
        return res.status(400).json({ message: 'You must be at least 12 years old to register.' });
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

        db.query(insertUserQuery, [username, "member", name, gender, email, password, phone, dob, profilePicture, height, weight, fitnessGoals, dateJoined], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error while adding member.' });
            }

            const durationQuery = 'SELECT duration FROM membership WHERE membership_id = ?';
            db.query(durationQuery, [membershipPlan], (err, result) => {
                if (err) {
                    console.error('Error fetching duration:', err);
                    return res.status(500).json({ message: 'Database error while fetching membership duration.' });
                }
                if (result.length === 0) {
                    return res.status(400).json({ message: 'Invalid membership ID.' });
                }

                const duration = result[0].duration;
                const startDate = new Date();
                const endDate = new Date();
                endDate.setMonth(startDate.getMonth() + duration);

                const formatDateForMySQL = (date) => date.toISOString().split('T')[0];

                const startDateFormatted = formatDateForMySQL(startDate);
                const endDateFormatted = formatDateForMySQL(endDate);
                
                const status = (new Date() >= startDate && new Date() <= endDate) ? 'Active' : 'Expired';

                const userQuery = 'SELECT user_id FROM user WHERE username = ? LIMIT 1';
                db.query(userQuery, [username], (err, userResult) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database error while fetching user ID.' });
                    }
                    if (userResult.length === 0) {
                        return res.status(400).json({ message: 'User not found after insert.' });
                    }

                    const userId = userResult[0].user_id;

                    const insertQuery = `
                        INSERT INTO user_membership (membership_id, user_id, start_date, end_date, status) 
                        VALUES (?, ?, ?, ?, ?)
                    `;
                    db.query(insertQuery, [membershipPlan, userId, startDateFormatted, endDateFormatted, status], (err, insertResult) => {
                        if (err) {
                            return res.status(500).json({ message: 'Database error while inserting membership.' });
                        }
                        res.status(201).json({ message: 'Member added successfully!' });
                    });
                });
            });
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

router.get('/membership-info/:user_id', (req, res) => {
    const { user_id } = req.params; 
    const query = `
        SELECT u.*, um.membership_id 
        FROM user u 
        LEFT JOIN user_membership um ON u.user_id = um.user_id 
        WHERE u.user_id = ?`;

    db.query(query, [user_id], (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while fetching membership plans.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json(results[0]);
    });
});

router.put('/update', (req, res) => {
    const {contact_number, date_joined, date_of_birth, email, fitness_goals, gender, height, membership_id, name, password, profile_picture, role, user_id, username, weight} = req.body;

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
    
    if (calculateAge(date_of_birth) < 12) {
        return res.status(400).json({ message: 'You must be at least 12 years old to register.' });
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
                return res.status(500).json({ message: 'Database error while updating member.' });
            }
            if (result.affectedRows > 0) {
                const durationQuery = 'SELECT duration FROM membership WHERE membership_id = ?';
                db.query(durationQuery, [membership_id], (err, result) => {
                    if (err) {
                        console.error('Error fetching duration:', err);
                        return res.status(500).json({ message: 'Error fetching membership duration.' });
                    }
                    if (!result || result.length === 0) {
                        return res.status(404).json({ message: 'Membership ID not found!' });
                    }
                    const duration = result[0].duration;

                    const startDateQuery = 'SELECT start_date FROM user_membership WHERE user_id = ?';
                    db.query(startDateQuery, [user_id], (err, result) => {
                        if (err) {
                            console.error('Error fetching start_date:', err);
                            return res.status(500).json({ message: 'Error fetching start date.' });
                        }
                        if (!result || result.length === 0) {
                            return res.status(404).json({ message: 'Start date not found for this membership.' });
                        }

                        const startDate = new Date(result[0].start_date);
                        const endDate = new Date(startDate);
                        endDate.setMonth(startDate.getMonth() + duration);

                        const currentDate = new Date();
                        const status = (currentDate >= startDate && currentDate <= endDate) ? 'Active' : 'Expired';
                        const updateMembershipQuery = "UPDATE user_membership SET membership_id = ?, start_date = ?, end_date = ?, status = ? WHERE user_id = ?";

                        db.query(updateMembershipQuery, [membership_id, startDate, endDate, status, user_id], (err, result) => {
                            if (err) {
                                console.error('Error updating membership:', err);
                                return res.status(500).json({ message: 'Error updating membership details.' });
                            }
                            res.status(200).json({ message: 'Member updated successfully!' });
                        });
                    });
                });
            } else {
                res.status(404).json({ message: 'Member not found.' });
            }
        });
    });
});

module.exports = router;
