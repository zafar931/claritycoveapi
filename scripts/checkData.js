require('dotenv').config({ path: './.env' });
const { MongoClient } = require('mongodb');

async function checkData() {
  const client = await MongoClient.connect(process.env.DB_URL, {
    serverApi: { version: '1', strict: true, deprecationErrors: true }
  });
  const db = client.db('issuetracker');
  const issues = await db.collection('issues').find({}).toArray();
  console.log(JSON.stringify(issues, null, 2));
  await client.close();
}

checkData();