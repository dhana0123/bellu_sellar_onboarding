import { 
  type UserType, 
  type SellerType, 
  type EmailTokenType,
  type InsertUser, 
  type InsertSeller, 
  type InsertEmailToken 
} from "@shared/schema";
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
    
    const seller: SellerType = {
      id,
      brandName: insertSeller.brandName,
      websiteUrl: insertSeller.websiteUrl,
      email: insertSeller.email,
      phone: insertSeller.phone,
      category: insertSeller.category,
      monthlyOrders: insertSeller.monthlyOrders,
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

export const storage = new MemStorage();
