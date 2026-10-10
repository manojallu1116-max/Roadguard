import mongoose from 'mongoose';
import { z } from 'zod';

const complaintSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      sparse: true,
      default: () => `COMP-${Math.floor(1000 + Math.random() * 9000)}`
    },
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [200, 'Title must not exceed 200 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Pothole', 'Cave-in', 'Waterlogging', 'Missing Manhole', 'Broken Divider / Curb', 'Surface Cracks & Rutting']
    },
    severity: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    isHazardous: {
      type: Boolean,
      default: false
    },
    description: {
      type: String,
      trim: true,
      default: 'No additional description provided.',
      maxlength: [2000, 'Description must not exceed 2000 characters']
    },
    location: {
      address: {
        type: String,
        trim: true,
        default: 'Unknown location'
      },
      lat: {
        type: Number,
        min: -90,
        max: 90,
        default: 0
      },
      lng: {
        type: Number,
        min: -180,
        max: 180,
        default: 0
      }
    },
    photoUrl: {
      type: String,
      default: ''
    },
    status: {
      type: String,
      // "Resolved" is retained for existing MongoDB documents; new UI updates use "Completed".
      enum: ['Received', 'In Progress', 'Completed', 'Resolved', 'On Hold', 'Rejected'],
      default: 'Received'
    },
    reportedBy: {
      type: String,
      trim: true,
      default: 'Citizen User'
    },
    reportedByUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      default: null
    },
    upvotes: {
      type: Number,
      default: 1,
      min: 0
    },
    citizenRating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: null
    },
    assignedDepartment: {
      type: String,
      trim: true,
      default: 'Pending Department Assignment'
    },
    timeline: [{
      status: String,
      timestamp: { type: Date, default: Date.now },
      note: String
    }],
    authorityNotes: {
      type: String,
      trim: true,
      default: 'New complaint queued for review.'
    },
    proofPhotoUrl: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    collection: 'complaints'
  }
);

// Create text index for search
complaintSchema.index({ title: 'text', description: 'text', 'location.address': 'text' });

export const Complaint = mongoose.model('Complaint', complaintSchema);

// Validation schemas using Zod
export const createComplaintSchema = z.object({
  title: z.string().min(3).max(200),
  category: z.enum(['Pothole', 'Cave-in', 'Waterlogging', 'Missing Manhole', 'Broken Divider / Curb', 'Surface Cracks & Rutting']),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']).optional().default('Medium'),
  isHazardous: z.boolean().optional().default(false),
  description: z.string().max(2000).optional(),
  location: z.object({
    address: z.string().optional(),
    lat: z.number().min(-90).max(90).optional().default(0),
    lng: z.number().min(-180).max(180).optional().default(0)
  }).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')).default(''),
  status: z.enum(['Received', 'In Progress', 'Completed', 'Resolved', 'On Hold', 'Rejected']).optional().default('Received'),
  reportedBy: z.string().optional()
});

export const updateComplaintSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  category: z.enum(['Pothole', 'Cave-in', 'Waterlogging', 'Missing Manhole', 'Broken Divider / Curb', 'Surface Cracks & Rutting']).optional(),
  severity: z.enum(['Low', 'Medium', 'High', 'Critical']).optional(),
  isHazardous: z.boolean().optional(),
  description: z.string().max(2000).optional(),
  location: z.object({
    address: z.string().optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional()
  }).optional(),
  photoUrl: z.string().url().optional().or(z.literal('')),
  status: z.enum(['Received', 'In Progress', 'Completed', 'Resolved', 'On Hold', 'Rejected']).optional(),
  upvotes: z.number().min(0).optional(),
  citizenRating: z.enum([1, 2, 3, 4, 5]).optional().nullable(),
  assignedDepartment: z.string().optional(),
  timeline: z.array(z.object({
    status: z.string(),
    // API clients serialize JavaScript Dates as ISO strings; coerce those safely before MongoDB update.
    timestamp: z.coerce.date().optional(),
    note: z.string().optional()
  })).optional(),
  authorityNotes: z.string().optional(),
  proofPhotoUrl: z.string().url().optional().or(z.literal(''))
});
