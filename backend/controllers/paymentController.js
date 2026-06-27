import crypto from 'crypto';
import mongoose from 'mongoose';
import Razorpay from 'razorpay';
import Payment from '../models/Payment.js';
import Enrollment from '../models/Enrollment.js';
import Program from '../models/Program.js';
import User from '../models/User.js';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/** POST /api/payments/create-order — create a Razorpay order for a program */
export const createOrder = async (req, res) => {
  try {
    const { programId } = req.body;

    if (!programId) {
      return res.status(400).json({ message: 'programId is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(programId)) {
      return res.status(400).json({ message: 'Invalid programId' });
    }

    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const amount = program.price?.amount || 0;
    const currency = program.price?.currency || 'INR';

    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: `${program._id}`,
      notes: {
        programId: program._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    return res.status(200).json({
      success: true,
      key: process.env.RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      program: program._id.toString(),
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ message: 'Unable to create payment order' });
  }
};

/** POST /api/payments/verify — verify Razorpay signature and create payment + enrollment */
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      programId,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !programId) {
      return res.status(400).json({ message: 'Missing payment verification data' });
    }

    if (!mongoose.Types.ObjectId.isValid(programId)) {
      return res.status(400).json({ message: 'Invalid programId' });
    }

    const program = await Program.findById(programId);
    if (!program) {
      return res.status(404).json({ message: 'Program not found' });
    }

    const generatedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ message: 'Invalid Razorpay signature' });
    }

    let enrollment = await Enrollment.findOne({ user: req.user._id, program: programId });
    if (!enrollment) {
      enrollment = await Enrollment.create({
        user: req.user._id,
        program: programId,
        status: 'active',
        startDate: new Date(),
      });
    } else {
      enrollment.status = 'active';
      enrollment.startDate = enrollment.startDate || new Date();
      await enrollment.save();
    }

    const payment = await Payment.create({
      user: req.user._id,
      enrollment: enrollment._id,
      program: programId,
      amount: program.price?.amount || 0,
      currency: program.price?.currency || 'INR',
      provider: 'razorpay',
      providerOrderId: razorpay_order_id,
      providerPaymentId: razorpay_payment_id,
      providerSignature: razorpay_signature,
      status: 'captured',
      paidAt: new Date(),
    });

    enrollment.payment = payment._id;
    await enrollment.save();

    await User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledPrograms: programId } });

    return res.status(200).json({ success: true, message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Verify payment error:', error);
    return res.status(500).json({ message: 'Unable to verify payment' });
  }
};

/** POST /api/payments — record a payment (after gateway success) */
export const createPayment = async (req, res) => {
  const payment = await Payment.create({ ...req.body, user: req.user._id });
  res.status(201).json(payment);
};

/** GET /api/payments  (admin) */
export const listPayments = async (_req, res) => {
  const payments = await Payment.find()
    .populate('user', 'name email')
    .populate('program', 'title slug')
    .sort('-createdAt');
  res.json(payments);
};

/** GET /api/payments/:id  (admin or owner) */
export const getPayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id)
    .populate('user', 'name email')
    .populate('program', 'title slug');
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  if (req.user.role !== 'admin' && !payment.user._id.equals(req.user._id))
    return res.status(403).json({ message: 'Forbidden' });
  res.json(payment);
};

/** PATCH /api/payments/:id/refund  (admin) */
export const refundPayment = async (req, res) => {
  const payment = await Payment.findById(req.params.id);
  if (!payment) return res.status(404).json({ message: 'Payment not found' });
  payment.status = 'refunded';
  payment.refundedAt = new Date();
  payment.refundReason = req.body.reason || 'Admin refund';
  await payment.save();
  res.json(payment);
};

/** POST /api/payments/checkout — mock checkout and enroll user in a program */
export const checkout = async (req, res) => {
  const { programId, amount = 0, currency = 'INR' } = req.body;
  if (!programId) return res.status(400).json({ message: 'programId is required' });

  const program = await Program.findById(programId);
  if (!program) return res.status(404).json({ message: 'Program not found' });

  // Create or activate an Enrollment for the user
  let enrollment = await Enrollment.findOne({ user: req.user._id, program: programId });
  if (!enrollment) {
    enrollment = await Enrollment.create({ user: req.user._id, program: programId, status: 'active', startDate: new Date() });
  } else {
    enrollment.status = 'active';
    enrollment.startDate = enrollment.startDate || new Date();
    await enrollment.save();
  }

  // Create a Payment record (mocked as captured/manual)
  const payment = await Payment.create({
    user: req.user._id,
    enrollment: enrollment._id,
    program: programId,
    amount,
    currency,
    provider: 'manual',
    status: 'captured',
    method: 'manual',
    paidAt: new Date(),
  });

  enrollment.payment = payment._id;
  await enrollment.save();

  // Add program to user's enrolledPrograms
  await User.findByIdAndUpdate(req.user._id, { $addToSet: { enrolledPrograms: programId } });

  res.status(201).json({ payment, enrollment });
};
