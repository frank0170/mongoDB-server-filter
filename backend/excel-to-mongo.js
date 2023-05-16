const xlsx = require('xlsx');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

const excelFile = 'path/to/excel/file.xlsx';

// Function to convert Excel data to MongoDB documents
const convertExcelToMongo = async () => {
  try {
    // Read the Excel file
    const workbook = xlsx.readFile(excelFile);

    // Connect to the MongoDB server
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db(dbName);

    // Loop through each sheet in the Excel file
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];

      // Convert the sheet data to JSON
      const jsonData = xlsx.utils.sheet_to_json(sheet);

      // Insert the JSON data into the MongoDB collection
      const collection = db.collection(sheetName);
      await collection.insertMany(jsonData);
      console.log(`Data inserted into collection: ${sheetName}`);
    }

    console.log('Data conversion complete.');
  } catch (error) {
    console.error('Error converting Excel data to MongoDB:', error);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
};

// Call the conversion function
convertExcelToMongo();
