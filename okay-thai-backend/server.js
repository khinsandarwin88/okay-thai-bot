// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const admin = require('firebase-admin'); // Import firebase-admin

const app = express();
const port = 3000; // You can change this port

// --- Firebase Admin SDK Initialization ---
// IMPORTANT: Double-check this path. It MUST be correct relative to server.js
// If server.js is in /okay-thai-backend/ and the key is in /okay-thai-backend/, then './firebase-adminsdk.json' is correct.
// If the file is named differently, update it here.
const serviceAccountPath = './firebase-adminsdk.json'; // Define path as a variable for logging

try {
  const serviceAccount = require(serviceAccountPath);
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
    // If you need Realtime Database as well, add databaseURL: 'https://YOUR_PROJECT_ID.firebaseio.com'
  });
  console.log('Firebase Admin SDK initialized successfully.');
  const db = admin.firestore(); // Get a reference to the Firestore database service
  // Store db instance globally or pass it as needed
  app.locals.db = db; // Attach db to app.locals for easy access in routes
} catch (error) {
  console.error('ERROR: Firebase Admin SDK initialization failed!');
  console.error('Please ensure "firebase-adminsdk.json" is in the correct directory and is a valid JSON file.');
  console.error('Error details:', error.message);
  // Exit the process if Firebase initialization fails critically
  process.exit(1);
}
// --- End Firebase Admin SDK Initialization ---

// Enable CORS for all origins during development.
// IMPORTANT: In production, you should restrict this to your bot's specific domain for security.
// Example for production:
// app.use(cors({ origin: 'https://your-okay-thai-bot-domain.com' }));
app.use(cors());

// Use body-parser middleware to parse JSON request bodies
app.use(bodyParser.json());

// --- API Endpoint for Lead Capture ---
// This route will handle POST requests from your front-end bot
app.post('/leads', async (req, res) => {
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

    // Access the db instance from app.locals
    const db = app.locals.db;

    if (!db) {
        console.error('ERROR: Firestore database instance not available. Firebase initialization might have failed earlier.');
        return res.status(500).json({ message: 'Server configuration error: Database not ready.' });
    }

    try {
        // --- Save Lead Data to Firestore ---
        // 'leads' will be the name of your collection in Firestore
        console.log('Attempting to save lead to Firestore...');
        const docRef = await db.collection('leads').add(leadData);
        console.log('SUCCESS: Lead saved to Firestore with ID:', docRef.id);
        // --- End Save Lead Data to Firestore ---

        // Example 2: Sending an email notification (this will be our next step)
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
        //            </ul>`
        // };
        // transporter.sendMail(mailOptions)
        //     .then(() => console.log('Admin email sent'))
        //     .catch(error => console.error('Error sending email:', error));
        */

        // Send a success response back to the front-end bot
        res.status(200).json({ message: 'Lead received and saved successfully!' });
    } catch (error) {
        console.error('ERROR: Failed to save lead to Firestore.');
        console.error('Error details:', error); // Log the full error object for more info
        res.status(500).json({ message: 'Failed to process lead due to server error.' });
    }
});

// Start the server and listen for incoming requests
app.listen(port, () => {
    console.log(`Backend server running at http://localhost:${port}`);
    console.log(`Waiting for POST requests to http://localhost:${port}/leads`);
});
