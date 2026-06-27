import Video from '../models/Video.js';

export const listVideos = async (req, res) => {
  const { program } = req.query;
  const filter = { isPublished: true };
  if (program) filter.program = program;
  const videos = await Video.find(filter).populate('program', 'title slug').sort('-createdAt');
  res.json(videos);
};

export const getVideo = async (req, res) => {
  const video = await Video.findById(req.params.id).populate('program', 'title slug');
  if (!video) return res.status(404).json({ message: 'Video not found' });
  res.json(video);
};

export const createVideo = async (req, res) => {
  const video = await Video.create({ ...req.body, uploadedBy: req.user._id });
  res.status(201).json(video);
};

export const updateVideo = async (req, res) => {
  const video = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!video) return res.status(404).json({ message: 'Video not found' });
  res.json(video);
};

export const deleteVideo = async (req, res) => {
  const video = await Video.findByIdAndDelete(req.params.id);
  if (!video) return res.status(404).json({ message: 'Video not found' });
  res.json({ message: 'Video removed' });
};
