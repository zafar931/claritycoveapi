const express = require('express');
const { getDb } = require('./db.js');
const { broadcastUpdate } = require('./server.js'); // Import the broadcast function

const router = express.Router();

router.get('/stats', async (req, res) => {
    try {
      const db = getDb();
      if (!db) throw new Error('Database not connected');
  
      const stats = await db.collection('issues').aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
          },
        },
      ]).toArray();
  
      const formattedStats = stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {});
  
      res.json(formattedStats);
    } catch (error) {
      console.error('Stats route error:', error);
      res.status(500).json({ error: error.message });
    }
  });

// Example route to add an issue (you should have similar routes for updating and deleting issues)
router.post('/issues', async (req, res) => {
  const db = getDb();
  const newIssue = req.body;
  await db.collection('issues').insertOne(newIssue);
  broadcastUpdate(); // Broadcast update after adding an issue
  res.status(201).json(newIssue);
});

module.exports = router;