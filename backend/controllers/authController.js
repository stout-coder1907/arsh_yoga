import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { generateToken, generateResetToken } from '../utils/generateToken.js';

/* ───────────────────────────────────────────────
   REGISTER
────────────────────────────────────────────── */
export const register = async (req, res) => {
  try {
    const { name, email, password, healthFocus, experienceLevel, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email and password are required',
      });
    }

    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) {
      return res.status(409).json({
        message: 'Email already registered',
      });
    }

    // 🔐 HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash: hashedPassword,
      role: role || 'student',
      wellnessProfile: {
        healthFocus,
        experienceLevel,
      },
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};

/* ───────────────────────────────────────────────
   LOGIN
────────────────────────────────────────────── */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: (email || '').toLowerCase(),
    }).select('+passwordHash');

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ───────────────────────────────────────────────
   FORGOT PASSWORD
────────────────────────────────────────────── */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({
      email: (email || '').toLowerCase(),
    });

    if (!user) {
      return res.json({
        message: 'If that email exists, a reset link has been sent.',
      });
    }

    const resetToken = generateResetToken(user._id);

    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

    console.log(`🔑 Reset link: ${resetUrl}`);

    return res.json({
      message: 'If that email exists, a reset link has been sent.',
      ...(process.env.NODE_ENV !== 'production' && { resetUrl }),
    });

  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

/* ───────────────────────────────────────────────
   RESET PASSWORD
────────────────────────────────────────────── */
export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        message: 'Token and new password required',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET);

    if (decoded.purpose !== 'pwd_reset') {
      return res.status(400).json({
        message: 'Invalid reset token',
      });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found',
      });
    }

    // 🔐 HASH NEW PASSWORD
    user.passwordHash = await bcrypt.hash(password, 10);
    await user.save();

    return res.json({
      message: 'Password updated. Please log in.',
    });

  } catch (err) {
    return res.status(400).json({
      message: 'Reset token invalid or expired',
    });
  }
};

/* ───────────────────────────────────────────────
   ME (CURRENT USER)
────────────────────────────────────────────── */
export const me = async (req, res) => {
  return res.json(req.user);
};