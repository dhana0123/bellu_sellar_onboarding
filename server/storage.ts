import { 
  User, 
  Seller, 
  EmailVerificationToken,
  type UserType, 
  type SellerType, 
  type EmailTokenType,
  type InsertUser, 
  type InsertSeller, 
  type InsertEmailToken 
} from "@shared/schema";
import connectDB from "./db";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<UserType | undefined>;
  getUserByUsername(username: string): Promise<UserType | undefined>;
  createUser(user: InsertUser): Promise<UserType>;
  createSeller(seller: InsertSeller): Promise<SellerType>;
  getSellerById(id: string): Promise<SellerType | undefined>;
  getSellerByEmail(email: string): Promise<SellerType | undefined>;
  getSellerByApiKey(apiKey: string): Promise<SellerType | undefined>;
  updateSellerVerification(id: string, emailVerified?: boolean): Promise<SellerType | undefined>;
  updateSellerApiKey(id: string, apiKey: string): Promise<SellerType | undefined>;
  createEmailToken(token: InsertEmailToken): Promise<EmailTokenType>;
  getEmailToken(email: string, token: string): Promise<EmailTokenType | undefined>;
  deleteEmailToken(email: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Ensure database connection on initialization
    connectDB().catch(console.error);
  }

  async getUser(id: string): Promise<UserType | undefined> {
    await connectDB();
    const user = await User.findById(id).lean();
    return user ? { 
      _id: user._id.toString(),
      username: user.username,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } : undefined;
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    await connectDB();
    const user = await User.findOne({ username }).lean();
    return user ? { 
      _id: user._id.toString(),
      username: user.username,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    } : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<UserType> {
    await connectDB();
    const user = new User(insertUser);
    await user.save();
    return { 
      _id: user._id.toString(),
      username: user.username,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }

  async createSeller(insertSeller: InsertSeller): Promise<SellerType> {
    await connectDB();
    const apiKey = `bk_seller_${randomUUID().replace(/-/g, '').substring(0, 16)}`;
    
    const seller = new Seller({
      ...insertSeller,
      apiKey,
    });
    await seller.save();
    return { 
      _id: seller._id.toString(),
      brandName: seller.brandName,
      websiteUrl: seller.websiteUrl,
      email: seller.email,
      phone: seller.phone,
      category: seller.category,
      monthlyOrders: seller.monthlyOrders,
      apiKey: seller.apiKey,
      emailVerified: seller.emailVerified,
      isActive: seller.isActive,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt
    };
  }

  async getSellerById(id: string): Promise<SellerType | undefined> {
    await connectDB();
    const seller = await Seller.findById(id).lean();
    return seller ? { 
      _id: seller._id.toString(),
      brandName: seller.brandName,
      websiteUrl: seller.websiteUrl,
      email: seller.email,
      phone: seller.phone,
      category: seller.category,
      monthlyOrders: seller.monthlyOrders,
      apiKey: seller.apiKey,
      emailVerified: seller.emailVerified,
      isActive: seller.isActive,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt
    } : undefined;
  }

  async getSellerByEmail(email: string): Promise<SellerType | undefined> {
    await connectDB();
    const seller = await Seller.findOne({ email }).lean();
    return seller ? { 
      _id: seller._id.toString(),
      brandName: seller.brandName,
      websiteUrl: seller.websiteUrl,
      email: seller.email,
      phone: seller.phone,
      category: seller.category,
      monthlyOrders: seller.monthlyOrders,
      apiKey: seller.apiKey,
      emailVerified: seller.emailVerified,
      isActive: seller.isActive,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt
    } : undefined;
  }

  async getSellerByApiKey(apiKey: string): Promise<SellerType | undefined> {
    await connectDB();
    const seller = await Seller.findOne({ apiKey }).lean();
    return seller ? { 
      _id: seller._id.toString(),
      brandName: seller.brandName,
      websiteUrl: seller.websiteUrl,
      email: seller.email,
      phone: seller.phone,
      category: seller.category,
      monthlyOrders: seller.monthlyOrders,
      apiKey: seller.apiKey,
      emailVerified: seller.emailVerified,
      isActive: seller.isActive,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt
    } : undefined;
  }

  async updateSellerVerification(id: string, emailVerified?: boolean): Promise<SellerType | undefined> {
    await connectDB();
    const updates: any = {};
    if (emailVerified !== undefined) {
      updates.emailVerified = emailVerified ? new Date() : null;
    }

    const seller = await Seller.findByIdAndUpdate(id, updates, { new: true }).lean();
    return seller ? { 
      _id: seller._id.toString(),
      brandName: seller.brandName,
      websiteUrl: seller.websiteUrl,
      email: seller.email,
      phone: seller.phone,
      category: seller.category,
      monthlyOrders: seller.monthlyOrders,
      apiKey: seller.apiKey,
      emailVerified: seller.emailVerified,
      isActive: seller.isActive,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt
    } : undefined;
  }

  async updateSellerApiKey(id: string, apiKey: string): Promise<SellerType | undefined> {
    await connectDB();
    const seller = await Seller.findByIdAndUpdate(id, { apiKey }, { new: true }).lean();
    return seller ? { 
      _id: seller._id.toString(),
      brandName: seller.brandName,
      websiteUrl: seller.websiteUrl,
      email: seller.email,
      phone: seller.phone,
      category: seller.category,
      monthlyOrders: seller.monthlyOrders,
      apiKey: seller.apiKey,
      emailVerified: seller.emailVerified,
      isActive: seller.isActive,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt
    } : undefined;
  }

  async createEmailToken(insertToken: InsertEmailToken): Promise<EmailTokenType> {
    await connectDB();
    // Delete any existing tokens for this email first
    await this.deleteEmailToken(insertToken.email);
    
    const token = new EmailVerificationToken(insertToken);
    await token.save();
    return { 
      _id: token._id.toString(),
      email: token.email,
      token: token.token,
      expiresAt: token.expiresAt,
      createdAt: token.createdAt,
      updatedAt: token.updatedAt
    };
  }

  async getEmailToken(email: string, token: string): Promise<EmailTokenType | undefined> {
    await connectDB();
    const emailToken = await EmailVerificationToken.findOne({
      email,
      token,
      expiresAt: { $gt: new Date() }
    }).lean();
    return emailToken ? { 
      _id: emailToken._id.toString(),
      email: emailToken.email,
      token: emailToken.token,
      expiresAt: emailToken.expiresAt,
      createdAt: emailToken.createdAt,
      updatedAt: emailToken.updatedAt
    } : undefined;
  }

  async deleteEmailToken(email: string): Promise<void> {
    await connectDB();
    await EmailVerificationToken.deleteMany({ email });
  }
}

export const storage = new DatabaseStorage();
