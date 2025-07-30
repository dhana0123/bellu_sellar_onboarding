import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage-mongo";
import { z } from "zod";
import { sendEmail, generateOTP, generateVerificationEmail } from "./email";

const insertSellerSchema = z.object({
  brandName: z.string().min(1),
  websiteUrl: z.string().url(),
  email: z.string().email(),
  phone: z.string(),
  category: z.string().min(1),
  monthlyOrders: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create seller endpoint
  app.post("/api/sellers", async (req, res) => {
    try {
      const sellerData = insertSellerSchema.parse(req.body);
      const seller = await storage.createSeller(sellerData);
      res.json({ success: true, seller });
    } catch (error) {
      console.error("Error creating seller:", error);
      res.status(400).json({ success: false, error: "Invalid seller data" });
    }
  });

  // Get seller by ID endpoint
  app.get("/api/sellers/:id", async (req, res) => {
    try {
      const seller = await storage.getSellerById(req.params.id);
      if (!seller) {
        return res.status(404).json({ success: false, error: "Seller not found" });
      }
      res.json({ success: true, seller });
    } catch (error) {
      console.error("Error fetching seller:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Send email verification
  app.post("/api/sellers/:id/send-verification", async (req, res) => {
    try {
      const seller = await storage.getSellerById(req.params.id);
      if (!seller) {
        return res.status(404).json({ success: false, error: "Seller not found" });
      }

      const otp = generateOTP();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

      // Store the OTP token
      await storage.createEmailToken({
        email: seller.email,
        token: otp,
        expiresAt,
      });

      // Send verification email
      const { subject, htmlContent } = generateVerificationEmail(otp, seller.brandName);
      const emailResult = await sendEmail({
        to: seller.email,
        subject,
        htmlContent,
      });

      if (!emailResult.success) {
        return res.status(500).json({ success: false, error: "Failed to send verification email" });
      }

      res.json({ success: true, message: "Verification email sent" });
    } catch (error) {
      console.error("Error sending verification email:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Verify email with OTP
  app.post("/api/sellers/:id/verify-email", async (req, res) => {
    try {
      const { otp } = req.body;
      const seller = await storage.getSellerById(req.params.id);
      
      if (!seller) {
        return res.status(404).json({ success: false, error: "Seller not found" });
      }

      // Check if OTP is valid
      const emailToken = await storage.getEmailToken(seller.email, otp);
      if (!emailToken) {
        return res.status(400).json({ success: false, error: "Invalid or expired verification code" });
      }

      // Update seller verification status
      const updatedSeller = await storage.updateSellerVerification(req.params.id, true);
      
      // Delete the used token
      await storage.deleteEmailToken(seller.email);

      res.json({ success: true, seller: updatedSeller });
    } catch (error) {
      console.error("Error verifying email:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  // Verify API key endpoint
  app.get("/api/verify-key/:apiKey", async (req, res) => {
    try {
      const seller = await storage.getSellerByApiKey(req.params.apiKey);
      if (!seller) {
        return res.status(404).json({ success: false, error: "Invalid API key" });
      }
      res.json({ success: true, valid: true, seller: { id: seller.id, brandName: seller.brandName } });
    } catch (error) {
      console.error("Error verifying API key:", error);
      res.status(500).json({ success: false, error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
