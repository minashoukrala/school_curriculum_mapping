# Backup Files

This folder contains the most recent and important backup files for the Curriculum Crafter application.

## Files

### `comprehensive-backup-2025-08-25.json`
- **Type**: Complete database backup
- **Contents**: All curriculum rows, standards, navigation tabs, dropdown items, table configurations, and school year data
- **Size**: ~206KB
- **Use**: Full database restoration including all navigation structure and relationships

### `comprehensive-backup-summary-2025-08-25.txt`
- **Type**: Summary report
- **Contents**: Detailed breakdown of all data in the comprehensive backup
- **Use**: Quick reference for what data is included in the backup

### `complete-standards-backup-2025-08-25.json`
- **Type**: Standards-only backup
- **Contents**: All standards data (used and unused)
- **Size**: ~182KB
- **Use**: Standards restoration when only standards data is needed

## Usage

These backup files can be used with the new export/import system implemented in the `fix-export-import` branch:

- **PostgreSQL Backup**: Use the new `/api/export/full-database` endpoint for complete database backups
- **JSON Import**: Use the new `/api/import/json` endpoint to restore from JSON backups
- **PostgreSQL Restore**: Use the new `/api/import/full-database` endpoint for SQL backup restoration

## Backup Date
All files were created on **August 25, 2025** and represent the state of the database before the export/import system improvements.

## Important Notes
- These backups preserve all `tableName` fields and relationships
- All navigation structure (tabs, dropdowns, table configs) is included
- Data integrity is maintained for perfect restoration
