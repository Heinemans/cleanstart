import jwt, { SignOptions } from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../.env' });

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export interface UserPayload {
  id: string;
  email: string;
}

// Generate JWT token
export const generateToken = (payload: object) => {
  return jwt.sign(
    payload,
    process.env.JWT_SECRET as string,
    {
      expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
    } as SignOptions
  );
};

// Verify JWT token
export const verifyToken = (token: string): UserPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserPayload;
    return decoded;
  } catch (error) {
    return null;
  }
};

// Cookie options for sending JWT
export const cookieOptions = {
  httpOnly: true, // Makes cookie inaccessible to client-side JS
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
  sameSite: 'strict' as const,
  maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
}; 