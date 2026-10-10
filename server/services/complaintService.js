import { Complaint } from '../models/Complaint.js';

export class ComplaintService {
  async listComplaints(options = {}) {
    const { limit = 100, skip = 0, sort = { createdAt: -1 } } = options;
    const complaints = await Complaint.find()
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .lean();
    return complaints.map(doc => ({
      ...doc,
      id: doc.id || doc._id?.toString()
    }));
  }

  async listComplaintsForUser(userId, options = {}) {
    const { limit = 100, skip = 0 } = options;
    const complaints = await Complaint.find({ reportedByUserId: userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();
    return complaints.map(doc => ({ ...doc, id: doc.id || doc._id?.toString() }));
  }

  async getComplaintById(complaintId) {
    const complaint = await Complaint.findOne({
      $or: [{ id: complaintId }, { _id: complaintId }]
    }).lean();
    if (!complaint) {
      throw new Error(`Complaint not found: ${complaintId}`);
    }
    return {
      ...complaint,
      id: complaint.id || complaint._id?.toString()
    };
  }

  async createComplaint(data, reporter = null) {
    const complaint = new Complaint({
      id: data.id || undefined,
      title: data.title,
      category: data.category,
      severity: data.severity || 'Medium',
      isHazardous: Boolean(data.isHazardous),
      description: data.description || 'No additional description provided.',
      location: {
        address: data.location?.address || 'Unknown location',
        lat: data.location?.lat || 0,
        lng: data.location?.lng || 0
      },
      photoUrl: data.photoUrl || '',
      status: data.status || 'Received',
      reportedBy: reporter?.name || data.reportedBy || 'Citizen User',
      reportedByUserId: reporter?._id || null,
      upvotes: data.upvotes || 1,
      assignedDepartment: data.assignedDepartment || 'Pending Department Assignment',
      timeline: data.timeline || [
        {
          status: 'Received',
          timestamp: new Date(),
          note: 'Complaint submitted successfully by citizen.'
        }
      ],
      authorityNotes: data.authorityNotes || 'New complaint queued for review.'
    });

    const saved = await complaint.save();
    return {
      ...saved.toObject(),
      id: saved.id || saved._id?.toString()
    };
  }

  async updateComplaint(complaintId, updates) {
    const complaint = await Complaint.findOneAndUpdate(
      { $or: [{ id: complaintId }, { _id: complaintId }] },
      { $set: updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();

    if (!complaint) {
      throw new Error(`Complaint not found: ${complaintId}`);
    }

    return {
      ...complaint,
      id: complaint.id || complaint._id?.toString()
    };
  }

  async deleteComplaint(complaintId) {
    const result = await Complaint.findOneAndDelete({
      $or: [{ id: complaintId }, { _id: complaintId }]
    });

    if (!result) {
      throw new Error(`Complaint not found: ${complaintId}`);
    }

    return true;
  }

  async searchComplaints(query, options = {}) {
    const { limit = 50, skip = 0 } = options;
    const complaints = await Complaint.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit)
      .skip(skip)
      .lean();

    return complaints.map(doc => ({
      ...doc,
      id: doc.id || doc._id?.toString()
    }));
  }

  async getComplaintsByCategory(category, options = {}) {
    const { limit = 50, skip = 0 } = options;
    const complaints = await Complaint.find({ category })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    return complaints.map(doc => ({
      ...doc,
      id: doc.id || doc._id?.toString()
    }));
  }

  async getComplaintsByStatus(status, options = {}) {
    const { limit = 50, skip = 0 } = options;
    const complaints = await Complaint.find({ status })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean();

    return complaints.map(doc => ({
      ...doc,
      id: doc.id || doc._id?.toString()
    }));
  }
}

export const complaintService = new ComplaintService();
