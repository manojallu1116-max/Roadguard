import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const mongoUri = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME || 'roadDamageReporter';

let mongoClient = null;
let mongoDb = null;

async function connectMongoDb() {
  if (mongoDb) return mongoDb;
  if (!mongoUri) {
    const error = new Error('MONGODB_URI is not set.');
    console.error('MongoDB connection failed:', error);
    throw error;
  }

  try {
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    mongoDb = mongoClient.db(dbName);
    console.log('MongoDB connected successfully');
    return mongoDb;
  } catch (error) {
    console.error('MongoDB connection failed with error object:', error);
    throw error;
  }
}

export function createComplaintStore() {
  return {
    async read() {
      const db = await connectMongoDb();
      const complaints = await db.collection('complaints').find({}).sort({ createdAt: -1 }).toArray();
      return { complaints };
    },
    async write(data) {
      const db = await connectMongoDb();
      await db.collection('complaints').deleteMany({});
      if (data.complaints && data.complaints.length) {
        await db.collection('complaints').insertMany(data.complaints);
      }
    },
    async listComplaints() {
      const db = await connectMongoDb();
      const complaints = await db.collection('complaints').find({}).sort({ createdAt: -1 }).toArray();
      return complaints.map((item) => ({ ...item, id: item.id || item._id?.toString() }));
    },
    async getComplaint(id) {
      const db = await connectMongoDb();
      const complaint = await db.collection('complaints').findOne({ id });
      if (!complaint) return null;
      return { ...complaint, id: complaint.id || complaint._id?.toString() };
    },
    async createComplaint(input) {
      const created = {
        id: input.id || `COMP-${Math.floor(1000 + Math.random() * 9000)}`,
        title: input.title,
        category: input.category,
        severity: input.severity || 'Medium',
        isHazardous: Boolean(input.isHazardous),
        description: input.description || 'No additional description provided.',
        location: input.location || { address: 'Unknown location', lat: 0, lng: 0 },
        photoUrl: input.photoUrl || '',
        status: input.status || 'Received',
        reportedBy: input.reportedBy || 'Citizen User',
        createdAt: input.createdAt || new Date().toISOString(),
        upvotes: input.upvotes || 1,
        assignedDepartment: input.assignedDepartment || 'Pending Department Assignment',
        timeline: input.timeline || [
          {
            status: 'Received',
            timestamp: new Date().toISOString(),
            note: 'Complaint submitted successfully by citizen.'
          }
        ],
        authorityNotes: input.authorityNotes || 'New complaint queued for review.'
      };

      const db = await connectMongoDb();
      await db.collection('complaints').insertOne(created);
      return created;
    },
    async updateComplaint(id, updates) {
      const db = await connectMongoDb();
      const current = await db.collection('complaints').findOne({ id });
      if (!current) return null;

      const next = {
        ...current,
        ...updates,
        location: updates.location || current.location,
        timeline: updates.timeline || current.timeline || [],
        updatedAt: new Date().toISOString()
      };

      await db.collection('complaints').updateOne({ id }, { $set: next });
      return next;
    },
    async deleteComplaint(id) {
      const db = await connectMongoDb();
      await db.collection('complaints').deleteOne({ id });
      return true;
    }
  };
}
