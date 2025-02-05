require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const axios = require('axios');
const OpenAI = require('openai');
const { Server } = require('ws'); // Import WebSocket Server

const { connectToDb } = require('./db.js');
const { installHandler } = require('./api_handler.js');
const auth = require('./auth.js');
const openaiRoutes = require('./openai');
const statsRoutes = require('./stats');


const app = express();

// CORS configuration
// server.js (allowedOrigins)
const allowedOrigins = [
  'http://localhost:8000',
  'http://ui.promernstack.com:8000',
  'http://localhost:3000',
  'http://ui.promernstack.com:3000',
  'ws://localhost:3000', // Add WebSocket protocols
  'ws://ui.promernstack.com:3000'
];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// server.js
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", 
    "connect-src 'self' ws://localhost:3000 ws://ui.promernstack.com:3000");
  next();
});

app.use(express.json());
app.use(cookieParser());
app.use('/auth', auth.routes);
app.use('/api', openaiRoutes);
app.use('/api', statsRoutes);

installHandler(app);

const port = process.env.PORT || 3000;

const server = app.listen(port, '0.0.0.0', async () => {
  try {
    await connectToDb();
    console.log(`Server running on 0.0.0.0:${port}`);
  } catch (err) {
    console.log('ERROR:', err);
  }
});
// server.js
const allowedWsOrigins = [
  'http://localhost:8000',
  'http://ui.promernstack.com:8000',
  'http://localhost:3000',
  'http://ui.promernstack.com:3000'
];

const wss = new Server({ 
  server,
  verifyClient: (info, done) => {
    const origin = info.origin || info.req.headers.origin;
    if (allowedWsOrigins.includes(origin)) {
      done(true);
    } else {
      console.log('Blocked WebSocket connection from:', origin);
      done(false, 401, 'Unauthorized origin');
    }
  }
});

// Function to broadcast updates
function broadcastUpdate() {
  wss.clients.forEach((client) => {
    if (client.readyState === client.OPEN) {
      client.send(JSON.stringify({ type: 'UPDATE_STATS' }));
    }
  });
}

// Export the broadcast function
module.exports = { broadcastUpdate };