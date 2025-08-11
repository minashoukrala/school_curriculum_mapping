# PostgreSQL Migration Guide

This guide explains how to migrate from SQLite to PostgreSQL while maintaining all database connections and functionality.

## Overview

The application now supports both SQLite and PostgreSQL databases. The migration maintains the exact same API interface, so all frontend functionality remains unchanged.

## Prerequisites

1. **PostgreSQL Installation**: Make sure PostgreSQL is installed and running on your system
2. **Database Creation**: Create a PostgreSQL database named `curriculum_crafter` (or configure a different name)

## Environment Variables

To use PostgreSQL, set one of these environment variables:

```bash
# Option 1: Use the USE_POSTGRES flag
USE_POSTGRES=true

# Option 2: Use the DB_TYPE flag
DB_TYPE=postgres
```

### PostgreSQL Configuration

Set these environment variables for PostgreSQL connection:

```bash
DB_HOST=localhost          # PostgreSQL host (default: localhost)
DB_PORT=5432              # PostgreSQL port (default: 5432)
DB_NAME=curriculum_crafter # Database name (default: curriculum_crafter)
DB_USER=postgres          # Database user (default: postgres)
DB_PASSWORD=your_password # Database password (required)
```

For production, you might also want to set:
```bash
NODE_ENV=production       # Enables SSL connections
```

## Migration Steps

### 1. Install Dependencies

The PostgreSQL dependencies are already included in the project:
- `pg` - PostgreSQL client for Node.js
- `@types/pg` - TypeScript definitions

### 2. Set Up PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE curriculum_crafter;

# Exit psql
\q
```

### 3. Run Migration

```bash
# Run the migration script
npm run migrate:to-postgres
```

This script will:
- Export all data from SQLite
- Import data to PostgreSQL
- Create a backup of your SQLite data
- Verify the migration was successful

### 4. Switch to PostgreSQL

Set the environment variable to use PostgreSQL:

```bash
export USE_POSTGRES=true
# or
export DB_TYPE=postgres
```

### 5. Test the Application

Start the application and verify all functionality works:

```bash
npm run dev
```

## Database Schema

The PostgreSQL schema is identical to SQLite with these PostgreSQL-specific optimizations:

### Tables Created
- `curriculum_rows` - Main curriculum data
- `standards` - Educational standards
- `curriculum_standards` - Many-to-many relationship
- `school_year` - School year configuration
- `navigation_tabs` - Navigation structure
- `dropdown_items` - Dropdown menu items
- `table_configs` - Table configurations

### Key Differences from SQLite
- Uses `SERIAL` for auto-incrementing IDs
- Uses `TIMESTAMP` for date/time fields
- Uses `STRING_AGG` instead of `GROUP_CONCAT`
- Uses `ILIKE` for case-insensitive search
- Uses parameterized queries with `$1, $2, etc.`

## API Compatibility

All API endpoints remain exactly the same:

### Curriculum Endpoints
- `GET /api/curriculum/:grade/:subject`
- `GET /api/curriculum/all`
- `POST /api/curriculum`
- `PATCH /api/curriculum/:id`
- `DELETE /api/curriculum/:id`

### Standards Endpoints
- `GET /api/standards`
- `GET /api/standards/category/:category`
- `POST /api/standards`

### Utility Endpoints
- `GET /api/export/full-database`
- `GET /api/stats`
- `GET /api/grades`
- `GET /api/subjects`
- `GET /api/subjects/:grade`
- `GET /api/standards/categories`
- `GET /api/search`

## Rollback Plan

If you need to rollback to SQLite:

1. **Remove PostgreSQL environment variables**:
   ```bash
   unset USE_POSTGRES
   unset DB_TYPE
   ```

2. **Restore from backup** (if needed):
   - Use the backup file created during migration
   - Import data back to SQLite using the admin interface

## Performance Considerations

### PostgreSQL Advantages
- Better concurrent access
- More robust transaction handling
- Better performance with large datasets
- Advanced query optimization
- Better indexing capabilities

### Connection Pooling
The PostgreSQL implementation uses connection pooling with these settings:
- Maximum 20 connections
- 30-second idle timeout
- 2-second connection timeout

## Troubleshooting

### Common Issues

1. **Connection Refused**
   - Ensure PostgreSQL is running
   - Check host and port settings
   - Verify firewall settings

2. **Authentication Failed**
   - Check username and password
   - Verify user has access to the database

3. **Database Not Found**
   - Create the database: `CREATE DATABASE curriculum_crafter;`
   - Check the `DB_NAME` environment variable

4. **SSL Issues**
   - For development: Set `NODE_ENV=development`
   - For production: Configure SSL certificates

### Debug Mode

To see detailed connection information, check the console logs when starting the application.

## Production Deployment

For production deployment:

1. **Use a managed PostgreSQL service** (recommended):
   - AWS RDS
   - Google Cloud SQL
   - Azure Database for PostgreSQL
   - Heroku Postgres

2. **Set production environment variables**:
   ```bash
   NODE_ENV=production
   DB_HOST=your-production-host
   DB_PORT=5432
   DB_NAME=curriculum_crafter
   DB_USER=your-production-user
   DB_PASSWORD=your-secure-password
   ```

3. **Enable SSL** (automatically enabled in production mode)

4. **Set up connection pooling** (already configured in the code)

## Data Integrity

The migration process ensures data integrity by:
- Using transactions for all operations
- Verifying data counts before and after migration
- Creating automatic backups
- Maintaining referential integrity with foreign keys

## Support

If you encounter issues during migration:
1. Check the console logs for detailed error messages
2. Verify your PostgreSQL installation and configuration
3. Ensure all environment variables are set correctly
4. Check that the database user has appropriate permissions
