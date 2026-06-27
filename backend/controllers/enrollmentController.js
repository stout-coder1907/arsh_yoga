import Enrollment from '../models/Enrollment.js';
import Program from '../models/Program.js';

/** POST /api/enrollments  { program, payment? } */
export const enroll = async (req, res) => {
  const { program, payment } = req.body;
  const exists = await Program.findById(program);
  if (!exists) return res.status(404).json({ message: 'Program not found' });

  try {
    const enrollment = await Enrollment.create({
      user: req.user._id,
      program,
      payment,
      status: 'active',
    });
    res.status(201).json(enrollment);
  } catch (err) {
    if (err.code === 11000)
      return res.status(409).json({ message: 'Already enrolled in this program' });
    res.status(500).json({ message: err.message });
  }
};

/** PATCH /api/enrollments/:id/progress */
export const updateProgress = async (req, res) => {
  const { completedClass, watchedVideo, percent } = req.body;
  const enrollment = await Enrollment.findOne({ _id: req.params.id, user: req.user._id });
  if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });

  if (completedClass && !enrollment.progress.completedClasses.includes(completedClass))
    enrollment.progress.completedClasses.push(completedClass);
  if (watchedVideo && !enrollment.progress.watchedVideos.includes(watchedVideo))
    enrollment.progress.watchedVideos.push(watchedVideo);
  if (typeof percent === 'number') enrollment.progress.percent = percent;

  await enrollment.save();
  res.json(enrollment);
};

/** GET /api/enrollments  (admin) */
export const listEnrollments = async (_req, res) => {
  const list = await Enrollment.find()
    .populate('user', 'name email')
    .populate('program', 'title slug')
    .sort('-createdAt');
  res.json(list);
};
