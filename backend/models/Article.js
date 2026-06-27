import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Article
 * Editorial journal content. May optionally belong to a Program.
 * Relationships:
 *  - Article N—1 User    (author)
 *  - Article N—1 Program (optional program)
 */
const articleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 220 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    excerpt: { type: String, maxlength: 320 },
    body: { type: String, required: true }, // markdown / HTML
    coverImage: { type: String },

    author: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    program: { type: Schema.Types.ObjectId, ref: 'Program', default: null, index: true },

    tags: [{ type: String, lowercase: true, trim: true }],
    readTimeMinutes: { type: Number, min: 1, default: 5 },

    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: Date,

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  { timestamps: true }
);

articleSchema.index({ title: 'text', body: 'text', tags: 'text' });

export default model('Article', articleSchema);
