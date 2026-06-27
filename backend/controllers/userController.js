import User from '../models/User.js';
import Enrollment from '../models/Enrollment.js';
import Payment from '../models/Payment.js';

/** GET /api/users/profile (self) */
export const getProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user);
};

/** PUT /api/users/profile (self) */
export const updateProfile = async (req, res) => {
  const { name, avatar, wellnessProfile } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  if (name) user.name = name;
  if (avatar) user.avatar = avatar;
  if (wellnessProfile) user.wellnessProfile = { ...user.wellnessProfile, ...wellnessProfile };

  const updated = await user.save();
  res.json(updated);
};

/** GET /api/users/me/enrollments */
export const myEnrollments = async (req, res) => {
  const list = await Enrollment.find({ user: req.user._id })
    .populate('program')
    .sort('-createdAt');
  res.json(list);
};

/** GET /api/users/me/payments */
export const myPayments = async (req, res) => {
  const list = await Payment.find({ user: req.user._id })
    .populate('program', 'title slug')
    .sort('-createdAt');
  res.json(list);
};

/* ───────────── Admin ───────────── */

/** GET /api/users  (admin) */
export const listUsers = async (_req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json(users);
};

/** PATCH /api/users/:id/role  (admin) */
export const setUserRole = async (req, res) => {
  const { role } = req.body;
  if (!['student', 'instructor', 'admin'].includes(role))
    return res.status(400).json({ message: 'Invalid role' });

  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
};

/** DELETE /api/users/:id  (admin) */
export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ message: 'User removed' });
};
