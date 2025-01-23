// api/generateToken.js
import jwt from 'jsonwebtoken';

export async function generateToken(userId = 'user123') {
  const JWT_SECRET = process.env.JWT_SECRET || '256498txcbvnbmzskluy6503ifj8754903ie';
  
  try {
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate authentication token');
  }
}