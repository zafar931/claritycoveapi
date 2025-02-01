import { MongoClient } from 'mongodb';

const url = 'mongodb+srv://zafarz786:9181zr9181@cluster0.lgycv.mongodb.net/issuetracker?retryWrites=true&w=majority';

async function checkDeletedIssues() {
  const client = new MongoClient(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas');
    
    const db = client.db('issuetracker');
    const deletedIssues = await db.collection('deleted_issues').find({}).toArray();
    
    console.log('Deleted Issues:');
    console.log(JSON.stringify(deletedIssues, null, 2));
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

checkDeletedIssues();