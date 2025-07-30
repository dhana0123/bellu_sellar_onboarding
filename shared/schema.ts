import mongoose from 'mongoose';
import { z } from 'zod';

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
  monthlyOrders: { type: String, default: '' },
  apiKey: { type: String, required: true, unique: true },
  emailVerified: { type: Date, default: null },
  isActive: { type: Number, default: 1 },
}, {
  timestamps: true,
});

// Email Verification Token Schema
const emailVerificationTokenSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
}, {
  timestamps: true,
});

// Create TTL index for automatic token expiration
emailVerificationTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Models
export const User = mongoose.models.User || mongoose.model('User', userSchema);
export const Seller = mongoose.models.Seller || mongoose.model('Seller', sellerSchema);
export const EmailVerificationToken = mongoose.models.EmailVerificationToken || mongoose.model('EmailVerificationToken', emailVerificationTokenSchema);

// Zod schemas for validation
export const insertUserSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const insertSellerSchema = z.object({
  brandName: z.string().min(1, 'Brand name is required'),
  websiteUrl: z.string().url('Please enter a valid URL'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number'),
  category: z.string().min(1, 'Please select a category'),
  monthlyOrders: z.string().optional(),
});

export const insertEmailTokenSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  token: z.string().min(1, 'Token is required'),
  expiresAt: z.date(),
});

// TypeScript types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserType = {
  _id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertSeller = z.infer<typeof insertSellerSchema>;
export type SellerType = {
  _id: string;
  brandName: string;
  websiteUrl: string;
  email: string;
  phone: string;
  category: string;
  monthlyOrders?: string;
  apiKey: string;
  emailVerified?: Date;
  isActive: number;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertEmailToken = z.infer<typeof insertEmailTokenSchema>;
export type EmailTokenType = {
  _id: string;
  email: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};