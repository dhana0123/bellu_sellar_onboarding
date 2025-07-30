import { sellers, type Seller, type InsertSeller, type User, type InsertUser, users, emailVerificationTokens, type EmailToken, type InsertEmailToken } from "@shared/schema";
import { db } from "./db";
import { eq, and, gt } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createSeller(seller: InsertSeller): Promise<Seller>;
  getSellerById(id: string): Promise<Seller | undefined>;
  getSellerByEmail(email: string): Promise<Seller | undefined>;
  getSellerByApiKey(apiKey: string): Promise<Seller | undefined>;
  updateSellerVerification(id: string, emailVerified?: boolean): Promise<Seller | undefined>;
  updateSellerApiKey(id: string, apiKey: string): Promise<Seller | undefined>;
  createEmailToken(token: InsertEmailToken): Promise<EmailToken>;
  getEmailToken(email: string, token: string): Promise<EmailToken | undefined>;
  deleteEmailToken(email: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createSeller(insertSeller: InsertSeller): Promise<Seller> {
    const apiKey = `bk_seller_${randomUUID().replace(/-/g, '').substring(0, 16)}`;
    
    const [seller] = await db
      .insert(sellers)
      .values({
        ...insertSeller,
        apiKey,
      })
      .returning();
    return seller;
  }

  async getSellerById(id: string): Promise<Seller | undefined> {
    const [seller] = await db.select().from(sellers).where(eq(sellers.id, id));
    return seller || undefined;
  }

  async getSellerByEmail(email: string): Promise<Seller | undefined> {
    const [seller] = await db.select().from(sellers).where(eq(sellers.email, email));
    return seller || undefined;
  }

  async getSellerByApiKey(apiKey: string): Promise<Seller | undefined> {
    const [seller] = await db.select().from(sellers).where(eq(sellers.apiKey, apiKey));
    return seller || undefined;
  }

  async updateSellerVerification(id: string, emailVerified?: boolean): Promise<Seller | undefined> {
    const updates: any = {};
    if (emailVerified !== undefined) {
      updates.emailVerified = emailVerified ? new Date() : null;
    }

    const [seller] = await db
      .update(sellers)
      .set(updates)
      .where(eq(sellers.id, id))
      .returning();
    return seller || undefined;
  }

  async updateSellerApiKey(id: string, apiKey: string): Promise<Seller | undefined> {
    const [seller] = await db
      .update(sellers)
      .set({ apiKey })
      .where(eq(sellers.id, id))
      .returning();
    return seller || undefined;
  }

  async createEmailToken(insertToken: InsertEmailToken): Promise<EmailToken> {
    // Delete any existing tokens for this email first
    await this.deleteEmailToken(insertToken.email);
    
    const [token] = await db
      .insert(emailVerificationTokens)
      .values(insertToken)
      .returning();
    return token;
  }

  async getEmailToken(email: string, token: string): Promise<EmailToken | undefined> {
    const [emailToken] = await db
      .select()
      .from(emailVerificationTokens)
      .where(
        and(
          eq(emailVerificationTokens.email, email),
          eq(emailVerificationTokens.token, token),
          gt(emailVerificationTokens.expiresAt, new Date())
        )
      );
    return emailToken || undefined;
  }

  async deleteEmailToken(email: string): Promise<void> {
    await db
      .delete(emailVerificationTokens)
      .where(eq(emailVerificationTokens.email, email));
  }
}

export const storage = new DatabaseStorage();
