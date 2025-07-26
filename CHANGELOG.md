# Changelog

All notable changes to this project will be documented in this file.

## [2.1.0] - 2025-07-26

### Added
- **Cascade Deletion System**: Deleting navigation tabs, dropdown items, or table configurations automatically removes all associated data
- **Admin Tab Protection**: Admin tab is now immutable, cannot be deleted or modified, and always positioned last
- **Orphaned Data Cleanup**: Automatic detection and cleanup of curriculum entries without table configurations
- **Performance Monitoring**: Added cleanup API endpoint for manual orphaned data removal
- **Transaction Safety**: All cascade operations use database transactions for data integrity
- **Enhanced Error Handling**: Better error messages and validation for admin operations

### Changed
- **Database Operations**: Enhanced deletion methods to cascade through all related data
- **Admin Interface**: Improved protection and ordering of Admin tab in navigation
- **Data Integrity**: All operations now use transactions to prevent partial deletions
- **Performance**: Optimized cascade deletion with efficient SQL queries

### Fixed
- **Data Consistency**: Resolved issues with orphaned curriculum entries after tab deletions
- **Admin Tab Security**: Prevented accidental deletion or modification of Admin tab
- **Cascade Operations**: Fixed issues where deleting tabs didn't properly clean up all related data
- **Database Locks**: Improved transaction handling to prevent database lock contention

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