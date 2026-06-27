import mongoose from 'mongoose';

const { Schema, model } = mongoose;

/**
 * Payment
 * Records a transaction made by a User for an Enrollment (Program purchase).
 * Relationships:
 *  - Payment N—1 User
 *  - Payment 1—1 Enrollment
 *  - Payment N—1 Program (denormalized for reporting)
 */
const paymentSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    enrollment: {
      type: Schema.Types.ObjectId,
      ref: 'Enrollment',
      required: true,
      unique: true,
      index: true,
    },
    program: { type: Schema.Types.ObjectId, ref: 'Program', required: true, index: true },

    amount: { type: Number, required: true, min: 0 }, // smallest unit (paise)
    currency: { type: String, default: 'INR', uppercase: true, minlength: 3, maxlength: 3 },

    provider: {
      type: String,
      enum: ['razorpay', 'stripe', 'paypal', 'manual'],
      required: true,
    },
    providerOrderId: { type: String, index: true },
    providerPaymentId: { type: String, index: true },
    providerSignature: { type: String },

    status: {
      type: String,
      enum: ['created', 'authorized', 'captured', 'failed', 'refunded', 'partially_refunded'],
      default: 'created',
      index: true,
    },

    method: { type: String }, // card / upi / netbanking / wallet
    receiptUrl: { type: String },
    invoiceNumber: { type: String, unique: true, sparse: true },

    refund: {
      amount: { type: Number, min: 0 },
      reason: String,
      refundedAt: Date,
      providerRefundId: String,
    },

    metadata: { type: Schema.Types.Mixed },
    paidAt: Date,
  },
  { timestamps: true }
);

paymentSchema.index({ user: 1, createdAt: -1 });

export default model('Payment', paymentSchema);
