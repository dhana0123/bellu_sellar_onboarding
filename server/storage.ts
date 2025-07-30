import { 
  type UserType, 
  type SellerType, 
  type EmailTokenType,
  type InsertUser, 
  type InsertSeller, 
  type InsertEmailToken,
  type LoginRequest 
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from 'bcryptjs';
import { User, Seller, EmailToken } from './models';

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
  updateSellerPassword(id: string, password: string): Promise<SellerType | undefined>;
  authenticateSeller(email: string, password: string): Promise<SellerType | undefined>;
  createEmailToken(token: InsertEmailToken): Promise<EmailTokenType>;
  getEmailToken(email: string, token: string): Promise<EmailTokenType | undefined>;
  deleteEmailToken(email: string): Promise<void>;
}

export class MongoStorage implements IStorage {
  async getUser(id: string): Promise<UserType | undefined> {
    const user = await User.findById(id);
    return user ? {
      id: user._id.toString(),
      username: user.username,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } : undefined;
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    const user = await User.findOne({ username });
    return user ? {
      id: user._id.toString(),
      username: user.username,
      password: user.password,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    } : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<UserType> {
    const user = new User(insertUser);
    const savedUser = await user.save();
    return {
      id: savedUser._id.toString(),
      username: savedUser.username,
      password: savedUser.password,
      createdAt: savedUser.createdAt,
      updatedAt: savedUser.updatedAt,
    };
  }

  async createSeller(insertSeller: InsertSeller): Promise<SellerType> {
    const apiKey = `bk_seller_${randomUUID().replace(/-/g, '').substring(0, 16)}`;
    
    // Hash password if provided
    let hashedPassword;
    if (insertSeller.password) {
      hashedPassword = await bcrypt.hash(insertSeller.password, 10);
    }
    
    const seller = new Seller({
      ...insertSeller,
      password: hashedPassword,
      apiKey,
      isActive: 1,
    });
    const savedSeller = await seller.save();
    return {
      id: savedSeller._id.toString(),
      brandName: savedSeller.brandName,
      websiteUrl: savedSeller.websiteUrl,
      email: savedSeller.email,
      phone: savedSeller.phone,
      category: savedSeller.category,
      monthlyOrders: savedSeller.monthlyOrders,
      password: savedSeller.password,
      apiKey: savedSeller.apiKey,
      emailVerified: savedSeller.emailVerified,
      isActive: savedSeller.isActive,
      createdAt: savedSeller.createdAt,
      updatedAt: savedSeller.updatedAt,
    };
  }

  async getSellerById(id: string): Promise<SellerType | undefined> {
    const seller = await Seller.findById(id);
    return seller ? {
      id: seller._id.toString(),
      brandName: seller.brandName,
      websiteUrl: seller.websiteUrl,
      email: seller.email,
      phone: seller.phone,
      category: seller.category,
      monthlyOrders: seller.monthlyOrders,
      password: seller.password,
      apiKey: seller.apiKey,
      emailVerified: seller.emailVerified,
      isActive: seller.isActive,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
    } : undefined;
  }

  async getSellerByEmail(email: string): Promise<SellerType | undefined> {
    const seller = await Seller.findOne({ email });
    return seller ? {
      id: seller._id.toString(),
      brandName: seller.brandName,
      websiteUrl: seller.websiteUrl,
      email: seller.email,
      phone: seller.phone,
      category: seller.category,
      monthlyOrders: seller.monthlyOrders,
      password: seller.password,
      apiKey: seller.apiKey,
      emailVerified: seller.emailVerified,
      isActive: seller.isActive,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
    } : undefined;
  }

  async getSellerByApiKey(apiKey: string): Promise<SellerType | undefined> {
    const seller = await Seller.findOne({ apiKey });
    return seller ? {
      id: seller._id.toString(),
      brandName: seller.brandName,
      websiteUrl: seller.websiteUrl,
      email: seller.email,
      phone: seller.phone,
      category: seller.category,
      monthlyOrders: seller.monthlyOrders,
      password: seller.password,
      apiKey: seller.apiKey,
      emailVerified: seller.emailVerified,
      isActive: seller.isActive,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
    } : undefined;
  }

  async updateSellerVerification(id: string, emailVerified?: boolean): Promise<SellerType | undefined> {
    const updateData = emailVerified !== undefined 
      ? { emailVerified: emailVerified ? new Date() : undefined }
      : { emailVerified: new Date() };
    
    const seller = await Seller.findByIdAndUpdate(id, updateData, { new: true });
    return seller ? {
      id: seller._id.toString(),
      brandName: seller.brandName,
      websiteUrl: seller.websiteUrl,
      email: seller.email,
      phone: seller.phone,
      category: seller.category,
      monthlyOrders: seller.monthlyOrders,
      password: seller.password,
      apiKey: seller.apiKey,
      emailVerified: seller.emailVerified,
      isActive: seller.isActive,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
    } : undefined;
  }

  async updateSellerApiKey(id: string, apiKey: string): Promise<SellerType | undefined> {
    const seller = await Seller.findByIdAndUpdate(id, { apiKey }, { new: true });
    return seller ? {
      id: seller._id.toString(),
      brandName: seller.brandName,
      websiteUrl: seller.websiteUrl,
      email: seller.email,
      phone: seller.phone,
      category: seller.category,
      monthlyOrders: seller.monthlyOrders,
      password: seller.password,
      apiKey: seller.apiKey,
      emailVerified: seller.emailVerified,
      isActive: seller.isActive,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
    } : undefined;
  }

  async updateSellerPassword(id: string, password: string): Promise<SellerType | undefined> {
    const hashedPassword = await bcrypt.hash(password, 10);
    const seller = await Seller.findByIdAndUpdate(id, { password: hashedPassword }, { new: true });
    return seller ? {
      id: seller._id.toString(),
      brandName: seller.brandName,
      websiteUrl: seller.websiteUrl,
      email: seller.email,
      phone: seller.phone,
      category: seller.category,
      monthlyOrders: seller.monthlyOrders,
      password: seller.password,
      apiKey: seller.apiKey,
      emailVerified: seller.emailVerified,
      isActive: seller.isActive,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
    } : undefined;
  }

  async authenticateSeller(email: string, password: string): Promise<SellerType | undefined> {
    const seller = await Seller.findOne({ email });
    if (!seller || !seller.password) {
      return undefined;
    }
    
    const isValidPassword = await bcrypt.compare(password, seller.password);
    if (!isValidPassword) {
      return undefined;
    }
    
    return {
      id: seller._id.toString(),
      brandName: seller.brandName,
      websiteUrl: seller.websiteUrl,
      email: seller.email,
      phone: seller.phone,
      category: seller.category,
      monthlyOrders: seller.monthlyOrders,
      password: seller.password,
      apiKey: seller.apiKey,
      emailVerified: seller.emailVerified,
      isActive: seller.isActive,
      createdAt: seller.createdAt,
      updatedAt: seller.updatedAt,
    };
  }

  async createEmailToken(insertToken: InsertEmailToken): Promise<EmailTokenType> {
    // Delete any existing tokens for this email first
    await EmailToken.deleteMany({ email: insertToken.email });
    
    const token = new EmailToken(insertToken);
    const savedToken = await token.save();
    return {
      id: savedToken._id.toString(),
      email: savedToken.email,
      token: savedToken.token,
      expiresAt: savedToken.expiresAt,
      createdAt: savedToken.createdAt,
      updatedAt: savedToken.updatedAt,
    };
  }

  async getEmailToken(email: string, token: string): Promise<EmailTokenType | undefined> {
    const emailToken = await EmailToken.findOne({ email, token });
    return emailToken ? {
      id: emailToken._id.toString(),
      email: emailToken.email,
      token: emailToken.token,
      expiresAt: emailToken.expiresAt,
      createdAt: emailToken.createdAt,
      updatedAt: emailToken.updatedAt,
    } : undefined;
  }

  async deleteEmailToken(email: string): Promise<void> {
    await EmailToken.deleteMany({ email });
  }
}

export class MemStorage implements IStorage {
  private users = new Map<string, UserType>();
  private sellers = new Map<string, SellerType>();
  private emailTokens = new Map<string, EmailTokenType>();

  async getUser(id: string): Promise<UserType | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<UserType | undefined> {
    for (const user of Array.from(this.users.values())) {
      if (user.username === username) {
        return user;
      }
    }
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<UserType> {
    const id = randomUUID();
    const now = new Date();
    const user: UserType = {
      id,
      username: insertUser.username,
      password: insertUser.password,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async createSeller(insertSeller: InsertSeller): Promise<SellerType> {
    const id = randomUUID();
    const apiKey = `bk_seller_${randomUUID().replace(/-/g, '').substring(0, 16)}`;
    const now = new Date();
    
    // Hash password if provided
    let hashedPassword;
    if (insertSeller.password) {
      hashedPassword = await bcrypt.hash(insertSeller.password, 10);
    }
    
    const seller: SellerType = {
      id,
      brandName: insertSeller.brandName,
      websiteUrl: insertSeller.websiteUrl,
      email: insertSeller.email,
      phone: insertSeller.phone,
      category: insertSeller.category,
      monthlyOrders: insertSeller.monthlyOrders,
      password: hashedPassword,
      apiKey,
      emailVerified: undefined,
      isActive: 1,
      createdAt: now,
      updatedAt: now,
    };
    this.sellers.set(id, seller);
    return seller;
  }

  async getSellerById(id: string): Promise<SellerType | undefined> {
    return this.sellers.get(id);
  }

  async getSellerByEmail(email: string): Promise<SellerType | undefined> {
    for (const seller of Array.from(this.sellers.values())) {
      if (seller.email === email) {
        return seller;
      }
    }
    return undefined;
  }

  async getSellerByApiKey(apiKey: string): Promise<SellerType | undefined> {
    for (const seller of Array.from(this.sellers.values())) {
      if (seller.apiKey === apiKey) {
        return seller;
      }
    }
    return undefined;
  }

  async updateSellerVerification(id: string, emailVerified?: boolean): Promise<SellerType | undefined> {
    const seller = this.sellers.get(id);
    if (!seller) return undefined;

    seller.emailVerified = emailVerified ? new Date() : undefined;
    seller.updatedAt = new Date();
    this.sellers.set(id, seller);
    return seller;
  }

  async updateSellerApiKey(id: string, apiKey: string): Promise<SellerType | undefined> {
    const seller = this.sellers.get(id);
    if (!seller) return undefined;

    seller.apiKey = apiKey;
    seller.updatedAt = new Date();
    this.sellers.set(id, seller);
    return seller;
  }

  async updateSellerPassword(id: string, password: string): Promise<SellerType | undefined> {
    const seller = this.sellers.get(id);
    if (!seller) return undefined;

    const hashedPassword = await bcrypt.hash(password, 10);
    seller.password = hashedPassword;
    seller.updatedAt = new Date();
    this.sellers.set(id, seller);
    return seller;
  }

  async authenticateSeller(email: string, password: string): Promise<SellerType | undefined> {
    const seller = await this.getSellerByEmail(email);
    if (!seller || !seller.password) {
      return undefined;
    }
    
    const isValidPassword = await bcrypt.compare(password, seller.password);
    if (!isValidPassword) {
      return undefined;
    }
    
    return seller;
  }

  async createEmailToken(insertToken: InsertEmailToken): Promise<EmailTokenType> {
    // Delete any existing tokens for this email first
    await this.deleteEmailToken(insertToken.email);
    
    const id = randomUUID();
    const now = new Date();
    const token: EmailTokenType = {
      id,
      email: insertToken.email,
      token: insertToken.token,
      expiresAt: insertToken.expiresAt,
      createdAt: now,
      updatedAt: now,
    };
    this.emailTokens.set(`${insertToken.email}:${insertToken.token}`, token);
    return token;
  }

  async getEmailToken(email: string, token: string): Promise<EmailTokenType | undefined> {
    const emailToken = this.emailTokens.get(`${email}:${token}`);
    if (!emailToken) return undefined;
    
    // Check if token has expired
    if (emailToken.expiresAt < new Date()) {
      this.emailTokens.delete(`${email}:${token}`);
      return undefined;
    }
    
    return emailToken;
  }

  async deleteEmailToken(email: string): Promise<void> {
    // Delete all tokens for this email
    const keysToDelete = Array.from(this.emailTokens.keys()).filter(key => key.startsWith(`${email}:`));
    keysToDelete.forEach(key => this.emailTokens.delete(key));
  }
}

export const storage = new MongoStorage();
