# Decoupled Frontend and Backend Setup

This application has been decoupled into separate frontend, backend, and database services that can be hosted independently.

## 🏗️ Architecture

- **Frontend** (`/frontend`) - React + Vite application running on port 5173
- **Backend** (`/backend`) - Express.js API server running on port 3000
- **Database** (`/database`) - PostgreSQL database with shared schemas
- **Communication**: REST API calls between frontend and backend

## 📁 Project Structure

```
CurriculumCrafter/
├── frontend/                 # React frontend application
│   ├── src/                 # React source code
│   ├── public/              # Static assets
│   ├── package.json         # Frontend dependencies
│   └── vite.config.ts       # Vite configuration
├── backend/                  # Express.js API server
│   ├── index.ts             # Main server file
│   ├── postgres-db.ts       # PostgreSQL database layer
│   ├── storage.ts           # Storage abstraction
│   ├── routes.ts            # API routes
│   └── package.json         # Backend dependencies
├── database/                 # Database and schemas
│   ├── shared/              # Shared TypeScript schemas
│   ├── drizzle.config.ts    # Database migration config
│   └── migrations/          # Database migrations
└── package.json             # Root package.json for orchestration
```

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your database configuration
# Make sure PostgreSQL is running and the database exists

# Start the backend server
npm run dev
```

The backend will start on `http://localhost:3000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env to point to your backend URL
VITE_API_URL=http://localhost:3000

# Start the frontend development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Using Root Scripts (Recommended)

```bash
# Install all dependencies
npm run install:all

# Start both frontend and backend simultaneously
npm run dev

# Or start them separately:
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only
```

## 🌐 Environment Variables

### Backend (.env)
```env
# Database Configuration
DB_TYPE=postgres
USE_POSTGRES=true
DB_HOST=localhost
DB_PORT=5432
DB_NAME=curriculum_crafter
DB_USER=your_username
DB_PASSWORD=your_password

# Server Configuration
PORT=3000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Database Path (relative to backend directory)
DATABASE_PATH=../database
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

## 🚀 Production Deployment

### Backend Deployment

1. Build the backend:
```bash
cd backend
npm run build
```

2. Start the production server:
```bash
npm start
```

### Frontend Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Serve the built files from `frontend/dist/` using any static file server (nginx, Apache, etc.)

### Database Deployment

1. Set up PostgreSQL database:
   - AWS RDS
   - Railway PostgreSQL
   - Supabase
   - Neon

2. Update backend environment variables with production database URL

## 🔌 API Endpoints

The backend provides the following API endpoints:

- `GET /api/curriculum/:grade/:subject` - Get curriculum rows
- `POST /api/curriculum` - Create curriculum row
- `PATCH /api/curriculum/:id` - Update curriculum row
- `DELETE /api/curriculum/:id` - Delete curriculum row
- `GET /api/standards` - Get all standards
- `GET /api/navigation-tabs/active` - Get active navigation tabs
- `GET /api/dropdown-items` - Get dropdown items
- `GET /api/table-configs` - Get table configurations
- `GET /api/export/full-database` - Export full database
- `POST /api/import/full-database` - Import full database
- `GET /health` - Health check

## 🔒 CORS Configuration

The backend is configured with CORS to allow requests from the frontend. Update the `FRONTEND_URL` environment variable in the backend to match your frontend URL.

## 🔧 Development Workflow

1. Start the backend server first
2. Start the frontend development server
3. The frontend will proxy API requests to the backend
4. Make changes to either frontend or backend independently
5. Hot reload will work for both services

## 📝 Available Scripts

### Root Level Scripts
```bash
npm run dev              # Start both frontend and backend
npm run dev:frontend     # Start only frontend
npm run dev:backend      # Start only backend
npm run build            # Build both frontend and backend
npm run install:all      # Install all dependencies
npm run clean            # Clean all node_modules and dist folders
npm run setup            # Complete setup including database
```

### Frontend Scripts
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Scripts
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
```

## 🛠️ Troubleshooting

### Frontend can't connect to backend
- Check that the backend is running on the correct port
- Verify the `VITE_API_URL` environment variable is correct
- Check CORS configuration in the backend

### Database connection issues
- Ensure PostgreSQL is running
- Verify database credentials in backend `.env`
- Check that the database exists

### Build issues
- Make sure all dependencies are installed in both directories
- Check TypeScript configuration files
- Verify path mappings in tsconfig.json files

### Path resolution issues
- Ensure the `@shared` alias points to `../database/shared` in both frontend and backend
- Check that the database folder structure is correct
- Verify that shared schemas are accessible from both services
