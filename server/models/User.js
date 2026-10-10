import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  password: { type: String, required: true, select: false },
  // Roles are intentionally not editable through the application. Update this field directly in MongoDB.
  role: { type: String, enum: ['citizen', 'admin', 'authority'], default: 'citizen', immutable: true },
  isApproved: { type: Boolean, default: false }
}, { timestamps: { createdAt: true, updatedAt: false }, collection: 'users' });

export const User = mongoose.model('User', userSchema);
