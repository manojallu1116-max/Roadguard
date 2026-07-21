import test from 'node:test';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { createComplaintStore } from '../server/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('complaint store creates and updates records', async () => {
  const dbPath = path.join(__dirname, 'tmp-complaints.json');
  const store = createComplaintStore({ dbPath, seedData: { complaints: [] } });

  const created = await store.createComplaint({
    title: 'Test pothole',
    category: 'Pothole',
    severity: 'High',
    description: 'Needs attention',
    location: { address: 'Test Street', lat: 1, lng: 2 },
    photoUrl: ''
  });

  assert.equal(created.title, 'Test pothole');
  const complaints = await store.listComplaints();
  assert.equal(complaints.length, 1);

  const updated = await store.updateComplaint(created.id, { status: 'In Progress' });
  assert.equal(updated.status, 'In Progress');
  const byId = await store.getComplaint(created.id);
  assert.equal(byId.status, 'In Progress');
});
