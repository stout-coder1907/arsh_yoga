import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Program
 * Curated wellness journeys: PCOS, Fertility, Weight Loss, Meditation, Stress Management.
 * Relationships:
 *  - Program N—1 User (instructor)
 *  - Program 1—N Class      (Class.program)
 *  - Program 1—N Article    (Article.program)
 *  - Program 1—N Video      (Video.program)
 *  - Program 1—N Enrollment (Enrollment.program)
 */
const programSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, lowercase: true, index: true },
    category: {
      type: String,
      required: true,
      enum: ['pcos', 'fertility', 'weight_loss', 'meditation', 'stress_management'],
      index: true,
    },
    tagline: { type: String, maxlength: 220 },
    description: { type: String, required: true },
    benefits: [{ type: String }],
    level: { type: String, enum: ['beginner', 'intermediate', 'advanced', 'all'], default: 'all' },
    durationWeeks: { type: Number, min: 1, max: 104, required: true },
    sessionsPerWeek: { type: Number, min: 1, max: 14, default: 3 },
    language: { type: String, default: 'English' },

    coverImage: { type: String },
    gallery: [{ type: String }],

    price: {
      amount: { type: Number, required: true, min: 0 }, // in smallest currency unit (paise)
      currency: { type: String, default: 'INR', uppercase: true, minlength: 3, maxlength: 3 },
    },

    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

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

programSchema.virtual('classes', {
  ref: 'Class',
  localField: '_id',
  foreignField: 'program',
});
programSchema.virtual('articles', {
  ref: 'Article',
  localField: '_id',
  foreignField: 'program',
});
programSchema.virtual('videos', {
  ref: 'Video',
  localField: '_id',
  foreignField: 'program',
});
programSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'program',
});

programSchema.set('toJSON', { virtuals: true });
programSchema.set('toObject', { virtuals: true });

export default model('Program', programSchema);
