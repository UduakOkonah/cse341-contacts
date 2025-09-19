// routes/contacts.js
const express = require('express');
const { ObjectId } = require('mongodb');
const { getDb } = require('../db/conn');

const router = express.Router();

// GET /contacts  -> return all contacts
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    const contacts = await db.collection('contacts').find({}).toArray();
    res.json(contacts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching contacts', error: err.message });
  }
});

// GET /contacts/:id -> return one contact by _id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  try {
    const db = getDb();
    const contact = await db.collection('contacts').findOne({ _id: new ObjectId(id) });
    if (!contact) return res.status(404).json({ message: 'Contact not found' });
    res.json(contact);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching contact', error: err.message });
  }
});

module.exports = router;
