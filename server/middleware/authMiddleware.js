import jwt from 'jsonwebtoken';
import { getEnv } from '../config/env.js';
import { User } from '../models/User.js';

export async function authenticate(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ')
    ? req.headers.authorization.slice(7)
    : null;

  if (!token) return res.status(401).json({ error: 'Authentication required' });

  try {
    const { JWT_SECRET } = getEnv();
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub).select('name email phone role isApproved createdAt').lean();
    if (!user) return res.status(401).json({ error: 'Account no longer exists' });
    req.user = user;
    next();
  } catch (_error) {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }
}
