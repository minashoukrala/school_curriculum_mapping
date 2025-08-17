import express, { type Request, Response, NextFunction } from "express";
import rateLimit from 'express-rate-limit';
import compression from 'compression';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple logging function
function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

const app = express();

// Enable CORS for cross-origin requests
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Trust proxy for deployment
app.set('trust proxy', 1);

// Enable compression
app.use(compression());

// Rate limiting - more lenient for development
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 1000, // limit each IP to 1000 requests per minute
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

// Serve attached_assets as static
app.use('/attached_assets', express.static('attached_assets'));

// Import and register API routes
import { registerRoutes } from "./routes.js";

// Register API routes
await registerRoutes(app);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve static files from the built frontend (if it exists)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
try {
  app.use(express.static(frontendDistPath));
  log(`Serving frontend from: ${frontendDistPath}`);
} catch (error) {
  log(`Frontend dist not found: ${frontendDistPath}`);
}

// For any non-API routes, serve the frontend index.html (SPA routing)
app.get('*', (req, res) => {
  // Don't serve frontend for API routes
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  
  // Try to serve frontend index.html
  const indexPath = path.join(frontendDistPath, 'index.html');
  try {
    res.sendFile(indexPath);
  } catch (error) {
    res.json({ 
      message: 'Frontend not built yet. Please build the frontend first.',
      api: 'Available at /api/*',
      health: 'Available at /health'
    });
  }
});

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(status).json({ message });
  console.error('Server error:', err);
});

// Start the server
const port = parseInt(process.env.PORT || '3000', 10);
app.listen(port, '0.0.0.0', () => {
  log(`Combined server running on port ${port}`);
  log(`CORS enabled for origin: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
  log(`Serving API at /api/*`);
  log(`Serving frontend at /*`);
});
