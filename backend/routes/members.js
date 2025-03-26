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
    const trainerQuery = 'SELECT user_id, name FROM user WHERE role = "trainer"';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while fetching membership plans.' });
        }
        db.query(trainerQuery, (err, trainerResults) => {
            if (err) {
                return res.status(500).json({ message: 'Database error while fetching trainers.' });
            }
            res.json({results, trainerResults});
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

router.post('/add', upload.single('profilePicture'), async (req, res) => {
    try {
        const { name, email, phone, username, password, gender, dob, height, weight, membershipPlan, fitnessGoals, trainerId, dateJoined } = req.body;
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

        if(trainerId !== ""){
            await db.promise().query('INSERT INTO member_trainer (member_id, trainer_id) VALUES (?, ?)', [userId, trainerId]);
        }

        res.status(201).json({ message: 'Member added successfully!' });

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error.', error: err });
    }
});

const fs = require('fs');
const util = require('util');
const { end } = require('../db');
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
            if (user.profile_picture != "default.jpg") {
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
        SELECT u.*, um.membership_id, mt.trainer_id
        FROM user u 
        LEFT JOIN user_membership um ON u.user_id = um.user_id 
        LEFT JOIN member_trainer mt ON u.user_id = mt.member_id
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

router.put('/update', async (req, res) => {
    try {
        const { 
            contact_number, date_joined, date_of_birth, email, fitness_goals, gender, 
            height, membership_id, name, password, profile_picture, role, trainer_id, 
            user_id, username, weight 
        } = req.body;

        // Function to calculate age
        const calculateAge = (dob) => {
            const birthDate = new Date(dob);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            if (today.getMonth() < birthDate.getMonth() || 
                (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        };

        // Age restriction check
        if (calculateAge(date_of_birth) < 12) {
            return res.status(400).json({ message: 'You must be at least 12 years old to register.' });
        }

        // Check if username already exists
        const [existingUser] = await db.promise().query(
            'SELECT username FROM user WHERE username = ? AND user_id != ?', [username, user_id]
        );

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Username already exists.' });
        }

        // Update user details
        const [updateResult] = await db.promise().query(`
            UPDATE user SET username = ?, name = ?, gender = ?, email = ?, contact_number = ?, 
            date_of_birth = ?, height = ?, weight = ?, fitness_goals = ? WHERE user_id = ?
        `, [username, name, gender, email, contact_number, date_of_birth, height, weight, fitness_goals, user_id]);

        if (updateResult.affectedRows === 0) {
            return res.status(404).json({ message: 'Member not found.' });
        }

        // Fetch membership duration
        const [membership] = await db.promise().query(
            'SELECT * FROM membership WHERE membership_id = ?', [membership_id]
        );
        if (membership.length === 0) {
            return res.status(404).json({ message: 'Membership ID not found!' });
        }
        const duration = membership[0].duration;
        const price = membership[0].price;
        const currentDate = new Date();
        const month = currentDate.toLocaleString('default', { month: 'long' });
        const year = currentDate.getFullYear();
        const description = `${membership[0].plan_name} - ${month} ${year}`;

        // Fetch current membership details
        const [userMembership] = await db.promise().query(
            'SELECT * FROM user_membership WHERE user_id = ?', [user_id]
        );
        if (userMembership.length === 0) {
            return res.status(404).json({ message: 'Start date not found for this membership.' });
        }

        const { end_date, status, membership_id: currentMembershipId } = userMembership[0];
        const isActive = new Date(end_date) > new Date();
        const newStatus = isActive ? 'Active' : 'Expired';

        // Update membership status if changed
        if (status !== newStatus) {
            await db.promise().query(
                'UPDATE user_membership SET status = ? WHERE user_id = ?', [newStatus, user_id]
            );
        }

        // Prevent active membership updates
        if (isActive && currentMembershipId !== membership_id) {
            return res.status(400).json({ message: 'You cannot update your membership plan while still active.' });
        }

        // Update membership details
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(startDate.getMonth() + duration);

        await db.promise().query(`
            UPDATE user_membership SET membership_id = ?, start_date = ?, end_date = ?, status = ? 
            WHERE user_id = ?
        `, [membership_id, startDate, endDate, 'Active', user_id]);

        await db.promise().query(`
            INSERT INTO transactions (user_id, description, amount, payment_status, payment_date) 
            VALUES (?, ?, ?, ?, NOW())
        `, [user_id, description, price, 'Paid']);

        // Manage trainer assignment
        const [memberTrainer] = await db.promise().query(
            'SELECT * FROM member_trainer WHERE member_id = ?', [user_id]
        );

        if (memberTrainer.length > 0) {
            if (membership_id == 1 || membership_id == 3) {
                await db.promise().query('DELETE FROM member_trainer WHERE member_id = ?', [user_id]);
            } else {
                await db.promise().query('UPDATE member_trainer SET trainer_id = ? WHERE member_id = ?', [trainer_id, user_id]);
            }
        } else if (trainer_id) {
            await db.promise().query('INSERT INTO member_trainer (trainer_id, member_id) VALUES (?, ?)', [trainer_id, user_id]);
        }

        return res.status(200).json({ message: 'Member updated successfully!' });
        
    } catch (error) {
        console.error('Error updating member:', error);
        return res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;
