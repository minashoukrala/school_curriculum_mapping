import express, { type Request, Response, NextFunction } from "express";
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { migrateFromJsonToSQLite } from "./storage";

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
    console.log('Full database export requested');
    const allRows = await storage.getAllCurriculumRows();
    const standards = await storage.getAllStandards();
    
    console.log(`Exporting ${allRows.length} curriculum rows and ${standards.length} standards`);
    
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

// Add specific route for full database import before Vite middleware
app.post('/api/import/full-database', async (req, res) => {
  try {
    const { storage } = await import('./storage');
    console.log('Full database import requested');
    
    const { curriculumRows, standards, metadata } = req.body;
    
    // Comprehensive server-side validation
    const validationResult = validateImportDataServer(curriculumRows, standards, metadata);
    if (!validationResult.isValid) {
      console.log('Import validation failed:', validationResult.error);
      return res.status(400).json({ 
        message: "Import validation failed", 
        error: validationResult.error 
      });
    }
    
    console.log(`Importing ${curriculumRows.length} curriculum rows and ${standards.length} standards`);
    console.log(`Validation passed: ${validationResult.gradeCount} grades, ${validationResult.subjectCount} subjects`);
    
    // Import the data using the storage method
    await storage.importFullDatabase({ curriculumRows, standards, metadata });
    
    console.log('Full database import completed successfully');
    res.json({ 
      message: "Database imported successfully",
      summary: {
        curriculumRows: curriculumRows.length,
        standards: standards.length,
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
  // Run migration from JSON to SQLite on startup
  try {
    await migrateFromJsonToSQLite();
  } catch (error) {
    console.error('Migration failed:', error);
    // Continue running the server even if migration fails
  }

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

  // Serve the app on port 3000
  // this serves both the API and the client.
  const port = 3000;
  server.listen(port, '127.0.0.1', () => {
    log(`serving on port ${port}`);
  });
})();
