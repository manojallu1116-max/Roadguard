import { complaintService } from '../services/complaintService.js';
import { createComplaintSchema, updateComplaintSchema } from '../models/Complaint.js';

export class ComplaintController {
  async listComplaints(req, res, next) {
    try {
      const limit = Math.min(parseInt(req.query.limit) || 100, 1000);
      const skip = Math.max(parseInt(req.query.skip) || 0, 0);
      
      const complaints = await complaintService.listComplaints({ limit, skip });
      res.json(complaints);
    } catch (error) {
      next(error);
    }
  }

  async getComplaint(req, res, next) {
    try {
      const complaint = await complaintService.getComplaintById(req.params.id);
      res.json(complaint);
    } catch (error) {
      next(error);
    }
  }

  async createComplaint(req, res, next) {
    try {
      const validatedData = createComplaintSchema.parse(req.body);
      const complaint = await complaintService.createComplaint(validatedData, req.user);
      res.status(201).json(complaint);
    } catch (error) {
      next(error);
    }
  }

  async listMyComplaints(req, res, next) {
    try {
      const limit = Math.min(parseInt(req.query.limit) || 100, 1000);
      const skip = Math.max(parseInt(req.query.skip) || 0, 0);
      const complaints = await complaintService.listComplaintsForUser(req.user._id, { limit, skip });
      res.json(complaints);
    } catch (error) {
      next(error);
    }
  }

  async updateComplaint(req, res, next) {
    try {
      const validatedData = updateComplaintSchema.parse(req.body);
      const isAdminRole = req.user?.role === 'admin' || req.user?.role === 'authority';
      const isApprovedAdmin = isAdminRole && req.user?.isApproved;
      const adminOnlyFields = ['status', 'assignedDepartment', 'authorityNotes', 'proofPhotoUrl', 'timeline'];
      const isAdministrativeUpdate = Object.keys(validatedData).some(field => adminOnlyFields.includes(field));

      if (isAdministrativeUpdate && !isApprovedAdmin) {
        return res.status(403).json({ error: 'Only approved admins can update complaint status or repair details' });
      }

      if (!isApprovedAdmin) {
        const complaint = await complaintService.getComplaintById(req.params.id);
        if (String(complaint.reportedByUserId) !== String(req.user._id)) {
          return res.status(403).json({ error: 'You can only update your own report' });
        }
        const requestedFields = Object.keys(validatedData);
        if (requestedFields.some(field => !['upvotes', 'citizenRating'].includes(field))) {
          return res.status(403).json({ error: 'Citizens can only upvote or rate their own report' });
        }
      }
      const complaint = await complaintService.updateComplaint(req.params.id, validatedData);
      res.json(complaint);
    } catch (error) {
      next(error);
    }
  }

  async deleteComplaint(req, res, next) {
    try {
      await complaintService.deleteComplaint(req.params.id);
      res.json({ message: 'Complaint deleted successfully' });
    } catch (error) {
      next(error);
    }
  }

  async searchComplaints(req, res, next) {
    try {
      const { q } = req.query;
      if (!q || q.trim().length < 2) {
        return res.status(400).json({ error: 'Search query must be at least 2 characters' });
      }
      const complaints = await complaintService.searchComplaints(q, {
        limit: Math.min(parseInt(req.query.limit) || 50, 500),
        skip: Math.max(parseInt(req.query.skip) || 0, 0)
      });
      res.json(complaints);
    } catch (error) {
      next(error);
    }
  }

  async getComplaintsByCategory(req, res, next) {
    try {
      const { category } = req.params;
      const complaints = await complaintService.getComplaintsByCategory(category, {
        limit: Math.min(parseInt(req.query.limit) || 50, 500),
        skip: Math.max(parseInt(req.query.skip) || 0, 0)
      });
      res.json(complaints);
    } catch (error) {
      next(error);
    }
  }

  async getComplaintsByStatus(req, res, next) {
    try {
      const { status } = req.params;
      const complaints = await complaintService.getComplaintsByStatus(status, {
        limit: Math.min(parseInt(req.query.limit) || 50, 500),
        skip: Math.max(parseInt(req.query.skip) || 0, 0)
      });
      res.json(complaints);
    } catch (error) {
      next(error);
    }
  }
}

export const complaintController = new ComplaintController();
