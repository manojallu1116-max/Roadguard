import { z } from 'zod';
import mongoose from 'mongoose';

export function errorHandler(err, _req, res, _next) {
  console.error('Error Handler - Full error object:');
  console.error(err);

  // Zod validation errors
  if (err instanceof z.ZodError) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.errors.map(e => ({
        field: e.path.join('.'),
        message: e.message,
        code: e.code
      }))
    });
  }

  // MongoDB validation errors
  if (err instanceof mongoose.Error.ValidationError) {
    const details = Object.entries(err.errors).map(([field, error]) => ({
      field,
      message: error.message
    }));
    return res.status(400).json({
      error: 'MongoDB validation failed',
      details
    });
  }

  // MongoDB duplicate key errors
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({
      error: `Duplicate entry: ${field} already exists`,
      field
    });
  }

  // MongoDB cast errors (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({
      error: 'Invalid ID format',
      details: `${err.path} must be a valid MongoDB ID`
    });
  }

  // Generic "not found" errors
  if (err.message && err.message.includes('not found')) {
    return res.status(404).json({
      error: err.message
    });
  }

  // MongoDB connection errors
  if (err.name === 'MongoNetworkError' || err.name === 'MongoAuthenticationError') {
    console.error('MongoDB Connection Error:', err.message);
    return res.status(503).json({
      error: 'Database connection failed',
      message: process.env.NODE_ENV === 'production' ? 'Service temporarily unavailable' : err.message
    });
  }

  // Generic application errors
  const statusCode = err.statusCode || 500;
  const isDevelopment = process.env.NODE_ENV !== 'production';

  res.status(statusCode).json({
    error: err.message || 'Internal server error',
    type: err.constructor?.name,
    ...(isDevelopment && { stack: err.stack })
  });
}

export function notFoundHandler(_req, res) {
  res.status(404).json({
    error: 'Endpoint not found'
  });
}

export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
