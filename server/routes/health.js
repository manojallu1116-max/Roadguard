import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/health', (_req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    mongodb: mongoStatus
  });
});

export default router;
