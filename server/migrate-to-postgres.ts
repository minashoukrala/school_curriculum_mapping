import { sqliteStorage } from './db';
import { PostgreSQLStorage } from './postgres-db';
import * as fs from 'fs/promises';
import * as path from 'path';

async function migrateToPostgreSQL() {
  console.log('Starting migration from SQLite to PostgreSQL...');
  
  try {
    // Initialize PostgreSQL storage
    const postgresStorage = new PostgreSQLStorage();
    
    // Export all data from SQLite
    console.log('Exporting data from SQLite...');
    const allRows = await sqliteStorage.getAllCurriculumRows();
    const standards = await sqliteStorage.getAllStandards();
    const navigationTabs = await sqliteStorage.getAllNavigationTabs();
    const dropdownItems = await sqliteStorage.getAllDropdownItems();
    const tableConfigs = await sqliteStorage.getAllTableConfigs();
    const schoolYear = await sqliteStorage.getSchoolYear();
    
    console.log(`Exported ${allRows.length} curriculum rows`);
    console.log(`Exported ${standards.length} standards`);
    console.log(`Exported ${navigationTabs.length} navigation tabs`);
    console.log(`Exported ${dropdownItems.length} dropdown items`);
    console.log(`Exported ${tableConfigs.length} table configs`);
    
    // Import data to PostgreSQL
    console.log('Importing data to PostgreSQL...');
    await postgresStorage.importFullDatabase({
      curriculumRows: allRows,
      standards,
      navigationTabs,
      dropdownItems,
      tableConfigs,
      schoolYear,
      metadata: {
        migrationDate: new Date().toISOString(),
        source: 'SQLite',
        destination: 'PostgreSQL',
        version: '1.0'
      }
    });
    
    // Verify migration
    console.log('Verifying migration...');
    const postgresRows = await postgresStorage.getAllCurriculumRows();
    const postgresStandards = await postgresStorage.getAllStandards();
    const postgresTabs = await postgresStorage.getAllNavigationTabs();
    const postgresDropdowns = await postgresStorage.getAllDropdownItems();
    const postgresConfigs = await postgresStorage.getAllTableConfigs();
    
    console.log(`PostgreSQL now has ${postgresRows.length} curriculum rows`);
    console.log(`PostgreSQL now has ${postgresStandards.length} standards`);
    console.log(`PostgreSQL now has ${postgresTabs.length} navigation tabs`);
    console.log(`PostgreSQL now has ${postgresDropdowns.length} dropdown items`);
    console.log(`PostgreSQL now has ${postgresConfigs.length} table configs`);
    
    // Create backup of SQLite data
    console.log('Creating backup of SQLite data...');
    const backupData = {
      curriculumRows: allRows,
      standards,
      navigationTabs,
      dropdownItems,
      tableConfigs,
      schoolYear,
      metadata: {
        backupDate: new Date().toISOString(),
        source: 'SQLite',
        version: '1.0'
      }
    };
    
    const backupPath = path.join(process.cwd(), `sqlite-backup-${new Date().toISOString().split('T')[0]}.json`);
    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));
    console.log(`SQLite backup created at: ${backupPath}`);
    
    console.log('Migration completed successfully!');
    console.log('');
    console.log('To switch to PostgreSQL, set the environment variable:');
    console.log('USE_POSTGRES=true');
    console.log('');
    console.log('Or set:');
    console.log('DB_TYPE=postgres');
    console.log('');
    console.log('Make sure to set the following PostgreSQL environment variables:');
    console.log('DB_HOST=localhost');
    console.log('DB_PORT=5432');
    console.log('DB_NAME=curriculum_crafter');
    console.log('DB_USER=postgres');
    console.log('DB_PASSWORD=your_password');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrateToPostgreSQL();
}

export { migrateToPostgreSQL };
