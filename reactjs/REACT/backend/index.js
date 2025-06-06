// index.js
const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const twilio = require('twilio');
const crypto = require('crypto'); // OTP generation ke liye

dotenv.config();  // Load environment variables

const app = express();
app.use(express.json()); // To parse JSON bodies

// Twilio Configuration
const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
const FROM_PHONE = process.env.TWILIO_PHONE_NUMBER;

// MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to MySQL database');
  }
});

// Generate OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000);  // 6-digit OTP
};

// Route to send OTP
app.post('/send-otp', (req, res) => {
  const { phoneNumber } = req.body;
  const otp = generateOtp();
  
  // Store OTP in DB or cache (for 5 minutes expiration)
  db.query('INSERT INTO otp_verifications (phone_number, otp) VALUES (?, ?)', [phoneNumber, otp], (err) => {
    if (err) {
      return res.status(500).send('Error saving OTP');
    }
    
    // Send OTP via Twilio SMS
    client.messages.create({
      body: `Your OTP is ${otp}`,
      from: FROM_PHONE,
      to: phoneNumber
    }).then(message => {
      res.status(200).send({ message: 'OTP sent successfully' });
    }).catch(err => {
      res.status(500).send('Error sending OTP');
    });
  });
});

// Route to verify OTP
app.post('/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;

  // Check OTP from DB
  db.query('SELECT * FROM otp_verifications WHERE phone_number = ? ORDER BY created_at DESC LIMIT 1', [phoneNumber], (err, results) => {
    if (err) {
      return res.status(500).send('Error verifying OTP');
    }
    if (results.length === 0) {
      return res.status(400).send('OTP not found');
    }

    const savedOtp = results[0].otp;

    // Compare OTPs
    if (savedOtp === otp) {
      res.status(200).send({ message: 'OTP verified successfully' });
    } else {
      res.status(400).send('Invalid OTP');
    }
  });
});

app.listen(5000, () => {
  console.log('Server running on port 5000');
});
