import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const { Schema, model } = mongoose;

/**
 * User
 * Roles: student (default), instructor, admin.
 * Relationships:
 *  - User 1—N Enrollment (user field on Enrollment)
 *  - User 1—N Payment    (user field on Payment)
 *  - instructor User is referenced by Program.instructor and Class.instructor
 */
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ['student', 'instructor', 'admin'],
      default: 'student',
      index: true,
    },
    avatarUrl: { type: String },
    bio: { type: String, maxlength: 1000 },

    // Programs this user has access to (purchased/enrolled)
    enrolledPrograms: [{ type: Schema.Types.ObjectId, ref: 'Program', index: true }],

    // Wellness profile (used by program recommendations)
    profile: {
      dateOfBirth: Date,
      gender: { type: String, enum: ['female', 'male', 'non_binary', 'prefer_not_to_say'] },
      healthFocus: [
        {
          type: String,
          enum: ['pcos', 'fertility', 'weight_loss', 'meditation', 'stress_management', 'general'],
        },
      ],
      experienceLevel: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
    },

    // Virtual back-refs use these for population convenience
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.virtual('enrollments', {
  ref: 'Enrollment',
  localField: '_id',
  foreignField: 'user',
});

userSchema.virtual('payments', {
  ref: 'Payment',
  localField: '_id',
  foreignField: 'user',
});

userSchema.methods.setPassword = async function (plain) {
  this.passwordHash = await bcrypt.hash(plain, 12);
};

userSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

export default model('User', userSchema);
