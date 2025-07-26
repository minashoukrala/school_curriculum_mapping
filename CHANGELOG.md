# Changelog

All notable changes to the Schools Curriculum Mapping Tool will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- School year management feature with database persistence
- Editable school year in admin page
- Global school year display on all curriculum pages
- SQLite database implementation (sqllit branch)
- Enhanced admin interface with school year controls

### Changed
- Migrated from JSON file storage to SQLite database
- Improved database performance and reliability
- Enhanced admin page with school year management section
- Updated API endpoints for school year operations

### Fixed
- Database update logic for standards-only updates
- API route registration and consistency
- Frontend state management for school year editing

## [1.1.0] - 2024-01-20

### Added
- **School Year Management System**
  - New `school_year` table in SQLite database
  - `GET /api/school-year` and `PATCH /api/school-year` endpoints
  - Editable school year input in admin page
  - Real-time school year updates across all pages
  - Database persistence for school year changes
  - Admin-only access to school year editing

- **SQLite Database Implementation**
  - Complete migration from JSON to SQLite
  - Better-sqlite3 for high-performance database operations
  - Automatic database schema creation
  - Enhanced data integrity and concurrent access
  - Improved query performance

- **Enhanced Admin Features**
  - School year management section in admin page
  - Real-time database statistics
  - Improved export/import functionality
  - Better error handling and validation

### Changed
- **Database Architecture**: Replaced JSON file storage with SQLite
- **API Structure**: Consolidated API routes for better consistency
- **Frontend State Management**: Enhanced React Query integration
- **Error Handling**: Improved validation and error messages

### Technical Improvements
- **Performance**: Faster database queries and data operations
- **Reliability**: Better data integrity with SQLite transactions
- **Scalability**: Support for larger datasets and concurrent users
- **Maintainability**: Cleaner code structure and better separation of concerns

## [1.0.0] - 2024-01-15

### Added
- Initial release of Schools Curriculum Mapping Tool
- Multi-grade curriculum management (KG to Grade 8)
- Specialist subjects support (Art, Spanish, Music, Technology, PE)
- Mobile-responsive design with touch-friendly interface
- Full CRUD operations for curriculum entries
- Admin panel with database export/import functionality
- Azure Web App deployment support
- Performance optimizations (caching, compression, clustering)
- Security features (rate limiting, file locking, input validation)
- Progressive Web App capabilities
- Comprehensive data validation with Zod schemas
- Error boundary implementation for React components
- URL state management for grade/subject persistence
- Dynamic subject lists per grade level
- Specialist grade-specific tables (Grade 1-5)
- Database backup and restore functionality
- Mobile hamburger navigation
- Touch-optimized modals and forms
- Responsive table layouts for mobile devices
- Compression middleware for faster loading
- PM2 clustering for multi-core utilization
- In-memory caching with 5-minute timeout
- File locking with proper-lockfile
- Rate limiting (1000 requests/minute per IP)
- Response caching headers
- Comprehensive import validation
- Export functionality for full database
- Admin section with database statistics
- Error handling and logging
- TypeScript type safety throughout
- Tailwind CSS for responsive design
- Radix UI components for accessibility
- React Query for efficient data fetching
- Wouter for client-side routing

### Technical Features
- Express.js backend with TypeScript
- React 18 frontend with TypeScript
- File-based JSON storage with concurrent access
- Vite for fast development and building
- PM2 for production process management
- Proper error boundaries and fallback UI
- Comprehensive mobile optimization
- Security headers and CORS configuration
- Static file serving for assets
- Development and production configurations

### Performance
- Supports 50+ concurrent users
- Handles 30+ concurrent editors
- 100+ concurrent readers with caching
- Optimized for mobile network conditions
- Fast loading with compression and caching
- Efficient data fetching with React Query

### Security
- Input validation with Zod schemas
- Rate limiting to prevent abuse
- File locking for data integrity
- Security headers implementation
- CORS configuration
- Error handling without information leakage

### Mobile Support
- Responsive design for all screen sizes
- Touch-friendly interface
- Hamburger navigation for mobile
- Optimized table layouts
- Fast loading on mobile networks
- Progressive Web App ready

## [0.9.0] - 2024-01-10

### Added
- Beta version with core curriculum management
- Basic grade and subject structure
- Simple CRUD operations
- Mobile-responsive design foundation

### Changed
- Initial mobile optimization
- Basic performance improvements

### Fixed
- Core functionality bugs
- Mobile display issues

## [0.8.0] - 2024-01-05

### Added
- Alpha version with basic features
- Simple curriculum entry system
- Basic web interface

### Changed
- Initial development version

### Fixed
- Basic functionality issues

---

## Version History

- **1.1.0**: SQLite implementation with school year management
- **1.0.0**: Production-ready release with full feature set
- **0.9.0**: Beta version with core functionality
- **0.8.0**: Alpha version with basic features

## Future Roadmap

### Version 1.2.0 (Planned)
- Enhanced mobile performance
- Additional reporting features
- Advanced search capabilities

### Version 1.3.0 (Planned)
- Azure AD integration
- Advanced analytics
- Bulk operations

### Version 2.0.0 (Planned)
- Real-time collaboration
- Offline capabilities
- Advanced integrations 