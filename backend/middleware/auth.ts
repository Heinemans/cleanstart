import { Request, Response, NextFunction } from 'express';
import { verifyToken, UserPayload } from '../utils/jwt';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}

// Authentication middleware
export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Get token from cookies
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  // Verify token
  const user = verifyToken(token);

  if (!user) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Set user in request
  req.user = user;
  next();
};

// Helper function to get authenticated user from request
export const getAuthUser = (req: Request): UserPayload | null => {
  return req.user || null;
}; 