// test-connection.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

(async () => {
  const client = new MongoClient(process.env.MONGO_URI);
  try {
    await client.connect();
    console.log('OK: connected to MongoDB');
    const dbName = process.env.DB_NAME || 'contactsDB';
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();
    console.log('Collections in', dbName, ':', collections.map(c => c.name));
  } catch (err) {
    console.error('Connection test failed:', err.message);
  } finally {
    await client.close();
  }
})();
