import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Video
 * On-demand video content. May belong to a Program and/or a specific Class recording.
 * Relationships:
 *  - Video N—1 Program (optional)
 *  - Video N—1 Class   (optional — when this video is a class recording)
 *  - Video N—1 User    (instructor)
 */
const videoSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 220 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String },

    program: { type: Schema.Types.ObjectId, ref: 'Program', default: null, index: true },
    classRef: { type: Schema.Types.ObjectId, ref: 'Class', default: null, index: true },
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    videoUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    durationSeconds: { type: Number, min: 1, required: true },

    accessTier: {
      type: String,
      enum: ['free', 'enrolled', 'premium'],
      default: 'enrolled',
      index: true,
    },

    tags: [{ type: String, lowercase: true, trim: true }],
    views: { type: Number, default: 0, min: 0 },

    isPublished: { type: Boolean, default: false, index: true },
    publishedAt: Date,
  },
  { timestamps: true }
);

export default model('Video', videoSchema);
