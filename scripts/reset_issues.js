import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const url = 'mongodb+srv://zafarz786:9181zr9181@cluster0.lgycv.mongodb.net/issuetracker?retryWrites=true&w=majority';
const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

const owners = ['Ravan', 'Eddie', 'Pieta', 'Parvati', 'Victor'];
const statuses = ['New', 'Assigned', 'Fixed', 'Closed'];

async function resetIssues() {
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');

    const db = client.db('issuetracker');

    // Remove all existing issues
    await db.collection('issues').deleteMany({});
    console.log('All existing issues removed');

    const initialCount = await db.collection('issues').countDocuments();

    const issues = [];
    for (let i = 0; i < 100; i += 1) {
      const randomCreatedDate = (new Date()) - Math.floor(Math.random() * 60) * 1000 * 60 * 60 * 24;
      const created = new Date(randomCreatedDate);
      const randomDueDate = (new Date()) - Math.floor(Math.random() * 60) * 1000 * 60 * 60 * 24;
      const due = new Date(randomDueDate);
      const owner = owners[Math.floor(Math.random() * 5)];
      const status = statuses[Math.floor(Math.random() * 4)];
      const effort = Math.ceil(Math.random() * 20);
      const title = `Lorem ipsum dolor sit amet, ${i}`;
      const id = initialCount + i + 1;
      const issue = {
        id, title, created, due, owner, status, effort,
      };
      issues.push(issue);
    }

    await db.collection('issues').insertMany(issues);
    const count = await db.collection('issues').countDocuments();
    await db.collection('counters').updateOne({ _id: 'issues' }, { $set: { current: count } });

    console.log('New issue count:', count);
  } finally {
    await client.close();
  }
}

resetIssues().catch(console.dir);