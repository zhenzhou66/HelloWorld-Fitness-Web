const express = require('express');
const router = express.Router();
const db = require('../db');

// Get all members
router.get('/members', (req, res) => {
    db.query('SELECT * FROM user', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// Add a new member
router.post('/members', (req, res) => {
    const { name, email } = req.body;
    db.query('INSERT INTO user (name, email) VALUES (?, ?)', [name, email], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Member added successfully.' });
    });
});

module.exports = router;
