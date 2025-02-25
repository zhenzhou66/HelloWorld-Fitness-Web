const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/display', (req, res) => {
    const classDetails = 'SELECT c.*, t.name, t.profile_picture, (SELECT COUNT(*) FROM class_participants p WHERE p.class_id = c.class_id) AS participants_count FROM classes c INNER JOIN user t ON c.trainer_id = t.user_id';
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

router.get('/trainers', (req, res) => {
    const query = 'SELECT user_id, name FROM user WHERE role = "trainer"';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while fetching trainers.' });
        }
        res.json(results);
    });
});

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './uploads/class_image', 
    filename: (req, file, cb) => {
        const username = req.body.className; 
        const ext = path.extname(file.originalname); 
        cb(null, `${username}${ext}`); 
    }
});

const upload = multer({ 
    storage, 
    limits: { fileSize: 10 * 1024 * 1024 } 
});

router.post('/add', upload.single('classImage'), async (req, res) => {
    try {
        const { className, description, scheduleDate, startTime, endTime, maxParticipants, trainerName} = req.body;

        const class_image = req.file ? `class_image/${req.file.filename}` : null; 

        // Check if name already exists
        const [existingClass] = await db.promise().query('SELECT * FROM classes WHERE class_name = ?', [className]);
        if (existingClass.length > 0) {
            return res.status(400).json({ message: 'Class name already exists. Please choose another one.' });
        }

        //Check if the date is in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        const classDate = new Date(scheduleDate);
        classDate.setHours(0, 0, 0, 0); 
        if (classDate <= today) {
            return res.status(400).json({ message: "Schedule date must be in the future." });
        }

        // Insert new class
        const insertClassQuery = `
            INSERT INTO classes (class_name, description, max_participants, schedule_date, start_time, end_time, trainer_id, class_image) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(insertClassQuery, [className, description, maxParticipants, scheduleDate, startTime, endTime, trainerName, class_image], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error while adding class.', error: err });
            }
            res.status(201).json({ message: 'Class added successfully!' });
        });        

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal server error.', error: err });
    }
});

const fs = require('fs');
const util = require('util');
const unlinkAsync = util.promisify(fs.unlink);

router.delete('/delete', async (req, res) => {
    let { class_ids } = req.body;

    if (!class_ids) {
        return res.status(400).json({ message: "No class selected for deletion." });
    }

    if (!Array.isArray(class_ids)) {
        class_ids = [class_ids];
    }

    try {
        // Get class images before deleting them
        const [classes] = await db.promise().query(
            `SELECT class_image FROM classes WHERE class_id IN (${class_ids.map(() => '?').join(',')})`,
            class_ids
        );

        // Delete class images from the filesystem
        for (const image of classes) {
            if (image.class_image) {
                const filePath = path.join(__dirname, '../uploads', image.class_image);
                if (fs.existsSync(filePath)) {
                    await unlinkAsync(filePath);
                }
            }
        }

        // Delete classes from the database
        const deleteQuery = `
            DELETE FROM classes
            WHERE class_id IN (${class_ids.map(() => '?').join(',')})
        `;

        const [result] = await db.promise().query(deleteQuery, class_ids);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Class and class images deleted successfully!' });
        } else {
            res.status(404).json({ message: 'No class found to delete.' });
        }

    } catch (err) {
        console.error('Error deleting class:', err);
        res.status(500).json({ message: 'Internal server error.', error: err });
    }
});

router.put('/update', (req, res) => {
    const {class_id, class_name, description, end_time, max_participants, schedule_date, start_time, trainer_id} = req.body;
    console.log(class_name);

    const checkNameQuery = 'SELECT class_name FROM classes WHERE class_name = ? AND class_id != ?';
    db.query(checkNameQuery, [class_name, class_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while checking class names.' });
        }
        if (result.length > 0) {  
            return res.status(400).json({ message: 'Class name already exists.' });
        }

        //Check if the date is in the future
        const today = new Date();
        today.setHours(0, 0, 0, 0); 

        const classDate = new Date(schedule_date);
        classDate.setHours(0, 0, 0, 0); 
        if (classDate <= today) {
            return res.status(400).json({ message: "Schedule date must be in the future." });
        }

        const updateQuery = `
        UPDATE classes
        SET class_name = ?, description = ?, max_participants = ?, schedule_date = ?, start_time = ?, end_time = ?, trainer_id = ?
        WHERE class_id = ?
        `;

        db.query(updateQuery, [class_name, description, max_participants, schedule_date, start_time, end_time, trainer_id, class_id], (err, result) => {
            if (err) {
                return res.status(500).json({ message: 'Database error while updating class.' });
            }
            
            res.status(200).json({ message: 'Class updated successfully!' });
                        
        });
    });
});

module.exports = router;
