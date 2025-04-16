import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken, cookieOptions } from '../utils/jwt';
import { authenticate } from '../middleware/auth';
import db from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user in database
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const users = rows as any[];

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = generateToken({
      id: user.id.toString(),
      email: user.email
    });

    // Send token as HttpOnly cookie
    res.cookie('token', token, cookieOptions);

    // Return user info (without password)
    const { password: _, ...userWithoutPassword } = user;
    
    return res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Logout route
router.post('/logout', (req, res) => {
  res.clearCookie('token');
  return res.status(200).json({ message: 'Logged out successfully' });
});

// Get current user route
router.get('/me', authenticate, (req, res) => {
  // User is already attached to the request by the authenticate middleware
  return res.status(200).json({
    user: req.user
  });
});

export default router; 