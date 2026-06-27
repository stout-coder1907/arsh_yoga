import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Enrollment
 * Join table between User and Program, with progress + lifecycle.
 * Relationships:
 *  - Enrollment N—1 User
 *  - Enrollment N—1 Program
 *  - Enrollment 1—1 Payment (settled via Payment.enrollment)
 */
const enrollmentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    program: { type: Schema.Types.ObjectId, ref: 'Program', required: true, index: true },

    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled', 'expired'],
      default: 'pending',
      index: true,
    },
    startDate: { type: Date, default: Date.now },
    endDate: Date,
    completedAt: Date,

    progress: {
      completedClasses: [{ type: Schema.Types.ObjectId, ref: 'Class' }],
      watchedVideos: [{ type: Schema.Types.ObjectId, ref: 'Video' }],
      percent: { type: Number, min: 0, max: 100, default: 0 },
      lastActivityAt: Date,
    },

    payment: { type: Schema.Types.ObjectId, ref: 'Payment', default: null },

    notes: { type: String, maxlength: 2000 },
  },
  { timestamps: true }
);

// One active enrollment per (user, program)
enrollmentSchema.index({ user: 1, program: 1 }, { unique: true });

export default model('Enrollment', enrollmentSchema);
