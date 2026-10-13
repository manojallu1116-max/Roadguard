import express from 'express';
import { complaintController } from '../controllers/complaintController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireApprovedAuthority } from '../middleware/authorityMiddleware.js';

const router = express.Router();

// List all complaints
router.get('/', authenticate, requireApprovedAuthority, (req, res, next) => complaintController.listComplaints(req, res, next));

// Citizen status dashboard: only the authenticated user's submitted reports.
router.get('/mine', authenticate, (req, res, next) => complaintController.listMyComplaints(req, res, next));

// Community browsing returns only report details intended for other signed-in citizens.
router.get('/community', authenticate, (req, res, next) => complaintController.listCommunityComplaints(req, res, next));

// Search complaints
router.get('/search', authenticate, requireApprovedAuthority, (req, res, next) => complaintController.searchComplaints(req, res, next));

// Get complaints by category
router.get('/category/:category', authenticate, requireApprovedAuthority, (req, res, next) => complaintController.getComplaintsByCategory(req, res, next));

// Get complaints by status
router.get('/status/:status', authenticate, requireApprovedAuthority, (req, res, next) => complaintController.getComplaintsByStatus(req, res, next));

// Create complaint
router.post('/', authenticate, (req, res, next) => complaintController.createComplaint(req, res, next));

// Get single complaint
router.get('/:id', authenticate, requireApprovedAuthority, (req, res, next) => complaintController.getComplaint(req, res, next));

// Update complaint
router.put('/:id', authenticate, (req, res, next) => complaintController.updateComplaint(req, res, next));

// Delete complaint
router.delete('/:id', authenticate, requireApprovedAuthority, (req, res, next) => complaintController.deleteComplaint(req, res, next));

export default router;
