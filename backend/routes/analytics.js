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

// router.get('/monthlyCheckIn/:year', (req, res) => {
//     const { year } = req.params;

//     const query = `
//         SELECT 
//             MONTH(check_in_time) AS month, 
//             COUNT(*) AS total
//         FROM attendance_gym 
//         WHERE YEAR(check_in_time) = ?
//         GROUP BY month 
//         ORDER BY month
//     `;

//     db.query(query, [year], (err, results) => {
//         if (err) return res.status(500).json({ message: 'Database error while fetching check-in data.' });

//         // Ensure all months (1-12) are present
//         let monthlyData = new Array(12).fill(0); // Default all months to 0
//         results.forEach(({ month, total }) => {
//             monthlyData[month - 1] = total; // Fill in available data
//         });

//         return res.json(monthlyData); // Send an array of numbers for chart.js
//     });
// });


module.exports = router;
