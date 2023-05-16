const axios = require('axios');
const { MongoClient } = require('mongodb');

// Function to check the date for each user and trigger the POST request
const checkDatesAndSendSMS = async () => {
  const currentDate = new Date();

  const uri = 'mongodb://localhost:27017';
  const dbName = 'mydatabase';
  const collectionName = 'users';

  try {
    // Connect to the database
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Find users with a target date equal to or before the current date

    // Find documents where the field "status" is equal to "active" and "quantity" is greater than 10
    const query = { $and: [ { status: 'active' }, { quantity: { $gt: 10 } } ] };
    const documents = await collection.find(query).toArray();
    

    //creates an Array with items that meet that criteria
    console.log(documents);

    for (const user of users) {
      const { userId, message } = user;

      // Send the POST request
      try {
        await axios.post('http://localhost:3000/send-sms', {
          userId,
          message
        });
        console.log(`SMS sent successfully to user ${userId}`);
      } catch (error) {
        console.error(`Error sending SMS to user ${userId}:`, error);
      }
    }
  } catch (error) {
    console.error('Error retrieving users:', error);
  } finally {
    // Close the database connection
    await client.close();
  }
};

// Schedule the function to run periodically
setInterval(checkDatesAndSendSMS, 24 * 60 * 60 * 1000); // Run every 24 hours
