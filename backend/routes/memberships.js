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
    const { plan_name, description, price, duration} = req.body;

    const checkPlanNameQuery = 'SELECT plan_name FROM membership WHERE plan_name = ?';

    db.query(checkPlanNameQuery,[plan_name], (err, rows)=>{
        if (err) {
            return res.status(500).json({ message: 'Database error while checking plan name.' });
        }
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Plan name already exists. Please choose another one.' });
        }else{
            const insertQuery = 'INSERT INTO membership (plan_name, description, price, duration) VALUES (?, ?, ?, ?)';

            db.query(insertQuery, [plan_name, description, price, duration], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error while adding membership.' });
                }
                res.status(201).json({ message: 'Membership added successfully!'});
            });
        }
    });
});

router.put('/edit/:membership_id', (req, res) => {
    const { membership_id } = req.params; 
    const { plan_name, description, price, duration } = req.body;

    if (!plan_name || !description || !price || !duration) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const checkPlanNameQuery = 'SELECT plan_name FROM membership WHERE plan_name = ?';

    db.query(checkPlanNameQuery,[plan_name], (err, rows)=>{
        if (err) {
            return res.status(500).json({ message: 'Database error while checking plan name.' });
        }
        if (rows.length > 0) {
            return res.status(400).json({ message: 'Plan name already exists. Please choose another one.' });
        }else{
            const updateQuery = `
                UPDATE membership
                SET plan_name = ?, description = ?, price = ?, duration = ?
                WHERE membership_id = ?
            `;

            db.query(updateQuery, [plan_name, description, price, duration, membership_id], (err, result) => {
                if (err) {
                    return res.status(500).json({ message: 'Database error while updating membership.' });
                }
                if (result.affectedRows > 0) {
                    res.status(200).json({ message: 'Membership updated successfully!' });
                } else {
                    res.status(404).json({ message: 'Membership not found or no changes made.' });
                }
            });
        }
    });
});

router.delete('/delete', async (req, res) => {
    let { membership_ids } = req.body;

    if (!membership_ids) {
        return res.status(400).json({ message: "No members selected for deletion." });
    }

    if (!Array.isArray(membership_ids)) {
        membership_ids = [membership_ids];
    }

    // Delete membership from the database
    const deleteQuery = `
        DELETE FROM membership
        WHERE membership_id IN (${membership_ids.map(() => '?').join(',')})
    `;

    const [result] = await db.promise().query(deleteQuery, membership_ids);

    if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Membership plan deleted successfully!' });
    } else {
        res.status(404).json({ message: 'No membership plan found to delete.' });
    }

});

module.exports = router;
