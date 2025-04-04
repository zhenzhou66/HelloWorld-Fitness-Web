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
    destination: path.resolve(__dirname, '../../uploads/class_image'),  
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

        const class_image = req.file ? `class_image/${req.file.filename}` : `default.jpg`; 

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
        const classIdQuery = `
            SELECT class_id from classes WHERE class_name = ?;
        `;
        db.query(insertClassQuery, [className, description, maxParticipants, scheduleDate, startTime, endTime, trainerName, class_image], (err, results) => {
            if (err) {
                return res.status(500).json({ message: 'Database error while adding class.', error: err });
            }

            db.query(classIdQuery, [className], (err, classId) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error while adding class.', error: err });
                }
                const class_id = classId[0].class_id
                const scheduleDateObj = new Date(scheduleDate); 
                const send_date = new Date(scheduleDateObj); 
                send_date.setDate(scheduleDateObj.getDate() - 1);

                const notificationQuery = `INSERT INTO notifications 
                    (title, message, type, send_date, end_date, target, class_id) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)`;

                const notificationMessage = `Don't forget your ${className} class tomorrow at ${startTime}.`;

                db.query(notificationQuery, 
                    [`${className} Class Reminder`, notificationMessage, 'Reminder', send_date, scheduleDate, 'General', class_id], 
                    (err, notification) => {
                        if (err) {
                            return res.status(500).json({ message: 'Database error while adding class notification.', error: err });
                        }
                        res.status(201).json({ message: 'Class added successfully!' });
                    }
                );
            }); 
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
            if (image.class_image != "default.jpg") {
                const filePath = path.join(__dirname, '../../uploads', image.class_image);
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

        const deleteNotificationQuery = `DELETE FROM notifications WHERE class_id IN (${class_ids.map(() => '?').join(',')})`;

        const [result] = await db.promise().query(deleteNotificationQuery, class_ids);

        if (result.affectedRows > 0) {
            const [notiResult] = await db.promise().query(deleteQuery, class_ids);
            if (notiResult.affectedRows > 0) {
                res.status(200).json({ message: 'Class deleted successfully!' });
            } else {
                res.status(404).json({ message: 'No class found to delete.' });
            }
        } else {
            res.status(404).json({ message: 'No notification found to delete.' });
        }

    } catch (err) {
        console.error('Error deleting class:', err);
        res.status(500).json({ message: 'Internal server error.', error: err });
    }
});

router.put('/update', (req, res) => {
    const {class_id, class_name, description, end_time, max_participants, schedule_date, start_time, trainer_id} = req.body;

    const checkNameQuery = 'SELECT class_name FROM classes WHERE class_name = ? AND class_id != ?';
    db.query(checkNameQuery, [class_name, class_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while checking class names.' });
        }
        if (result.length > 0) {  
            return res.status(400).json({ message: 'Class name already exists.' });
        }
        const checkDateQuery = 'SELECT schedule_date FROM classes WHERE class_id = ?';
        db.query(checkDateQuery, [class_id], (err, dateRResult) => {
            if (err) {
                return res.status(500).json({ message: 'Database error while checking class names.' });
            }
            const oriSchedule_date = new Date(dateRResult[0].schedule_date);

            //Check if the date is in the future
            const today = new Date();
            today.setHours(0, 0, 0, 0); 

            const classDate = new Date(schedule_date);
            classDate.setHours(0, 0, 0, 0); 
            if(today >= oriSchedule_date && classDate.getTime() !== oriSchedule_date.getTime()){
                return res.status(400).json({ message: "Cannot edit date of past classes." });
            }else if (oriSchedule_date >= today && classDate <= today) {
                return res.status(400).json({ message: "Schedule date must be in the future." });
            }

            const getClassQuery = 'SELECT class_name FROM classes WHERE class_id = ?';

            const updateQuery = `
            UPDATE classes
            SET class_name = ?, description = ?, max_participants = ?, schedule_date = ?, start_time = ?, end_time = ?, trainer_id = ?
            WHERE class_id = ?
            `;

            const updateNotificationQuery = `
            UPDATE notifications
            SET title = ?, message = ?, send_date = ?, end_date = ?
            WHERE class_id = ? AND title = ?
            `;

            const notificationMessage = `Don't forget your ${class_name} class tomorrow at ${start_time}.`;
            const scheduleDateObj = new Date(schedule_date); 
            const send_date = new Date(scheduleDateObj); 
            send_date.setDate(scheduleDateObj.getDate() - 1);

            db.query(getClassQuery, [class_id], (err, className) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error while updating class.' });
                }
                const originalName = className[0].class_name;

                db.query(updateQuery, [class_name, description, max_participants, schedule_date, start_time, end_time, trainer_id, class_id], (err, result) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database error while updating class.' });
                    }

                    db.query(updateNotificationQuery, [`${class_name} Class Reminder`, notificationMessage, send_date, schedule_date, class_id, `${originalName} Class Reminder`], (err, result) => {
                        if (err) {
                            return res.status(500).json({ message: 'Database error while updating class.' });
                        }
                    
                        res.status(200).json({ message: 'Class updated successfully!' });
                    });       
                });
            });
        });
    });
});

module.exports = router;
