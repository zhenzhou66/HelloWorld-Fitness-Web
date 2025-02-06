// memberships.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Endpoint to fetch membership details and count
router.get('/display', (req, res) => {
    const membershipDetails = 'SELECT * FROM membership';
    const membershipCount = 'SELECT COUNT(*) AS membershipCount FROM membership';

    db.query(membershipDetails, (err, detailResult) => {
        if (err) return res.status(500).json({ message: 'Database error in revenue query.' });
        
        db.query(membershipCount, (err, countResult) => {
            if (err) return res.status(500).json({ message: 'Database error in members query.' });
            
            res.status(200).json({
                membershipDetails: detailResult || [],
                membershipCount: countResult[0].membershipCount || 0
            });
        });
    });
});

router.post('/add', (req, res) => {
    const { plan_name, description, price } = req.body;
    
    const insertQuery = 'INSERT INTO membership (plan_name, description, price) VALUES (?, ?, ?)';

    db.query(insertQuery, [plan_name, description, price], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while adding membership.' });
        }
        res.status(201).json({ message: 'Membership added successfully!', membershipId: result.insertId });
    });
});

router.put('/edit/:membership_id', (req, res) => {
    const { membership_id } = req.params; 
    const { plan_name, description, price } = req.body;

    if (!plan_name || !description || !price) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const updateQuery = `
        UPDATE membership
        SET plan_name = ?, description = ?, price = ?
        WHERE membership_id = ?
    `;

    db.query(updateQuery, [plan_name, description, price, membership_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while updating membership.' });
        }
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Membership updated successfully!' });
        } else {
            res.status(404).json({ message: 'Membership not found or no changes made.' });
        }
    });
});

router.delete('/delete/:membership_id', (req, res) => {
    const { membership_id } = req.params; 

    const deleteQuery = `
        DELETE FROM membership
        WHERE membership_id = ?
    `;

    db.query(deleteQuery, [membership_id], (err, result) => {
        if (err) {
            return res.status(500).json({ message: 'Database error while updating membership.' });
        }
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Membership updated successfully!' });
        } else {
            res.status(404).json({ message: 'Membership not found or no changes made.' });
        }
    });
});

module.exports = router;
