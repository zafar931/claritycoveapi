require('dotenv').config();
const { MongoClient } = require('mongodb');

async function initDb() {
  const client = new MongoClient(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db('issuetracker');

    // Create indexes
    await db.collection('issues').createIndex({ created: 1 });
    await db.collection('issues').createIndex({ title: 'text', description: 'text' });

    console.log('Indexes created');
  } catch (err) {
    console.error('Error initializing database:', err);
  } finally {
    await client.close();
  }
}

initDb();