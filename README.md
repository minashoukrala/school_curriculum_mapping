# CurriculumCrafter

A comprehensive curriculum management system built with React, TypeScript, and SQLite. This application allows educators to create, manage, and organize curriculum content with biblical integration and educational standards.

## 🚀 Features

### Core Functionality
- **Curriculum Management**: Create, edit, and delete curriculum rows with detailed objectives, assessments, and materials
- **Grade & Subject Navigation**: Intuitive navigation through different grades and subjects
- **Standards Integration**: Link curriculum content to educational standards with searchable categories
- **Biblical Integration**: Incorporate biblical principles and values into curriculum content
- **Real-time Editing**: Inline editing capabilities for quick content updates
- **Mobile Responsive**: Fully responsive design that works on all devices

### Database Features
- **SQLite Database**: Fast, reliable, and file-based database storage
- **Automatic Migration**: Seamless migration from JSON to SQLite on first run
- **Data Export/Import**: Full database export and import functionality
- **Search Capabilities**: Full-text search across curriculum content
- **Database Statistics**: Real-time statistics and analytics

### API Endpoints

#### Curriculum Management
- `GET /api/curriculum/:grade/:subject` - Get curriculum rows for specific grade/subject
- `GET /api/curriculum/all` - Get all curriculum rows (admin)
- `POST /api/curriculum` - Create new curriculum row
- `PATCH /api/curriculum/:id` - Update curriculum row
- `DELETE /api/curriculum/:id` - Delete curriculum row

#### Standards Management
- `GET /api/standards` - Get all standards
- `GET /api/standards/category/:category` - Get standards by category
- `GET /api/standards/categories` - Get all standard categories
- `POST /api/standards` - Create new standard

#### Data Operations
- `GET /api/export/full-database` - Export full database as JSON
- `POST /api/import/full-database` - Import full database from JSON
- `GET /api/stats` - Get database statistics
- `GET /api/search?q=query` - Search curriculum content

#### Navigation & Discovery
- `GET /api/grades` - Get all available grades
- `GET /api/subjects` - Get all available subjects
- `GET /api/subjects/:grade` - Get subjects for specific grade

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** for styling
- **Radix UI** for accessible components
- **React Hook Form** for form management

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **SQLite** with better-sqlite3 for database
- **Zod** for data validation

### Development Tools
- **Vite** for fast development and building
- **ESBuild** for server-side bundling
- **PM2** for production process management

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/minashoukrala/school_curriculum_mapping.git
   cd school_curriculum_mapping
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

## 🗄️ Database Migration

The application uses SQLite as the primary database:

1. **SQLite Database**: All data is stored in `curriculum.db`
2. **Automatic Schema**: Database schema is created automatically on first run
3. **Data Persistence**: All curriculum rows and standards are stored in SQLite
4. **Performance**: Fast queries and efficient data storage

### Database Schema

```sql
-- Curriculum rows table
CREATE TABLE curriculum_rows (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  grade TEXT NOT NULL,
  subject TEXT NOT NULL,
  objectives TEXT NOT NULL DEFAULT '',
  unit_pacing TEXT NOT NULL DEFAULT '',
  assessments TEXT NOT NULL DEFAULT '',
  materials_and_differentiation TEXT NOT NULL DEFAULT '',
  biblical TEXT NOT NULL DEFAULT '',
  materials TEXT NOT NULL DEFAULT '',
  differentiator TEXT NOT NULL DEFAULT ''
);

-- Standards table
CREATE TABLE standards (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL
);

-- Junction table for many-to-many relationship
CREATE TABLE curriculum_standards (
  curriculum_id INTEGER NOT NULL,
  standard_code TEXT NOT NULL,
  PRIMARY KEY (curriculum_id, standard_code),
  FOREIGN KEY (curriculum_id) REFERENCES curriculum_rows(id) ON DELETE CASCADE,
  FOREIGN KEY (standard_code) REFERENCES standards(code) ON DELETE CASCADE
);
```

## 🚀 Production Deployment

### Using PM2 (Recommended)
```bash
# Build the application
npm run build

# Start in production mode
npm start

# Monitor the application
npm run monitor

# View logs
npm run logs
```

### Manual Deployment
```bash
# Build the application
npm run build

# Start the server
npm run start:single
```

## 📊 Current Data Statistics

- **95 Curriculum Rows** across 10 grades and 14 subjects
- **8 Educational Standards** in 3 categories
- **Complete Biblical Integration** throughout all content
- **Comprehensive Assessment Strategies** for each curriculum item

## 🔧 Development Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server with PM2
- `npm run check` - TypeScript type checking
- `npm run db:push` - Push database schema changes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [CHANGELOG.md](CHANGELOG.md) for recent updates
- Review the [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines

---

**Built with ❤️ for educational excellence and biblical integration** 