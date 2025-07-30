import mongoose from 'mongoose';

// Seller Schema
const sellerSchema = new mongoose.Schema({
  brandName: { type: String, required: true },
  websiteUrl: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  category: { type: String, required: true },
  monthlyOrders: { type: String },
  apiKey: { type: String, required: true, unique: true },
  emailVerified: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Email Verification Token Schema
const emailTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create indexes for automatic cleanup
emailTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const Seller = mongoose.models.Seller || mongoose.model('Seller', sellerSchema);
export const EmailToken = mongoose.models.EmailToken || mongoose.model('EmailToken', emailTokenSchema);

// Type definitions
export interface ISeller {
  id: string;
  brandName: string;
  websiteUrl: string;
  email: string;
  phone: string;
  category: string;
  monthlyOrders?: string;
  apiKey: string;
  emailVerified?: Date | null;
  isActive: boolean;
  createdAt: Date;
}

export interface IEmailToken {
  id: string;
  email: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}