const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const query = 'SELECT * FROM user WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error.' });

        if (results.length > 0) {
            const user = results[0];
            if (user.role === 'admin') {
                return res.status(200).json({ message: 'Login successful.', user });
            } else {
                return res.status(403).json({ message: 'Access denied. Admins only.' });
            }
        } else {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
    });
});

module.exports = router;
