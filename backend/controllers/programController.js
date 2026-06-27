import Program from '../models/Program.js';
import Video from '../models/Video.js';

/** GET /api/programs — public */
export const listPrograms = async (req, res) => {
  const { category, level, published } = req.query;
  const filter = {};

  if (published !== 'false') {
    filter.isPublished = true;
  }
  if (category) filter.category = category;
  if (level) filter.level = level;

  const programs = await Program.find(filter).sort('-createdAt');
  res.json(programs);
};

/** GET /api/programs/:slug — public */
export const getProgram = async (req, res) => {
  const program = await Program.findOne({ slug: req.params.slug })
    .populate('classes')
    .populate('articles')
    .populate('videos');
  if (!program) return res.status(404).json({ message: 'Program not found' });
  res.json(program);
};

/** GET /api/programs/:id/lectures — public */
export const getProgramLectures = async (req, res) => {
  const program = await Program.findById(req.params.id).select('_id');
  if (!program) return res.status(404).json({ message: 'Program not found' });

  const lectures = await Video.find({ program: req.params.id, isPublished: true }).sort('-createdAt');
  res.json(lectures);
};

/** POST /api/programs (admin) */
export const createProgram = async (req, res) => {
  const program = await Program.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(program);
};

/** PUT /api/programs/:id (admin) */
export const updateProgram = async (req, res) => {
  const program = await Program.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!program) return res.status(404).json({ message: 'Program not found' });
  res.json(program);
};

/** DELETE /api/programs/:id (admin) */
export const deleteProgram = async (req, res) => {
  const program = await Program.findByIdAndDelete(req.params.id);
  if (!program) return res.status(404).json({ message: 'Program not found' });
  res.json({ message: 'Program removed' });
};
