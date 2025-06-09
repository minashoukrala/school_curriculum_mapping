import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCurriculumRowSchema, insertStandardSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get curriculum rows for a specific grade and subject
  app.get("/api/curriculum/:grade/:subject", async (req, res) => {
    try {
      const { grade, subject } = req.params;
      const rows = await storage.getCurriculumRows(grade, subject);
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch curriculum rows" });
    }
  });

  // Create a new curriculum row
  app.post("/api/curriculum", async (req, res) => {
    try {
      const validatedData = insertCurriculumRowSchema.parse(req.body);
      const row = await storage.createCurriculumRow(validatedData);
      res.status(201).json(row);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create curriculum row" });
      }
    }
  });

  // Update a curriculum row
  app.patch("/api/curriculum/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertCurriculumRowSchema.partial().parse(req.body);
      const row = await storage.updateCurriculumRow(id, validatedData);
      res.json(row);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(404).json({ message: "Curriculum row not found" });
      }
    }
  });

  // Delete a curriculum row
  app.delete("/api/curriculum/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCurriculumRow(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: "Curriculum row not found" });
    }
  });

  // Get all standards
  app.get("/api/standards", async (req, res) => {
    try {
      const standards = await storage.getAllStandards();
      res.json(standards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch standards" });
    }
  });

  // Get standards by category
  app.get("/api/standards/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const standards = await storage.getStandardsByCategory(category);
      res.json(standards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch standards by category" });
    }
  });

  // Create a new standard
  app.post("/api/standards", async (req, res) => {
    try {
      const validatedData = insertStandardSchema.parse(req.body);
      const standard = await storage.createStandard(validatedData);
      res.status(201).json(standard);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create standard" });
      }
    }
  });

  // Export curriculum data as JSON
  app.get("/api/export/:grade/:subject", async (req, res) => {
    try {
      const { grade, subject } = req.params;
      const rows = await storage.getCurriculumRows(grade, subject);
      const standards = await storage.getAllStandards();
      
      const exportData = {
        rows,
        standards,
        metadata: {
          grade,
          subject,
          exportDate: new Date().toISOString()
        }
      };
      
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=curriculum-${grade}-${subject}.json`);
      res.json(exportData);
    } catch (error) {
      res.status(500).json({ message: "Failed to export curriculum data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
