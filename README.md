# CurriculumCrafter

A simple, modern curriculum management system built with React, TypeScript, and SQLite. This system allows educators to create, manage, and organize curriculum content with a dynamic navigation structure.

## Features

### 🎯 Core Functionality
- **Dynamic Navigation Management**: Create and manage navigation tabs, dropdown items, and table configurations through an intuitive admin interface
- **Curriculum Management**: Add, edit, and delete curriculum entries with support for objectives, assessments, materials, and biblical integration
- **Standards Integration**: Link curriculum entries to educational standards with search and filtering capabilities
- **School Year Management**: Set and update the school year that appears across all curriculum pages

### 🛠️ Admin Features
- **Table Management**: Dynamically create and configure tables for each subject with automatic system name conversion
- **Database Export/Import**: Full database backup and restore functionality including navigation structure
- **Real-time Updates**: Changes in admin interface immediately reflect across the application
- **Automatic Data Setup**: Creating table configurations automatically generates sample curriculum rows

### 📱 User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Modern UI**: Clean, intuitive interface built with Tailwind CSS and shadcn/ui components
- **Fast Performance**: Optimized with React Query for efficient data fetching and caching
- **Accessibility**: Built with accessibility best practices in mind

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Backend**: Node.js, Express.js
- **Database**: SQLite with better-sqlite3
- **UI Components**: Tailwind CSS, shadcn/ui
- **State Management**: TanStack Query (React Query)
- **Validation**: Zod schema validation

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/minashoukrala/school_curriculum_mapping.git
   cd school_curriculum_mapping
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Database Setup
The system automatically creates and initializes the SQLite database on first run. No additional setup required.

## Project Structure

```
CurriculumCrafter/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Main application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions and configurations
├── server/                # Express.js backend
│   ├── db.ts             # Database operations
│   ├── storage.ts        # Data storage interface
│   └── index.ts          # Server entry point
├── shared/               # Shared TypeScript interfaces and schemas
└── curriculum.db         # SQLite database file
```

## Usage

### Navigation Management
1. Navigate to **Admin → Table Management**
2. Create navigation tabs for different grade levels
3. Add dropdown items for subjects under each tab
4. Configure tables for each subject with custom display names

### Curriculum Management
1. Select a grade and subject from the navigation
2. Add curriculum entries using the "Add Curriculum Row" button
3. Edit entries inline or through the edit modal
4. Link entries to educational standards as needed

### Database Operations
- **Export**: Download a complete backup of all data and structure
- **Import**: Restore from a previous backup (completely replaces current data)

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Database Schema
The system uses the following main tables:
- `curriculum_rows` - Curriculum entries
- `standards` - Educational standards
- `navigation_tabs` - Main navigation structure
- `dropdown_items` - Subject dropdowns
- `table_configs` - Table configurations
- `school_year` - School year setting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue on GitHub or contact the development team.

---

**CurriculumCrafter** - Simplifying curriculum management for educators. 