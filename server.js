// server.js 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectToMongo, client } = require('./db/conn');
const contactsRouter = require('./routes/contacts');

// --- Swagger setup ---
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Contacts API',
      version: '1.0.0',
      description: 'API for managing contacts',
    },
    servers: [
      {
        url: 'http://localhost:3000', // update this to your Render URL later
      },
    ],
  },
  apis: ['./routes/*.js'], // scan for Swagger comments in routes
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

const app = express();
app.use(cors());
app.use(express.json());

// Hello World root
app.get('/', (req, res) => res.send('Hello World'));

// Swagger route
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Contacts routes
app.use('/contacts', contactsRouter);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectToMongo(); // important: connect before listening
    app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}
startServer();

// graceful shutdown on Ctrl+C
process.on('SIGINT', async () => {
  console.log('SIGINT received, closing MongoDB client');
  await client.close();
  process.exit(0);
});
