const mongoose = require('mongoose');
require('dotenv').config();
const mongoURL = process.env.MONGODB_URL_LOCAL;

// Set up MongoDB connection
mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;

// Define event listeners for database connection

db.on('connected', () => {
    console.log('Connected to MongoDB server');
});

db.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

module.exports = db;
