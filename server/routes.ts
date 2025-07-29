import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSellerSchema } from "@shared/schema";
import { z } from "zod";

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

  // Update seller verification status
  app.patch("/api/sellers/:id/verification", async (req, res) => {
    try {
      const { emailVerified, phoneVerified } = req.body;
      const seller = await storage.updateSellerVerification(
        req.params.id,
        emailVerified,
        phoneVerified
      );
      if (!seller) {
        return res.status(404).json({ success: false, error: "Seller not found" });
      }
      res.json({ success: true, seller });
    } catch (error) {
      console.error("Error updating verification:", error);
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
