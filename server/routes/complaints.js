import express from 'express';
import { complaintController } from '../controllers/complaintController.js';

const router = express.Router();

// List all complaints
router.get('/', (req, res, next) => complaintController.listComplaints(req, res, next));

// Search complaints
router.get('/search', (req, res, next) => complaintController.searchComplaints(req, res, next));

// Get complaints by category
router.get('/category/:category', (req, res, next) => complaintController.getComplaintsByCategory(req, res, next));

// Get complaints by status
router.get('/status/:status', (req, res, next) => complaintController.getComplaintsByStatus(req, res, next));

// Create complaint
router.post('/', (req, res, next) => complaintController.createComplaint(req, res, next));

// Get single complaint
router.get('/:id', (req, res, next) => complaintController.getComplaint(req, res, next));

// Update complaint
router.put('/:id', (req, res, next) => complaintController.updateComplaint(req, res, next));

// Delete complaint
router.delete('/:id', (req, res, next) => complaintController.deleteComplaint(req, res, next));

export default router;
