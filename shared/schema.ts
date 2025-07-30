import { z } from 'zod';

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
  id: string;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertSeller = z.infer<typeof insertSellerSchema>;
export type SellerType = {
  id: string;
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
  id: string;
  email: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};