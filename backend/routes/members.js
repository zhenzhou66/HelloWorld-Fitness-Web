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

router.post('/add', upload.single('profilePicture'), async (req, res) => {
    try {
        const { name, email, phone, username, password, gender, dob, height, weight, membershipPlan, fitnessGoals, dateJoined } = req.body;
        const profilePicture = req.file ? `profile_pictures/${req.file.filename}` : `default.jpg`;
        // Validate age
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (today.getMonth() < birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
            age--;
        }
        if (age < 12) {
            return res.status(400).json({ message: 'You must be at least 12 years old to register.' });
        }

        // Check if username already exists
        const [existingUser] = await db.promise().query('SELECT username FROM user WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username already exists. Please choose another one.' });
        }

        // Insert new user
        const insertUserQuery = `
            INSERT INTO user (username, role, name, gender, email, password, contact_number, date_of_birth, profile_picture, height, weight, fitness_goals, date_joined) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [insertResult] = await db.promise().query(insertUserQuery, [username, "member", name, gender, email, password, phone, dob, profilePicture, height, weight, fitnessGoals, dateJoined]);

        // Get membership details
        const [membershipResult] = await db.promise().query('SELECT * FROM membership WHERE membership_id = ?', [membershipPlan]);
        if (membershipResult.length === 0) {
            return res.status(400).json({ message: 'Invalid membership ID.' });
        }

        const { plan_name, price, duration } = membershipResult[0];
        const currentDate = new Date();
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        const updatedDescription = `${plan_name} - ${month} ${year}`;

        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + duration);

        const startDateFormatted = startDate.toISOString().split('T')[0];
        const endDateFormatted = endDate.toISOString().split('T')[0];

        // Set membership status to Active
        const status = 'Active';

        // Get user ID
        const [userResult] = await db.promise().query('SELECT user_id FROM user WHERE username = ? LIMIT 1', [username]);
        if (userResult.length === 0) {
            return res.status(400).json({ message: 'User not found after insert.' });
        }

        const userId = userResult[0].user_id;

        // Insert into user_membership table
        await db.promise().query('INSERT INTO user_membership (membership_id, user_id, start_date, end_date, status) VALUES (?, ?, ?, ?, ?)', [membershipPlan, userId, startDateFormatted, endDateFormatted, status]);

        // Insert into transactions table
        const paymentDate = new Date().toISOString().split('T')[0];
        await db.promise().query('INSERT INTO transactions (user_id, description, amount, payment_status, payment_date) VALUES (?, ?, ?, ?, ?)', [userId, updatedDescription, price, "Paid", paymentDate]);

        res.status(201).json({ message: 'Member added successfully!' });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error.', error: err });
    }
});

const fs = require('fs');
const util = require('util');
const { end } = require('../../Hello_World_Fitness_App/backend/db');
const unlinkAsync = util.promisify(fs.unlink);

router.delete('/delete', async (req, res) => {
    let { user_ids } = req.body;

    if (!user_ids) {
        return res.status(400).json({ message: "No members selected for deletion." });
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

        // Delete users from the database
        const deleteQuery = `
            DELETE FROM user
            WHERE user_id IN (${user_ids.map(() => '?').join(',')})
        `;

        const [result] = await db.promise().query(deleteQuery, user_ids);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Members and profile pictures deleted successfully!' });
        } else {
            res.status(404).json({ message: 'No members found to delete.' });
        }

    } catch (err) {
        console.error('Error deleting members:', err);
        res.status(500).json({ message: 'Internal server error.', error: err });
    }
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
        if (result.length > 0) {  
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

                    const endDateQuery = 'SELECT * FROM user_membership WHERE user_id = ?';
                    db.query(endDateQuery, [user_id], (err, result) => {
                        if (err) {
                            console.error('Error fetching start_date:', err);
                            return res.status(500).json({ message: 'Error fetching start date.' });
                        }
                        if (!result || result.length === 0) {
                            return res.status(404).json({ message: 'Start date not found for this membership.' });
                        }
                        const originalEndDate = result[0].end_date;
                        const originStatus = (new Date(originalEndDate) > new Date()) ? 'Active':'Expired';
                        const updateMembershipQuery = "UPDATE user_membership SET membership_id = ?, start_date = ?, end_date = ?, status = ? WHERE user_id = ?";

                        if(result[0].status !== originStatus){
                            const updateStatusQuery = "UPDATE user_membership SET status = ? WHERE user_id = ?";
                            db.query(updateStatusQuery, [originStatus, user_id], (err, statusResult) => {
                                if (err) {
                                    console.error('Error updating membership:', err);
                                    return res.status(500).json({ message: 'Error updating membership details.' });
                                }
                                db.query(endDateQuery, [user_id], (err, dateResult) => {
                                    if (err) {
                                        console.error('Error updating membership:', err);
                                        return res.status(500).json({ message: 'Error updating membership details.' });
                                    }
                                    if(result[0].status == "Active" && String(result[0].membership_id)  !== membership_id){
                                        return res.status(404).json({ message: 'You are not allowed to update membership plan when you are still active.' });
                                    }
                                    const startDate = new Date();
                                    const endDate = new Date(startDate);
                                    endDate.setMonth(startDate.getMonth() + duration);
                                                
                                    db.query(updateMembershipQuery, [membership_id, startDate, endDate, 'Active', user_id], (err, result) => {
                                        if (err) {
                                            console.error('Error updating membership:', err);
                                            return res.status(500).json({ message: 'Error updating membership details.' });
                                        }
                                        res.status(200).json({ message: 'Member updated successfully!' });
                                    });
                                });
                            });
                        }

                        if(result[0].status == "Active" && String(result[0].membership_id)  !== membership_id){
                            return res.status(404).json({ message: 'You are not allowed to update membership plan when you are still active.' });
                        }
                        const startDate = new Date();
                        const endDate = new Date(startDate);
                        endDate.setMonth(startDate.getMonth() + duration);
                        
                        db.query(updateMembershipQuery, [membership_id, startDate, endDate, 'Active', user_id], (err, result) => {
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
