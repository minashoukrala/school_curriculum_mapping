# Curriculum Crafter

A comprehensive curriculum management system built with a modern, decoupled architecture.

## 🏗️ Architecture

This project is structured as three independent services that can be deployed separately:

- **Frontend** (`/frontend`) - React + Vite application
- **Backend** (`/backend`) - Express.js API server  
- **Database** (`/database`) - PostgreSQL database with shared schemas

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

### Prerequisites

- Node.js 18+ 
- PostgreSQL 15+
- npm or yarn

### 1. Install Dependencies

```bash
# Install all dependencies for frontend, backend, and root
npm run install:all
```

### 2. Database Setup

```bash
# Make sure PostgreSQL is running
brew services start postgresql@15

# Create the database
createdb curriculum_crafter
```

### 3. Environment Configuration

```bash
# Backend environment
cd backend
cp env.example .env
# Edit .env with your database credentials

# Frontend environment  
cd ../frontend
cp env.example .env
# Edit .env to point to your backend URL
```

### 4. Start Development Servers

```bash
# Start both frontend and backend simultaneously
npm run dev

# Or start them separately:
npm run dev:frontend  # Frontend on http://localhost:5173
npm run dev:backend   # Backend on http://localhost:3000
```

## 🔧 Development

### Frontend Development

```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Backend Development

```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm start           # Start production server
```

### Database Development

```bash
cd database
# Edit shared schemas in shared/schema.ts
# Run migrations with drizzle-kit
```

## 🚀 Production Deployment

### Frontend Deployment

1. Build the frontend:
```bash
cd frontend
npm run build
```

2. Deploy the `frontend/dist/` folder to any static hosting service:
   - Vercel
   - Netlify
   - AWS S3 + CloudFront
   - GitHub Pages

### Backend Deployment

1. Build the backend:
```bash
cd backend
npm run build
```

2. Deploy to any Node.js hosting service:
   - Railway
   - Render
   - Heroku
   - AWS EC2
   - DigitalOcean App Platform

### Database Deployment

1. Set up PostgreSQL database:
   - AWS RDS
   - Railway PostgreSQL
   - Supabase
   - Neon

2. Update backend environment variables with production database URL

## 🔌 API Endpoints

The backend provides a RESTful API:

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

## 🌐 Environment Variables

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
```

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
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Query** - Data fetching
- **Wouter** - Routing

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Drizzle ORM** - Database ORM
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing

### Database
- **PostgreSQL** - Primary database
- **Drizzle Kit** - Database migrations
- **Shared Schemas** - TypeScript schemas shared between frontend and backend

## 📝 Scripts

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

## 🔒 Security

- CORS configured for cross-origin requests
- Rate limiting on API endpoints
- Input validation with Zod schemas
- SQL injection protection via parameterized queries
- Environment variable configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Review the [POSTGRES_MIGRATION.md](POSTGRES_MIGRATION.md) for database migration details
- Check the [DEPLOYMENT.md](DEPLOYMENT.md) for deployment guides 