const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.log('Error connecting to database:', err);
    } else {
        console.log('Connected to MySQL database.');
    }
});

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);

const membershipRoutes = require('./routes/memberships');
app.use('/api/memberships', membershipRoutes);

const membersRoutes = require('./routes/members');
app.use('/api/members', membersRoutes);

const trainersRoutes = require('./routes/trainers');
app.use('/api/trainers', trainersRoutes);

const billingRoutes = require('./routes/billing');
app.use('/api/billing', billingRoutes);

const scheduleRoutes = require('./routes/schedules');
app.use('/api/schedules', scheduleRoutes);

const analyticsRoutes = require('./routes/analytics');
app.use('/api/analytics', analyticsRoutes);

const announcementRoutes = require('./routes/announcement');
app.use('/api/announcement', announcementRoutes);

const feedbackRoutes = require('./routes/feedback');
app.use('/api/feedback', feedbackRoutes);

app.use('/uploads', express.static(path.resolve(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.send('Server is running!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});