import Class from '../models/Class.js';
import Enrollment from '../models/Enrollment.js';

/** GET /api/classes — public, supports ?program=&type=live|on_demand&upcoming=1 */
export const listClasses = async (req, res) => {
  const { program, type, upcoming } = req.query;
  const filter = {};
  if (program) filter.program = program;
  if (type) filter.type = type;
  if (upcoming) filter.scheduledAt = { $gte: new Date() };
  const classes = await Class.find(filter)
    .populate('instructor', 'name avatar')
    .populate('program', 'title slug')
    .sort('scheduledAt');
  res.json(classes);
};

export const adminListClasses = async (req, res) => {
  const now = new Date();
  const classes = await Class.find({})
    .populate('program', 'title slug')
    .sort({ scheduledAt: 1 });

  const upcoming = classes
    .filter((classItem) => new Date(classItem.scheduledAt) > now)
    .map((classItem) => ({
      _id: classItem._id,
      title: classItem.title,
      programName: classItem.program?.title || '—',
      scheduledAt: classItem.scheduledAt,
      status: 'Upcoming',
    }));

  const past = classes
    .filter((classItem) => new Date(classItem.scheduledAt) <= now)
    .map((classItem) => ({
      _id: classItem._id,
      title: classItem.title,
      programName: classItem.program?.title || '—',
      scheduledAt: classItem.scheduledAt,
      status: 'Completed',
    }))
    .sort((a, b) => new Date(b.scheduledAt) - new Date(a.scheduledAt));

  res.json({ upcoming, past });
};

/** GET /api/classes/:id */
export const getClass = async (req, res) => {
  const c = await Class.findById(req.params.id)
    .populate('instructor', 'name avatar bio')
    .populate('program', 'title slug');
  if (!c) return res.status(404).json({ message: 'Class not found' });
  res.json(c);
};

/** POST /api/classes (instructor/admin) */
export const createClass = async (req, res) => {
  const c = await Class.create({ ...req.body, instructor: req.body.instructor || req.user._id });
  res.status(201).json(c);
};

export const studentViewClasses = async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id, status: 'active' }).select('program');
  const enrolledProgramIds = enrollments.map((entry) => entry.program).filter(Boolean);

  if (!enrolledProgramIds.length) {
    return res.json({ data: [] });
  }

  const classes = await Class.find({
    scheduledAt: { $gte: new Date() },
    program: { $in: enrolledProgramIds },
  })
    .populate('instructor', 'name avatar')
    .populate('program', 'title slug')
    .sort('scheduledAt');

  res.json({ data: classes });
};

export const updateClass = async (req, res) => {
  const c = await Class.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!c) return res.status(404).json({ message: 'Class not found' });
  res.json(c);
};

export const deleteClass = async (req, res) => {
  const c = await Class.findByIdAndDelete(req.params.id);
  if (!c) return res.status(404).json({ message: 'Class not found' });
  res.json({ message: 'Class removed' });
};

/** POST /api/classes/:id/join — authenticated student */
export const joinClass = async (req, res) => {
  const c = await Class.findById(req.params.id);
  if (!c) return res.status(404).json({ message: 'Class not found' });
  if (!c.attendees.some((id) => id.equals(req.user._id))) {
    c.attendees.push(req.user._id);
    await c.save();
  }
  res.json({ message: 'Joined class', class: c });
};
