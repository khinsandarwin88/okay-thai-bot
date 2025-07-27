// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 3000; // You can change this port if 3000 is already in use

// Enable CORS for all origins during development.
// IMPORTANT: In production, you should restrict this to your bot's specific domain for security.
// Example for production:
// app.use(cors({ origin: 'https://your-okay-thai-bot-domain.com' }));
app.use(cors());

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// --- API Endpoint for Lead Capture ---
// This route will handle POST requests from your front-end bot
app.post('/leads', (req, res) => {
    const leadData = req.body; // The lead data sent from your front-end bot

    console.log('------------------------------------');
    console.log('NEW LEAD RECEIVED FROM OKAY THAI BOT:');
    console.log('------------------------------------');
    console.log(`Name: ${leadData.name}`);
    console.log(`Email: ${leadData.email}`);
    console.log(`Phone: ${leadData.phone}`);
    console.log(`Interested Course: ${leadData.interestedCourse}`);
    console.log(`Source: ${leadData.source}`);
    console.log(`Status: ${leadData.status}`);
    console.log(`Follow-up Needed: ${leadData.followUpNeeded ? 'Yes' : 'No'}`);
    console.log(`Conversation Tag: ${leadData.conversationTag}`);
    console.log(`Timestamp: ${leadData.timestamp}`);
    console.log('------------------------------------');

    // --- THIS IS WHERE YOU WOULD INTEGRATE WITH YOUR CRM/DATABASE/EMAIL SERVICE ---
    // The code below is commented out as it requires additional setup (API keys, service accounts).
    // You would uncomment and configure these sections when you're ready to connect to a real service.

    // Example 1: Saving to Firebase Firestore
    /*
    // First, install firebase-admin: npm install firebase-admin
    // Then, uncomment these lines and configure:
    // const admin = require('firebase-admin');
    // const serviceAccount = require('./path/to/your-firebase-adminsdk.json'); // Download from Firebase project settings
    // if (!admin.apps.length) { // Initialize only once
    //   admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount)
    //   });
    // }
    // const db = admin.firestore();
    // db.collection('leads').add(leadData)
    //   .then(() => console.log('Lead saved to Firestore'))
    //   .catch(error => console.error('Error saving to Firestore:', error));
    */

    // Example 2: Sending an email notification (using Nodemailer)
    /*
    // First, install nodemailer: npm install nodemailer
    // Then, uncomment these lines and configure:
    // const nodemailer = require('nodemailer');
    // let transporter = nodemailer.createTransport({
    //     service: 'gmail', // or 'smtp.your-email-provider.com'
    //     auth: {
    //         user: 'your_admin_email@gmail.com', // Replace with your actual admin email
    //         pass: 'YOUR_EMAIL_APP_PASSWORD' // Use an app-specific password for security, NOT your regular email password
    //     }
    // });
    // let mailOptions = {
    //     from: 'bot@okaythai.com', // Sender email (can be your admin email)
    //     to: 'admin@yourcompany.com', // Recipient admin email
    //     subject: 'New Enrollment Lead from OKay Thai Bot',
    //     html: `<p>A new lead has been captured:</p>
    //            <ul>
    //                <li><strong>Name:</strong> ${leadData.name}</li>
    //                <li><strong>Email:</strong> ${leadData.email || 'N/A'}</li>
    //                <li><strong>Phone:</strong> ${leadData.phone || 'N/A'}</li>
    //                <li><strong>Course:</strong> ${leadData.interestedCourse || 'N/A'}</li>
    //                <li><strong>Topic:</strong> ${leadData.conversationTag}</li>
    //                <li><strong>Follow-up:</strong> ${leadData.followUpNeeded ? 'Yes' : 'No'}</li>
    //                <li><strong>Timestamp:</strong> ${leadData.timestamp}</li>
    //            </ul>`
    // };
    // transporter.sendMail(mailOptions)
    //     .then(() => console.log('Admin email sent'))
    //     .catch(error => console.error('Error sending email:', error));
    */

    // Example 3: Pushing to Google Sheets or Meta CRM
    // These integrations are more complex and typically involve specific client libraries and OAuth 2.0 authentication flows.
    // You would integrate their respective APIs here.

    // Send a success response back to the front-end bot
    res.status(200).json({ message: 'Lead received successfully by backend!' });
});

// Start the server and listen for incoming requests
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
    console.log(`Waiting for POST requests to http://localhost:${port}/leads`);
});
