import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { getEnv } from '../config/env.js';
import { User } from '../models/User.js';

const registerSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().transform(value => value.toLowerCase()),
  phone: z.string().trim().min(6).max(30),
  password: z.string().min(8).max(128)
});
const loginSchema = z.object({
  email: z.string().trim().email().transform(value => value.toLowerCase()),
  password: z.string().min(1).max(128)
});

const serializeUser = user => ({
  id: user._id.toString(), name: user.name, email: user.email, phone: user.phone,
  role: user.role, isApproved: user.isApproved, createdAt: user.createdAt
});

const createToken = user => {
  const { JWT_SECRET, JWT_EXPIRES_IN } = getEnv();
  return jwt.sign({ sub: user._id.toString(), role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const authController = {
  async register(req, res, next) {
    try {
      const { name, email, phone, password } = registerSchema.parse(req.body);
      const existingUser = await User.findOne({ email }).lean();
      if (existingUser) return res.status(409).json({ error: 'An account already exists for this email' });
      const passwordHash = await bcrypt.hash(password, 12);
      // Deliberately do not read role/isApproved from the request body.
      const user = await User.create({ name, email, phone, password: passwordHash, role: 'citizen', isApproved: false });
      return res.status(201).json({ message: 'Registration successful. Please sign in.', user: serializeUser(user) });
    } catch (error) { next(error); }
  },

  async login(req, res, next) {
    try {
      const { email, password } = loginSchema.parse(req.body);
      const user = await User.findOne({ email }).select('+password');
      if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }
      if ((user.role === 'admin' || user.role === 'authority') && !user.isApproved) {
        return res.status(403).json({ error: 'Your admin account is awaiting approval' });
      }
      return res.json({ token: createToken(user), user: serializeUser(user) });
    } catch (error) { next(error); }
  },

  async currentUser(req, res) { return res.json({ user: serializeUser(req.user) }); },
  async logout(_req, res) { return res.json({ message: 'Logged out successfully' }); }
};
