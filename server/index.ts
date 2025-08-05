import express, { type Request, Response, NextFunction } from "express";
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";


const app = express();

// Enable compression
app.use(compression());

// Rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // limit each IP to 1000 requests per minute (much more lenient)
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip rate limiting for development environment
    return process.env.NODE_ENV === 'development';
  }
});

app.use(limiter);

// Add caching headers
app.use((req, res, next) => {
  // Cache static assets for 1 hour
  if (req.path.startsWith('/attached_assets') || req.path.includes('.')) {
    res.set('Cache-Control', 'public, max-age=3600');
  }
  // Cache API responses for 5 minutes (except for write operations)
  else if (req.path.startsWith('/api') && req.method === 'GET') {
    res.set('Cache-Control', 'public, max-age=300');
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve attached_assets as static before other routes
app.use('/attached_assets', express.static('attached_assets'));

// Add specific route for full database export before Vite middleware
app.get('/api/export/full-database', async (req, res) => {
  try {
    const { storage } = await import('./storage');
    const allRows = await storage.getAllCurriculumRows();
    const standards = await storage.getAllStandards();
    const navigationTabs = await storage.getAllNavigationTabs();
    const dropdownItems = await storage.getAllDropdownItems();
    const tableConfigs = await storage.getAllTableConfigs();
    const schoolYear = await storage.getSchoolYear();
    
    const exportData = {
      curriculumRows: allRows,
      standards,
      navigationTabs,
      dropdownItems,
      tableConfigs,
      schoolYear,
      metadata: {
        totalCurriculumEntries: allRows.length,
        totalStandards: standards.length,
        totalNavigationTabs: navigationTabs.length,
        totalDropdownItems: dropdownItems.length,
        totalTableConfigs: tableConfigs.length,
        exportDate: new Date().toISOString(),
        version: "2.0"
      }
    };
    
    // Set headers for direct download
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=full-curriculum-database-${new Date().toISOString().split('T')[0]}.json`);
    res.json(exportData);
  } catch (error) {
    console.error('Full database export error:', error);
    res.status(500).json({ message: "Failed to export full database" });
  }
});

// Add specific route for full database import before Vite middleware
app.post('/api/import/full-database', async (req, res) => {
      try {
      const { storage } = await import('./storage');

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
    console.error('Full database import error:', error);
    res.status(500).json({ message: "Failed to import database" });
  }
});

// Get database statistics
app.get('/api/stats', async (req, res) => {
  try {
    const { storage } = await import('./storage');
    const stats = await storage.getDatabaseStats();
    res.json(stats);
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ message: "Failed to fetch database statistics" });
  }
});

// Get all grades
app.get('/api/grades', async (req, res) => {
  try {
    const { storage } = await import('./storage');
    const grades = await storage.getGrades();
    res.json(grades);
  } catch (error) {
    console.error('Grades error:', error);
    res.status(500).json({ message: "Failed to fetch grades" });
  }
});

// Get all subjects
app.get('/api/subjects', async (req, res) => {
  try {
    const { storage } = await import('./storage');
    const subjects = await storage.getSubjects();
    res.json(subjects);
  } catch (error) {
    console.error('Subjects error:', error);
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
});

// Get subjects by grade
app.get('/api/subjects/:grade', async (req, res) => {
  try {
    const { grade } = req.params;
    const { storage } = await import('./storage');
    const subjects = await storage.getSubjectsByGrade(grade);
    res.json(subjects);
  } catch (error) {
    console.error('Subjects by grade error:', error);
    res.status(500).json({ message: "Failed to fetch subjects for grade" });
  }
});

// Get standard categories
app.get('/api/standards/categories', async (req, res) => {
  try {
    const { storage } = await import('./storage');
    const categories = await storage.getStandardCategories();
    res.json(categories);
  } catch (error) {
    console.error('Standard categories error:', error);
    res.status(500).json({ message: "Failed to fetch standard categories" });
  }
});

  // Search curriculum rows
  app.get('/api/search', async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const { storage } = await import('./storage');
      const results = await storage.searchCurriculumRows(q);
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ message: "Failed to search curriculum rows" });
    }
  });

  // Get school year
  app.get('/api/school-year', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const schoolYear = await storage.getSchoolYear();
      res.json(schoolYear);
    } catch (error) {
      console.error('School year error:', error);
      res.status(500).json({ message: "Failed to fetch school year" });
    }
  });

  // Update school year
  app.patch('/api/school-year', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const { updateSchoolYearSchema } = await import('@shared/schema');
      const { z } = await import('zod');
      const validatedData = updateSchoolYearSchema.parse(req.body);
      const schoolYear = await storage.updateSchoolYear(validatedData.year);
      res.json(schoolYear);
    } catch (error) {
      const { z } = await import('zod');
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error('Update school year error:', error);
        res.status(500).json({ message: "Failed to update school year" });
      }
    }
  });

  // Added: Navigation tabs endpoints
  app.get('/api/navigation-tabs', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const tabs = await storage.getAllNavigationTabs();
      res.json(tabs);
    } catch (error) {
      console.error('Get navigation tabs error:', error);
      res.status(500).json({ message: "Failed to fetch navigation tabs" });
    }
  });

  app.get('/api/navigation-tabs/active', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const tabs = await storage.getActiveNavigationTabs();
      
      // Set cache control headers to prevent caching
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.json(tabs);
    } catch (error) {
      console.error('Get active navigation tabs error:', error);
      res.status(500).json({ message: "Failed to fetch active navigation tabs" });
    }
  });

  app.get('/api/navigation-tabs/:id', async (req, res) => {
    const id = Number(req.params.id);
    console.log(`[DEBUG] typeof id: ${typeof id}, id:`, id, 'raw:', req.params.id);
    if (!id || isNaN(id) || id < 1) {
      console.log(`[WARN] Invalid navigation tab ID requested: "${req.params.id}" from ${req.headers.referer || 'unknown'}`);
      return res.status(404).json({ message: "Navigation tab not found" });
    }
    try {
      const { storage } = await import('./storage');
      const tab = await storage.getNavigationTabById(id);
      if (!tab) {
        res.status(404).json({ message: "Navigation tab not found" });
      } else {
        res.json(tab);
      }
    } catch (error) {
      console.error('Get navigation tab by ID error:', error);
      res.status(500).json({ message: "Failed to fetch navigation tab" });
    }
  });

  // Catch-all for unmatched navigation-tabs requests
  app.get('/api/navigation-tabs/*', (req, res) => {
    console.log(`[WARN] Unmatched navigation-tabs route: ${req.originalUrl}`);
    res.status(404).json({ message: "Navigation tab not found" });
  });

  app.post('/api/navigation-tabs', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const { createNavigationTabSchema } = await import('@shared/schema');
      const { z } = await import('zod');
      const validatedData = createNavigationTabSchema.parse(req.body);
      const tab = await storage.createNavigationTab(validatedData);
      res.status(201).json(tab);
    } catch (error) {
      const { z } = await import('zod');
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error('Create navigation tab error:', error);
        res.status(500).json({ message: "Failed to create navigation tab" });
      }
    }
  });

  app.patch('/api/navigation-tabs/:id', async (req, res) => {
    console.log(`[DEBUG] PATCH /api/navigation-tabs/${req.params.id} called`);
    try {
      const { storage } = await import('./storage');
      const { updateNavigationTabSchema } = await import('@shared/schema');
      const { z } = await import('zod');
      const id = parseInt(req.params.id);
      const validatedData = updateNavigationTabSchema.parse(req.body);
      const tab = await storage.updateNavigationTab(id, validatedData);
      if (!tab) {
        res.status(404).json({ message: "Navigation tab not found" });
      } else {
        res.json(tab);
      }
    } catch (error) {
      const { z } = await import('zod');
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error('Update navigation tab error:', error);
        res.status(500).json({ message: "Failed to update navigation tab" });
      }
    }
  });

  app.delete('/api/navigation-tabs/:id', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const id = parseInt(req.params.id);
      const success = await storage.deleteNavigationTab(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Navigation tab not found" });
      }
    } catch (error) {
      console.error('Delete navigation tab error:', error);
      res.status(500).json({ message: "Failed to delete navigation tab" });
    }
  });

  // Added: Dropdown items endpoints
  app.get('/api/dropdown-items', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const items = await storage.getAllDropdownItems();
      
      // Set cache control headers to prevent caching
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.json(items);
    } catch (error) {
      console.error('Get dropdown items error:', error);
      res.status(500).json({ message: "Failed to fetch dropdown items" });
    }
  });

  app.get('/api/dropdown-items/tab/:tabId', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const tabId = parseInt(req.params.tabId);
      const items = await storage.getDropdownItemsByTabId(tabId);
      res.json(items);
    } catch (error) {
      console.error('Get dropdown items by tab error:', error);
      res.status(500).json({ message: "Failed to fetch dropdown items" });
    }
  });

  app.post('/api/dropdown-items', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const { createDropdownItemSchema } = await import('@shared/schema');
      const { z } = await import('zod');
      const validatedData = createDropdownItemSchema.parse(req.body);
      const item = await storage.createDropdownItem(validatedData);
      res.status(201).json(item);
    } catch (error) {
      const { z } = await import('zod');
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error('Create dropdown item error:', error);
        res.status(500).json({ message: "Failed to create dropdown item" });
      }
    }
  });

  app.patch('/api/dropdown-items/:id', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const { updateDropdownItemSchema } = await import('@shared/schema');
      const { z } = await import('zod');
      const id = parseInt(req.params.id);
      const validatedData = updateDropdownItemSchema.parse(req.body);
      const item = await storage.updateDropdownItem(id, validatedData);
      if (!item) {
        res.status(404).json({ message: "Dropdown item not found" });
      } else {
        res.json(item);
      }
    } catch (error) {
      const { z } = await import('zod');
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error('Update dropdown item error:', error);
        res.status(500).json({ message: "Failed to update dropdown item" });
      }
    }
  });

  app.delete('/api/dropdown-items/:id', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const id = parseInt(req.params.id);
      const success = await storage.deleteDropdownItem(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Dropdown item not found" });
      }
    } catch (error) {
      console.error('Delete dropdown item error:', error);
      res.status(500).json({ message: "Failed to delete dropdown item" });
    }
  });

  // Added: Table configs endpoints
  app.get('/api/table-configs', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const configs = await storage.getAllTableConfigs();
      
      // Set cache control headers to prevent caching
      res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      
      res.json(configs);
    } catch (error) {
      console.error('Get table configs error:', error);
      res.status(500).json({ message: "Failed to fetch table configs" });
    }
  });

  app.get('/api/table-configs/dropdown/:dropdownId', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const dropdownId = parseInt(req.params.dropdownId);
      const configs = await storage.getTableConfigsByDropdownId(dropdownId);
      res.json(configs);
    } catch (error) {
      console.error('Get table configs by dropdown error:', error);
      res.status(500).json({ message: "Failed to fetch table configs" });
    }
  });

  app.post('/api/table-configs', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const { createTableConfigSchema } = await import('@shared/schema');
      const { z } = await import('zod');
      const validatedData = createTableConfigSchema.parse(req.body);
      const config = await storage.createTableConfig(validatedData);
      
      // Get the dropdown item to find the subject name
      const dropdownItems = await storage.getAllDropdownItems();
      const dropdown = dropdownItems.find(item => item.id === validatedData.dropdownId);
      
      if (dropdown) {
        // Get the navigation tab to find the grade name
        const navigationTabs = await storage.getAllNavigationTabs();
        const tab = navigationTabs.find(tab => tab.id === validatedData.tabId);
        
        if (tab) {
          // Create a sample curriculum row with the correct tableName
          const sampleCurriculumRow = {
            grade: tab.name,
            subject: dropdown.name,
            tableName: validatedData.tableName,
            objectives: '',
            unitPacing: '',
            assessments: '',
            materialsAndDifferentiation: '',
            biblical: '',
            standards: []
          };
          
          try {
            await storage.createCurriculumRow(sampleCurriculumRow);
                  // Sample curriculum row created successfully
    } catch (curriculumError) {
      // Sample curriculum row may already exist
    }
        }
      }
      
      res.status(201).json(config);
    } catch (error) {
      const { z } = await import('zod');
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error('Create table config error:', error);
        res.status(500).json({ message: "Failed to create table config" });
      }
    }
  });

  app.patch('/api/table-configs/:id', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const { updateTableConfigSchema } = await import('@shared/schema');
      const { z } = await import('zod');
      const id = parseInt(req.params.id);
      const validatedData = updateTableConfigSchema.parse(req.body);
      const config = await storage.updateTableConfig(id, validatedData);
      if (!config) {
        res.status(404).json({ message: "Table config not found" });
      } else {
        res.json(config);
      }
    } catch (error) {
      const { z } = await import('zod');
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        console.error('Update table config error:', error);
        res.status(500).json({ message: "Failed to update table config" });
      }
    }
  });

  app.delete('/api/table-configs/:id', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const id = parseInt(req.params.id);
      
      const success = await storage.deleteTableConfig(id);
      if (success) {
        res.status(204).send();
      } else {
        res.status(404).json({ message: "Table config not found" });
      }
    } catch (error) {
      console.error('Delete table config error:', error);
      res.status(500).json({ message: "Failed to delete table config" });
    }
  });

  // Cleanup orphaned curriculum rows
  app.post('/api/cleanup-orphaned-data', async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const deletedCount = await storage.cleanupOrphanedCurriculumRows();
      res.json({ 
        message: "Cleanup completed successfully", 
        deletedCount 
      });
    } catch (error) {
      console.error('Cleanup orphaned data error:', error);
      res.status(500).json({ message: "Failed to cleanup orphaned data" });
    }
  });

  // Get curriculum rows for a specific grade and subject
  app.get("/api/curriculum/:grade/:subject", async (req, res) => {
    try {
      const { grade, subject } = req.params;
      const { storage } = await import('./storage');
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
      const { storage } = await import('./storage');
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
      const { storage } = await import('./storage');
      const { insertCurriculumRowSchema } = await import('@shared/schema');
      const { z } = await import('zod');
      const validatedData = insertCurriculumRowSchema.parse(req.body);
      const row = await storage.createCurriculumRow(validatedData);
      res.status(201).json(row);
    } catch (error) {
      console.error('POST /api/curriculum error:', error);
      const { z } = await import('zod');
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
      const { storage } = await import('./storage');
      const { insertCurriculumRowSchema } = await import('@shared/schema');
      const { z } = await import('zod');
      const validatedData = insertCurriculumRowSchema.partial().parse(req.body);
      const row = await storage.updateCurriculumRow(id, validatedData);
      res.json(row);
    } catch (error) {
      const { z } = await import('zod');
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
      const { storage } = await import('./storage');
      await storage.deleteCurriculumRow(id);
      res.status(204).send();
    } catch (error) {
      res.status(404).json({ message: "Curriculum row not found" });
    }
  });

  // Get all standards
  app.get("/api/standards", async (req, res) => {
    try {
      const { storage } = await import('./storage');
      const standards = await storage.getAllStandards();
      res.json(standards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch standards" });
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

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {

  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Serve the app on the specified port
  // this serves both the API and the client.
  const port = parseInt(process.env.PORT || '3000', 10);
  server.listen(port, '0.0.0.0', () => {
    log(`serving on port ${port}`);
  });
})();
