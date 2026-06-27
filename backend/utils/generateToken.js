import jwt from 'jsonwebtoken';

export const generateToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

export const generateResetToken = (userId) =>
  jwt.sign({ id: userId, purpose: 'pwd_reset' }, process.env.JWT_RESET_SECRET, {
    expiresIn: process.env.JWT_RESET_EXPIRES_IN || '15m',
  });

export default generateToken;
