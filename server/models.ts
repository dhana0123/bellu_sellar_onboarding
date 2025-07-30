import mongoose from 'mongoose';
import { type UserType, type SellerType, type EmailTokenType } from '@shared/schema';

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
}, {
  timestamps: true,
});

// Seller Schema
const sellerSchema = new mongoose.Schema({
  brandName: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  category: { type: String, required: true },
  monthlyOrders: { type: String },
  password: { type: String },
  apiKey: { type: String, required: true, unique: true },
  emailVerified: { type: Date },
  isActive: { type: Number, default: 1 },
}, {
  timestamps: true,
});

// Email Token Schema
const emailTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expireAfterSeconds: 0 } },
}, {
  timestamps: true,
});

// Create indexes
emailTokenSchema.index({ email: 1, token: 1 }, { unique: true });

export const User = mongoose.model<UserType>('User', userSchema);
export const Seller = mongoose.model<SellerType>('Seller', sellerSchema);
export const EmailToken = mongoose.model<EmailTokenType>('EmailToken', emailTokenSchema);