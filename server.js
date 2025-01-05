const express = require('express');
const nodemailer = require('nodemailer');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(express.json()); // Parse JSON body
app.use(cors()); // Enable CORS

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,    // Your email address
    pass: process.env.PASSWORD, // Your Gmail app password
  },
});

// Route to send the email
app.post('/send-email', (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL,  // Sender's email (must match authenticated email)
    to: process.env.EMAIL,    // Your email to receive the form submission
    subject: 'New Appointment Request',
    text: `You have received a new appointment request:

    First Name: ${firstName}
    Last Name: ${lastName}
    Email: ${email}
    Phone: ${phone}
    Message: ${message}`,
    replyTo: email, // Allows you to reply directly to the user's email
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ success: false, message: 'Failed to send email' });
    } else {
      console.log('Email sent:', info.response);
      res.status(200).json({ success: true, message: 'Email sent successfully' });
    }
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
