const express = require('express');
const twilio = require('twilio');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const accountSid = 'YOUR_TWILIO_ACCOUNT_SID';
const authToken = 'YOUR_TWILIO_AUTH_TOKEN';
const client = twilio(accountSid, authToken);

const uri = 'mongodb://localhost:27017';
const dbName = 'mydatabase';
const collectionName = 'users';

// Middleware to parse JSON
app.use(express.json());

// Route to handle sending SMS
app.post('/send-sms', async (req, res) => {
  try {
    // Get user input from request body
    const { userId, message } = req.body;

    // Connect to the database
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Retrieve user from the database
    const user = await collection.findOne({ _id: userId });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check condition to send SMS
    if (user.someCondition === true) {
      // Send SMS
      await client.messages.create({
        body: message,
        from: 'YOUR_TWILIO_PHONE_NUMBER',
        to: user.phoneNumber
      });

      return res.json({ success: true });
    }

    return res.json({ success: false });
  } catch (error) {
    console.error('Error sending SMS:', error);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    // Close the database connection
    await client.close();
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
