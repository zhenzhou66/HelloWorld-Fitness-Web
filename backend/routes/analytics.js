const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/generalStats', (req, res) => {
    const currentDate = new Date().toLocaleDateString("en-CA");

    const totalCheckInQuery = 'SELECT COUNT(*) AS totalCheckIn FROM attendance_gym WHERE check_in_time LIKE CONCAT(?, "%")';
    const averageCheckInQuery = 'SELECT COUNT(*) / NULLIF(COUNT(DISTINCT DATE(check_in_time)), 0) AS avg_attendance_per_day FROM attendance_gym';
    const totalUserQuery = 'SELECT COUNT(*) AS totalUser FROM user_membership WHERE status = ?';
    const peakHourQuery = `SELECT HOUR(check_in_time) AS peak_hour, COUNT(*) AS check_in_count
                            FROM attendance_gym
                            GROUP BY peak_hour
                            ORDER BY check_in_count DESC
                            LIMIT 1`;

    db.query(totalCheckInQuery, [currentDate], (err, totalResult) => {
        if (err) return res.status(500).json({ message: 'Database error while fetching total check-in data.' });

        db.query(averageCheckInQuery, (err, averageResult) => {
            if (err) return res.status(500).json({ message: 'Database error while fetching average check-in data.' });

            db.query(totalUserQuery, ["Active"], (err, userResult) => {
                if (err) return res.status(500).json({ message: 'Database error while fetching total user data.' });

                const totalCheckIn = totalResult[0].totalCheckIn || 0;
                const avgAttendance = averageResult[0]?.avg_attendance_per_day || 0;
                const totalUser = userResult[0]?.totalUser || 1;  
                const attendanceRate = (totalCheckIn / totalUser) * 100;

                db.query(peakHourQuery, (err, peakHourResult) => {
                    if (err) return res.status(500).json({ message: 'Database error while fetching peak hour data.' });

                    if (peakHourResult.length > 0) {
                        let hour = peakHourResult[0].peak_hour;
                
                        if (hour < 12) {
                            formattedPeakHour = `${hour}:00 AM`;
                        } else if (hour === 12) {
                            formattedPeakHour = `12:00 PM`;
                        } else {
                            formattedPeakHour = `${hour - 12}:00 PM`;
                        }
                    } else {
                        formattedPeakHour = "No data available"; 
                    }

                    return res.json({
                        totalCheckIn,
                        avgAttendance,
                        attendanceRate,
                        peakHour: formattedPeakHour
                    });
                });
            });
        });
    });
});

router.get('/checkInUser', (req, res) => {
    const query = `
        SELECT a.*, u.name, 
               DATE(a.check_in_time) AS date, 
               TIME(a.check_in_time) AS time
        FROM attendance_gym a 
        INNER JOIN user u ON a.user_id = u.user_id 
        ORDER BY a.check_in_time DESC
    `;

    db.query(query, (err, userResult) => {
        if (err) return res.status(500).json({ message: 'Database error while fetching check-in user data.' });

        return res.json({
            checkInUser: userResult
        });
    });
});

router.get('/monthlyCheckIn/:year', (req, res) => {
    const { year } = req.params; 

    const query = `
        SELECT MONTH(check_in_time) AS month, COUNT(*) AS total
        FROM attendance_gym 
        WHERE YEAR(check_in_time) = ?
        GROUP BY month
        ORDER BY month
    `;

    db.query(query, [year], (err, userResult) => {
        if (err) return res.status(500).json({ message: 'Database error while fetching check-in user data.' });

        return res.json({
            checkInUser: userResult
        });
    });
});

router.get('/classStats', (req, res) => {

    const totalStudentQuery = 'SELECT COUNT(*) AS totalStudent FROM attendance_classes';
    const presentStudentQuery = 'SELECT COUNT(*) AS presentStudent FROM attendance_classes WHERE status = ?';
    const absentStudentQuery = 'SELECT COUNT(*) AS absentStudent FROM attendance_classes WHERE status = ?';

    db.query(totalStudentQuery, (err, totalResult) => {
        if (err) return res.status(500).json({ message: 'Database error while fetching total students data.' });

        db.query(presentStudentQuery, ["Present"], (err, presentResult) => {
            if (err) return res.status(500).json({ message: 'Database error while fetching present students data.' });
    
            db.query(absentStudentQuery, ["Absent"], (err, absentResult) => {
                if (err) return res.status(500).json({ message: 'Database error while fetching absent students data.' });
        
                return res.json({
                    totalStudent: totalResult[0].totalStudent,
                    presentStudent: presentResult[0].presentStudent,
                    absentStudent: absentResult[0].absentStudent
                });
            });
        });
    });
});

router.get('/classPopularity/:year', (req, res) => {
    let { year } = req.params;

    // Query to get top 4 most popular classes for the given year
    const query = `
        SELECT c.class_name AS name, COUNT(a.class_id) AS total 
        FROM classes c 
        INNER JOIN attendance_classes a ON c.class_id = a.class_id 
        WHERE YEAR(c.schedule_date) = ? 
        GROUP BY a.class_id 
        ORDER BY total DESC 
        LIMIT 4
    `;

    db.query(query, [year], (err, countResult) => {
        if (err) return res.status(500).json({ message: 'Database error while fetching top classes data.' });

        // Check if there are results, if not return an empty response
        if (countResult.length === 0) return res.json({ result: [], classInfo: [] });

        const classNames = countResult.map(row => row.name);
        
        // Query to get detailed class info with attendance counts
        const classInfoQuery = `
            SELECT 
                c.*, 
                COUNT(a.class_id) AS total,
                SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS present_count,
                SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS absent_count
            FROM classes c 
            LEFT JOIN attendance_classes a ON c.class_id = a.class_id 
            WHERE c.class_name IN (?) AND YEAR(c.schedule_date) = ?
            GROUP BY c.class_id
            ORDER BY absent_count, total DESC
        `;

        db.query(classInfoQuery, [classNames, year], (err, classInfoResult) => {
            if (err) return res.status(500).json({ message: 'Database error while fetching class info.' });                        

            return res.json({
                result: countResult,  
                classInfo: classInfoResult  
            });
        });
    });
});

module.exports = router;
