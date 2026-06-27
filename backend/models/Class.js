import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Class
 * A scheduled live or on-demand session belonging to a Program.
 * Relationships:
 *  - Class N—1 Program (program)
 *  - Class N—1 User    (instructor)
 *  - Class N—N User    (attendees — Users enrolled who joined)
 */
const classSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    program: { type: Schema.Types.ObjectId, ref: 'Program', required: true, index: true },
    instructor: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },

    description: { type: String },
    focusAreas: [{ type: String }], // e.g. 'pranayama', 'hatha', 'restorative'

    mode: { type: String, enum: ['live', 'on_demand'], default: 'live', index: true },
    scheduledAt: { type: Date, index: true },
    durationMinutes: { type: Number, min: 5, max: 240, default: 60 },
    timezone: { type: String, default: 'Asia/Kolkata' },

    meetingUrl: { type: String },     // for live
    recordingUrl: { type: String },   // populated after live, or set for on_demand
    coverImage: { type: String },

    capacity: { type: Number, min: 0, default: 0 }, // 0 = unlimited
    attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],

    status: {
      type: String,
      enum: ['scheduled', 'live', 'completed', 'cancelled'],
      default: 'scheduled',
      index: true,
    },
  },
  { timestamps: true }
);

classSchema.index({ program: 1, scheduledAt: 1 });

export default model('Class', classSchema);
