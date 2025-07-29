import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const sellers = pgTable("sellers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  brandName: text("brand_name").notNull(),
  websiteUrl: text("website_url").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  category: text("category").notNull(),
  monthlyOrders: text("monthly_orders"),
  firebaseUid: text("firebase_uid"),
  apiKey: text("api_key").notNull().unique(),
  emailVerified: timestamp("email_verified"),
  phoneVerified: timestamp("phone_verified"),
  createdAt: timestamp("created_at").defaultNow(),
  isActive: integer("is_active").default(1),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertSellerSchema = createInsertSchema(sellers).omit({
  id: true,
  apiKey: true,
  emailVerified: true,
  phoneVerified: true,
  createdAt: true,
  isActive: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertSeller = z.infer<typeof insertSellerSchema>;
export type Seller = typeof sellers.$inferSelect;
