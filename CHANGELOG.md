# Changelog

All notable changes to this project will be documented in this file.

## [2.0.0] - 2025-07-26

### Added
- **Dynamic Navigation Management**: Complete overhaul of navigation system with database-driven tabs and dropdowns
- **Table Management System**: Admin interface to create and configure tables for each subject
- **Automatic System Name Conversion**: Display names with spaces automatically convert to system-friendly names
- **Enhanced Export/Import**: Full database backup including navigation structure, table configs, and all data
- **Real-time Admin Updates**: Changes in admin interface immediately reflect across the application
- **Automatic Data Setup**: Creating table configurations automatically generates sample curriculum rows
- **Orphaned Data Cleanup**: Automatic cleanup of curriculum rows not linked to table configurations

### Changed
- **Database Schema**: Added new tables for navigation tabs, dropdown items, and table configurations
- **Admin Interface**: Completely redesigned admin section with Table Management and Database Export
- **Navigation System**: Replaced hardcoded navigation with dynamic database-driven structure
- **Table Display**: Multiple tables can now be configured per subject with individual management
- **System Architecture**: Improved separation of display names and system names for better compatibility

### Fixed
- **Cache Invalidation**: Resolved issues with admin changes not reflecting in main interface
- **Data Consistency**: Fixed orphaned curriculum rows and table configuration mismatches
- **Admin Tab Protection**: Admin tab is now immutable and always positioned last
- **Foreign Key Constraints**: Resolved database constraint issues with table configuration creation

## [1.1.0] - 2025-07-25

### Added
- **School Year Management**: Admin can edit the school year that appears on all curriculum pages
- **Enhanced Database Operations**: Improved export/import functionality with validation
- **Admin Interface**: Dedicated admin section with database management tools

### Changed
- **Database Schema**: Added school_year table for global school year setting
- **UI Improvements**: Better admin interface with school year editing capabilities

## [1.0.0] - 2025-07-24

### Added
- **Initial Release**: Complete curriculum management system
- **Curriculum Management**: Create, edit, and delete curriculum entries
- **Standards Integration**: Link curriculum to educational standards
- **Biblical Integration**: Incorporate biblical principles into curriculum
- **SQLite Database**: Fast, reliable data storage
- **Export/Import**: Database backup and restore functionality
- **Responsive Design**: Mobile-friendly interface
- **Search Capabilities**: Full-text search across curriculum content

### Features
- Grade and subject navigation
- Inline editing capabilities
- Standards categorization and filtering
- Database statistics and analytics
- Real-time data updates
- Modern UI with Tailwind CSS

---

**CurriculumCrafter** - A simple, modern curriculum management system for educators. 