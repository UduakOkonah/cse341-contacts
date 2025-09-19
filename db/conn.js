// db/conn.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'contactsDB';

if (!MONGO_URI) {
  throw new Error('MONGO_URI not set in .env');
}

const client = new MongoClient(MONGO_URI);
let db = null;

async function connectToMongo() {
  if (db) return db;
  await client.connect();
  db = client.db(DB_NAME);
  console.log('MongoDB connected to database:', DB_NAME);
  return db;
}

function getDb() {
  if (!db) throw new Error('Database not connected. Call connectToMongo first.');
  return db;
}

async function closeConnection() {
  if (client) {
    await client.close();
    db = null;
    console.log('MongoDB connection closed');
  }
}

module.exports = { connectToMongo, getDb, closeConnection, client };
