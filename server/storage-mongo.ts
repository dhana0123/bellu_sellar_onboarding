import connectDB from "./mongodb";
import { Seller, EmailToken, type ISeller, type IEmailToken } from "./models";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  createSeller(seller: any): Promise<ISeller>;
  getSellerById(id: string): Promise<ISeller | undefined>;
  getSellerByEmail(email: string): Promise<ISeller | undefined>;
  getSellerByApiKey(apiKey: string): Promise<ISeller | undefined>;
  updateSellerVerification(id: string, emailVerified?: boolean): Promise<ISeller | undefined>;
  updateSellerApiKey(id: string, apiKey: string): Promise<ISeller | undefined>;
  createEmailToken(token: any): Promise<IEmailToken>;
  getEmailToken(email: string, token: string): Promise<IEmailToken | undefined>;
  deleteEmailToken(email: string): Promise<void>;
}

export class MongoStorage implements IStorage {
  constructor() {
    connectDB();
  }

  async getUser(id: string): Promise<any | undefined> {
    // User functionality not implemented for this project
    return undefined;
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    // User functionality not implemented for this project
    return undefined;
  }

  async createUser(user: any): Promise<any> {
    // User functionality not implemented for this project
    throw new Error('User functionality not implemented');
  }

  async createSeller(insertSeller: any): Promise<ISeller> {
    await connectDB();
    
    const apiKey = `bk_seller_${randomUUID().replace(/-/g, '').substring(0, 16)}`;
    
    const seller = new Seller({
      ...insertSeller,
      apiKey,
    });
    
    const savedSeller = await seller.save();
    return this.transformSeller(savedSeller);
  }

  async getSellerById(id: string): Promise<ISeller | undefined> {
    await connectDB();
    
    const seller = await Seller.findById(id);
    return seller ? this.transformSeller(seller) : undefined;
  }

  async getSellerByEmail(email: string): Promise<ISeller | undefined> {
    await connectDB();
    
    const seller = await Seller.findOne({ email });
    return seller ? this.transformSeller(seller) : undefined;
  }

  async getSellerByApiKey(apiKey: string): Promise<ISeller | undefined> {
    await connectDB();
    
    const seller = await Seller.findOne({ apiKey });
    return seller ? this.transformSeller(seller) : undefined;
  }

  async updateSellerVerification(id: string, emailVerified?: boolean): Promise<ISeller | undefined> {
    await connectDB();
    
    const updates: any = {};
    if (emailVerified !== undefined) {
      updates.emailVerified = emailVerified ? new Date() : null;
    }

    const seller = await Seller.findByIdAndUpdate(id, updates, { new: true });
    return seller ? this.transformSeller(seller) : undefined;
  }

  async updateSellerApiKey(id: string, apiKey: string): Promise<ISeller | undefined> {
    await connectDB();
    
    const seller = await Seller.findByIdAndUpdate(id, { apiKey }, { new: true });
    return seller ? this.transformSeller(seller) : undefined;
  }

  async createEmailToken(tokenData: any): Promise<IEmailToken> {
    await connectDB();
    
    // Delete any existing tokens for this email
    await EmailToken.deleteMany({ email: tokenData.email });
    
    const token = new EmailToken(tokenData);
    const savedToken = await token.save();
    return this.transformEmailToken(savedToken);
  }

  async getEmailToken(email: string, token: string): Promise<IEmailToken | undefined> {
    await connectDB();
    
    const emailToken = await EmailToken.findOne({ 
      email, 
      token, 
      expiresAt: { $gt: new Date() } 
    });
    
    return emailToken ? this.transformEmailToken(emailToken) : undefined;
  }

  async deleteEmailToken(email: string): Promise<void> {
    await connectDB();
    
    await EmailToken.deleteMany({ email });
  }

  private transformSeller(seller: any): ISeller {
    return {
      id: seller._id.toString(),
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
    };
  }

  private transformEmailToken(token: any): IEmailToken {
    return {
      id: token._id.toString(),
      email: token.email,
      token: token.token,
      expiresAt: token.expiresAt,
      createdAt: token.createdAt,
    };
  }
}

export const storage = new MongoStorage();