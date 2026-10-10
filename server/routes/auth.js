import express from 'express';
import { authController } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { requireApprovedAuthority } from '../middleware/authorityMiddleware.js';

const router = express.Router();
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/me', authenticate, authController.currentUser);
router.get('/authority', authenticate, requireApprovedAuthority, authController.currentUser);
router.post('/logout', authenticate, authController.logout);
export default router;
