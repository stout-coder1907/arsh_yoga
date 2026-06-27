import Article from '../models/Article.js';

/** GET /api/articles — public journal */
export const listArticles = async (req, res) => {
  const { program, tag } = req.query;
  const filter = { isPublished: true };
  if (program) filter.program = program;
  if (tag) filter.tags = tag;
  const articles = await Article.find(filter)
    .populate('author', 'name avatar')
    .sort('-publishedAt');
  res.json(articles);
};

export const getArticle = async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug })
    .populate('author', 'name avatar bio')
    .populate('program', 'title slug');
  if (!article) return res.status(404).json({ message: 'Article not found' });
  res.json(article);
};

export const createArticle = async (req, res) => {
  const article = await Article.create({ ...req.body, author: req.user._id });
  res.status(201).json(article);
};

export const updateArticle = async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!article) return res.status(404).json({ message: 'Article not found' });
  res.json(article);
};

export const deleteArticle = async (req, res) => {
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) return res.status(404).json({ message: 'Article not found' });
  res.json({ message: 'Article removed' });
};
