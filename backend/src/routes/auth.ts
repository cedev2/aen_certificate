import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin';
import { authenticate } from '../middleware/auth';
import { AuthRequest } from '../types';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret';
    const token = jwt.sign(
      { userId: admin._id, role: admin.role },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as any
    );

    res.json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const admin = await Admin.findById(req.userId).select('-passwordHash');
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found.' });
    }
    res.json({ user: admin });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user.' });
  }
});

// POST /api/auth/logout (client-side token removal)
router.post('/logout', (_req, res) => {
  res.json({ message: 'Logged out successfully.' });
});

export default router;
