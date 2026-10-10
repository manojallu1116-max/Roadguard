import express from 'express';
import cors from 'cors';

import { validateEnv, getEnv } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

import healthRoutes from './routes/health.js';
import complaintRoutes from './routes/complaints.js';
import authRoutes from './routes/auth.js';

// Validate environment first
validateEnv();
const env = getEnv();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// Request logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// The React app is deployed independently on Vercel. Render serves this API only.
app.get('/', (_req, res) => {
  res.json({ message: 'RoadGuard API is running' });
});

// API Routes
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);

// Unknown routes are API errors; the frontend is hosted by Vercel.
app.use(notFoundHandler);

// Error handling (must be last)
app.use(errorHandler);

const startServer = (currentPort) => {
  const server = app.listen(currentPort, async () => {
    console.log(`🚀 Road Damage Reporter API running on http://localhost:${currentPort}`);

    // Connect to MongoDB after server starts listening
    try {
      await connectDatabase();
    } catch (error) {
      console.error('Failed to connect to MongoDB. API is running but database operations will fail.');
      console.error(error.message);
    }
  });

  server.on('listening', () => {
    console.log(`✓ Server listening on port ${currentPort}`);
  });

  server.on('close', () => {
    console.log('Server closed');
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${currentPort} is already in use.`);
      console.error(`Set PORT=${currentPort + 1} and try again.`);
      process.exit(1);
    }
    console.error('Server error:', error);
    process.exit(1);
  });

  // Graceful shutdown
  const handleShutdown = async (signal) => {
    console.log(`\nReceived ${signal}, shutting down gracefully...`);
    server.close(async () => {
      try {
        console.log('✓ Server shut down successfully');
        process.exit(0);
      } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      console.error('Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
};

// Global error handlers
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:');
  console.error(error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('❌ Unhandled Promise Rejection:');
  console.error(reason);
  process.exit(1);
});

// Start server
const port = env.PORT;
console.log(`Starting server on port ${port}...`);
startServer(port);
