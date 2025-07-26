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
      // Add cache control headers to prevent browser caching
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch curriculum rows" });
    }
  });

  // Get all curriculum rows (for admin)
  app.get("/api/curriculum/all", async (req, res) => {
    try {
      const rows = await storage.getAllCurriculumRows();
      // Add cache control headers to prevent browser caching
      res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.set('Pragma', 'no-cache');
      res.set('Expires', '0');
      res.json(rows);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch all curriculum rows" });
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
      console.log('PATCH body:', req.body);
      const validatedData = insertCurriculumRowSchema.partial().parse(req.body);
      console.log('PATCH validatedData:', validatedData);
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



  // Export full database as JSON
  app.get("/api/export/full-database", async (req, res) => {
    try {
      console.log('Full database export requested');
      const allRows = await storage.getAllCurriculumRows();
      const standards = await storage.getAllStandards();
      
      const exportData = {
        curriculumRows: allRows,
        standards,
        metadata: {
          totalCurriculumEntries: allRows.length,
          totalStandards: standards.length,
          exportDate: new Date().toISOString(),
          version: "1.0"
        }
      };
      
      // Set headers for direct download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename=full-curriculum-database-${new Date().toISOString().split('T')[0]}.json`);
      res.json(exportData);
      console.log('Full database export completed successfully');
    } catch (error) {
      console.error('Full database export error:', error);
      res.status(500).json({ message: "Failed to export full database" });
    }
  });

  // Get database statistics
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getDatabaseStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch database statistics" });
    }
  });

  // Get all grades
  app.get("/api/grades", async (req, res) => {
    try {
      const grades = await storage.getGrades();
      res.json(grades);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch grades" });
    }
  });

  // Get all subjects
  app.get("/api/subjects", async (req, res) => {
    try {
      const subjects = await storage.getSubjects();
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subjects" });
    }
  });

  // Get subjects by grade
  app.get("/api/subjects/:grade", async (req, res) => {
    try {
      const { grade } = req.params;
      const subjects = await storage.getSubjectsByGrade(grade);
      res.json(subjects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subjects for grade" });
    }
  });

  // Get standard categories
  app.get("/api/standards/categories", async (req, res) => {
    try {
      const categories = await storage.getStandardCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch standard categories" });
    }
  });

  // Search curriculum rows
  app.get("/api/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const results = await storage.searchCurriculumRows(q);
      res.json(results);
    } catch (error) {
      res.status(500).json({ message: "Failed to search curriculum rows" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
