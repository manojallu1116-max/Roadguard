import 'dotenv/config';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI missing');
  process.exit(1);
}

const client = new MongoClient(uri);

try {
  await client.connect();
  console.log('CONNECTED');
  const db = client.db(process.env.DB_NAME || 'roadDamageReporter');
  const collections = await db.listCollections().toArray();
  console.log(collections.map((c) => c.name));
} catch (error) {
  console.error(error.message);
  process.exit(1);
} finally {
  await client.close();
}
