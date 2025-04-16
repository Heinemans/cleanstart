import express, { Request, Response } from 'express';
import { authenticate, getAuthUser } from '../middleware/auth';
import db from '../config/db';

const router = express.Router();

// Get all users route
router.get('/users', async (req: Request, res: Response) => {
  try {
    const [rows] = await db.query('SELECT id, email, name, created_at FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get user profile route
router.get('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const user = getAuthUser(req);
    
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    // Get user details from database
    const [rows] = await db.execute(
      'SELECT id, email, name, created_at FROM users WHERE id = ?',
      [user.id]
    );
    
    const users = rows as any[];
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    return res.status(200).json({
      user: users[0]
    });
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile route
router.put('/profile', authenticate, async (req: Request, res: Response) => {
  try {
    const user = getAuthUser(req);
    const { name } = req.body;
    
    if (!user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    
    // Update user in database
    await db.execute(
      'UPDATE users SET name = ? WHERE id = ?',
      [name, user.id]
    );
    
    return res.status(200).json({
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router; 