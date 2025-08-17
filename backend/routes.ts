import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "../database/storage";
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

  // Get school year
  app.get("/api/school-year", async (req, res) => {
    try {
      const schoolYear = await storage.getSchoolYear();
      res.json(schoolYear);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch school year" });
    }
  });

  // Update school year
  app.patch("/api/school-year", async (req, res) => {
    try {
      const { updateSchoolYearSchema } = await import('@shared/schema');
      const validatedData = updateSchoolYearSchema.parse(req.body);
      const schoolYear = await storage.updateSchoolYear(validatedData.year);
      res.json(schoolYear);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update school year" });
      }
    }
  });

  // Navigation tabs endpoints
  app.get('/api/navigation-tabs', async (req, res) => {
    try {
      const tabs = await storage.getAllNavigationTabs();
      res.json(tabs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch navigation tabs" });
    }
  });

  app.get('/api/navigation-tabs/active', async (req, res) => {
    try {
      const tabs = await storage.getActiveNavigationTabs();
      
      // Set cache control headers to prevent caching
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.json(tabs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active navigation tabs" });
    }
  });

  app.get('/api/navigation-tabs/:id', async (req, res) => {
    const id = Number(req.params.id);
    if (!id || isNaN(id) || id < 1) {
      return res.status(404).json({ message: "Navigation tab not found" });
    }
    try {
      const tab = await storage.getNavigationTabById(id);
      if (!tab) {
        res.status(404).json({ message: "Navigation tab not found" });
      } else {
        res.json(tab);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch navigation tab" });
    }
  });

  app.post('/api/navigation-tabs', async (req, res) => {
    try {
      const { createNavigationTabSchema } = await import('@shared/schema');
      const validatedData = createNavigationTabSchema.parse(req.body);
      const tab = await storage.createNavigationTab(validatedData);
      res.status(201).json(tab);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create navigation tab" });
      }
    }
  });

  app.patch('/api/navigation-tabs/:id', async (req, res) => {
    try {
      const { updateNavigationTabSchema } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      const validatedData = updateNavigationTabSchema.parse(req.body);
      const tab = await storage.updateNavigationTab(id, validatedData);
      if (!tab) {
        res.status(404).json({ message: "Navigation tab not found" });
      } else {
        res.json(tab);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update navigation tab" });
      }
    }
  });

  app.delete('/api/navigation-tabs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteNavigationTab(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Navigation tab not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete navigation tab" });
    }
  });

  // Dropdown items endpoints
  app.get('/api/dropdown-items', async (req, res) => {
    try {
      const items = await storage.getAllDropdownItems();
      
      // Set cache control headers to prevent caching
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dropdown items" });
    }
  });

  app.get('/api/dropdown-items/tab/:tabId', async (req, res) => {
    try {
      const tabId = parseInt(req.params.tabId);
      const items = await storage.getDropdownItemsByTabId(tabId);
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dropdown items" });
    }
  });

  app.post('/api/dropdown-items', async (req, res) => {
    try {
      const { createDropdownItemSchema } = await import('@shared/schema');
      const validatedData = createDropdownItemSchema.parse(req.body);
      const item = await storage.createDropdownItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create dropdown item" });
      }
    }
  });

  app.patch('/api/dropdown-items/:id', async (req, res) => {
    try {
      const { updateDropdownItemSchema } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      const validatedData = updateDropdownItemSchema.parse(req.body);
      const item = await storage.updateDropdownItem(id, validatedData);
      if (!item) {
        res.status(404).json({ message: "Dropdown item not found" });
      } else {
        res.json(item);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update dropdown item" });
      }
    }
  });

  app.delete('/api/dropdown-items/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteDropdownItem(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Dropdown item not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete dropdown item" });
    }
  });

  // Table configs endpoints
  app.get('/api/table-configs', async (req, res) => {
    try {
      const configs = await storage.getAllTableConfigs();
      
      // Set cache control headers to prevent caching
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.json(configs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch table configs" });
    }
  });

  app.get('/api/table-configs/dropdown/:dropdownId', async (req, res) => {
    try {
      const dropdownId = parseInt(req.params.dropdownId);
      const configs = await storage.getTableConfigsByDropdownId(dropdownId);
      res.json(configs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch table configs" });
    }
  });

  app.post('/api/table-configs', async (req, res) => {
    try {
      const { createTableConfigSchema } = await import('@shared/schema');
      const validatedData = createTableConfigSchema.parse(req.body);
      const config = await storage.createTableConfig(validatedData);
      res.status(201).json(config);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to create table config" });
      }
    }
  });

  app.patch('/api/table-configs/:id', async (req, res) => {
    try {
      const { updateTableConfigSchema } = await import('@shared/schema');
      const id = parseInt(req.params.id);
      const validatedData = updateTableConfigSchema.parse(req.body);
      const config = await storage.updateTableConfig(id, validatedData);
      if (!config) {
        res.status(404).json({ message: "Table config not found" });
      } else {
        res.json(config);
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to update table config" });
      }
    }
  });

  app.delete('/api/table-configs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTableConfig(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Table config not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete table config" });
    }
  });

  // Import full database
  app.post('/api/import/full-database', async (req, res) => {
    try {
      const { curriculumRows, standards, navigationTabs, dropdownItems, tableConfigs, schoolYear, metadata } = req.body;
    
      // Comprehensive server-side validation
      const validationResult = validateImportDataServer(curriculumRows, standards, metadata);
      if (!validationResult.isValid) {
        return res.status(400).json({ 
          message: "Import validation failed", 
          error: validationResult.error 
        });
      }
      
      // Import the data using the storage method
      await storage.importFullDatabase({ 
        curriculumRows, 
        standards, 
        navigationTabs, 
        dropdownItems, 
        tableConfigs, 
        schoolYear, 
        metadata 
      });
      res.json({ 
        message: "Database imported successfully",
        summary: {
          curriculumRows: curriculumRows.length,
          standards: standards.length,
          navigationTabs: navigationTabs?.length || 0,
          dropdownItems: dropdownItems?.length || 0,
          tableConfigs: tableConfigs?.length || 0,
          grades: validationResult.gradeCount,
          subjects: validationResult.subjectCount
        }
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to import database" });
    }
  });

  // Server-side validation function
  function validateImportDataServer(curriculumRows: any[], standards: any[], metadata: any) {
    // Check arrays exist and are arrays
    if (!Array.isArray(curriculumRows)) {
      return { isValid: false, error: "curriculumRows must be an array" };
    }
    
    if (!Array.isArray(standards)) {
      return { isValid: false, error: "standards must be an array" };
    }
    
    if (!metadata || typeof metadata !== 'object') {
      return { isValid: false, error: "metadata must be an object" };
    }
    
    // Check for reasonable limits
    if (curriculumRows.length > 10000) {
      return { isValid: false, error: "Too many curriculum rows (max 10,000)" };
    }
    
    if (standards.length > 1000) {
      return { isValid: false, error: "Too many standards (max 1,000)" };
    }
    
    // Validate curriculum rows
    const requiredCurriculumFields = ['id', 'grade', 'subject', 'objectives', 'unitPacing', 'assessments', 'materialsAndDifferentiation', 'biblical', 'standards'];
    const grades = new Set();
    const subjects = new Set();
    const curriculumIds = new Set();
    
    for (let i = 0; i < curriculumRows.length; i++) {
      const row = curriculumRows[i];
      
      if (!row || typeof row !== 'object') {
        return { isValid: false, error: `Curriculum row ${i + 1} is not a valid object` };
      }
      
      // Check required fields
      for (const field of requiredCurriculumFields) {
        if (!(field in row)) {
          return { isValid: false, error: `Curriculum row ${i + 1} missing required field: ${field}` };
        }
      }
      
      // Validate field types
      if (typeof row.id !== 'number' || row.id <= 0) {
        return { isValid: false, error: `Curriculum row ${i + 1} has invalid ID: must be a positive number` };
      }
      
      if (curriculumIds.has(row.id)) {
        return { isValid: false, error: `Duplicate curriculum row ID: ${row.id}` };
      }
      curriculumIds.add(row.id);
      
      if (typeof row.grade !== 'string' || row.grade.trim() === '') {
        return { isValid: false, error: `Curriculum row ${i + 1} has invalid grade: must be a non-empty string` };
      }
      
      if (typeof row.subject !== 'string' || row.subject.trim() === '') {
        return { isValid: false, error: `Curriculum row ${i + 1} has invalid subject: must be a non-empty string` };
      }
      
      if (!Array.isArray(row.standards)) {
        return { isValid: false, error: `Curriculum row ${i + 1} has invalid standards: must be an array` };
      }
      
      // Track unique grades and subjects
      grades.add(row.grade);
      subjects.add(row.subject);
    }
    
    // Validate standards
    const requiredStandardFields = ['id', 'code', 'description', 'category'];
    const standardIds = new Set();
    
    for (let i = 0; i < standards.length; i++) {
      const standard = standards[i];
      
      if (!standard || typeof standard !== 'object') {
        return { isValid: false, error: `Standard ${i + 1} is not a valid object` };
      }
      
      // Check required fields
      for (const field of requiredStandardFields) {
        if (!(field in standard)) {
          return { isValid: false, error: `Standard ${i + 1} missing required field: ${field}` };
      }
      }
      
      // Validate field types
      if (typeof standard.id !== 'number' || standard.id <= 0) {
        return { isValid: false, error: `Standard ${i + 1} has invalid ID: must be a positive number` };
      }
      
      if (standardIds.has(standard.id)) {
        return { isValid: false, error: `Duplicate standard ID: ${standard.id}` };
      }
      standardIds.add(standard.id);
      
      if (typeof standard.code !== 'string' || standard.code.trim() === '') {
        return { isValid: false, error: `Standard ${i + 1} has invalid code: must be a non-empty string` };
      }
      
      if (typeof standard.description !== 'string') {
        return { isValid: false, error: `Standard ${i + 1} has invalid description: must be a string` };
      }
      
      if (typeof standard.category !== 'string' || standard.category.trim() === '') {
        return { isValid: false, error: `Standard ${i + 1} has invalid category: must be a non-empty string` };
      }
    }
    
    // Validate metadata
    if (metadata.totalCurriculumEntries !== curriculumRows.length) {
      return { isValid: false, error: "Metadata totalCurriculumEntries doesn't match actual curriculum rows count" };
    }
    
    if (metadata.totalStandards !== standards.length) {
      return { isValid: false, error: "Metadata totalStandards doesn't match actual standards count" };
    }
    
    return { 
      isValid: true, 
      error: null,
      gradeCount: grades.size,
      subjectCount: subjects.size
    };
  }

  const httpServer = createServer(app);
  return httpServer;
}
