import { Pool } from 'pg';

// PostgreSQL connection configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:password@localhost:5432/curriculum_crafter',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function checkAndCleanDatabase() {
  const client = await pool.connect();
  
  try {
    console.log('🔍 Checking PostgreSQL database contents...\n');

    // Check total curriculum entries
    const totalRowsResult = await client.query('SELECT COUNT(*) as count FROM curriculum_rows');
    const totalRows = parseInt(totalRowsResult.rows[0].count);
    console.log(`📊 Total Curriculum Entries: ${totalRows}`);

    // Check entries with empty tableName
    const emptyTableNameResult = await client.query(`
      SELECT id, grade, subject, table_name 
      FROM curriculum_rows 
      WHERE table_name = '' OR table_name IS NULL
    `);
    
    const emptyTableNameRows = emptyTableNameResult.rows;
    console.log(`❌ Entries with empty tableName: ${emptyTableNameRows.length}`);

    if (emptyTableNameRows.length > 0) {
      console.log('\n🗑️  Entries with empty tableName:');
      emptyTableNameRows.forEach(row => {
        console.log(`  - ID: ${row.id}, Grade: ${row.grade}, Subject: ${row.subject}, tableName: "${row.table_name}"`);
      });

      // Delete entries with empty tableName
      console.log('\n🧹 Deleting entries with empty tableName...');
      const deleteResult = await client.query(`
        DELETE FROM curriculum_rows 
        WHERE table_name = '' OR table_name IS NULL
      `);
      
      console.log(`🎯 Successfully deleted ${deleteResult.rowCount} entries with empty tableName`);
    } else {
      console.log('\n✅ No entries with empty tableName found!');
    }

    // Check standards count
    const standardsResult = await client.query('SELECT COUNT(*) as count FROM standards');
    const totalStandards = parseInt(standardsResult.rows[0].count);
    console.log(`\n📚 Total Standards: ${totalStandards}`);

    // Check navigation tabs
    const tabsResult = await client.query('SELECT COUNT(*) as count FROM navigation_tabs');
    const totalTabs = parseInt(tabsResult.rows[0].count);
    console.log(`📑 Total Navigation Tabs: ${totalTabs}`);

    // Check dropdown items
    const dropdownResult = await client.query('SELECT COUNT(*) as count FROM dropdown_items');
    const totalDropdownItems = parseInt(dropdownResult.rows[0].count);
    console.log(`🔽 Total Dropdown Items: ${totalDropdownItems}`);

    // Check table configs
    const tableConfigsResult = await client.query('SELECT COUNT(*) as count FROM table_configs');
    const totalTableConfigs = parseInt(tableConfigsResult.rows[0].count);
    console.log(`📋 Total Table Configurations: ${totalTableConfigs}`);

    // Final count after cleanup
    if (emptyTableNameRows.length > 0) {
      const finalRowsResult = await client.query('SELECT COUNT(*) as count FROM curriculum_rows');
      const finalRows = parseInt(finalRowsResult.rows[0].count);
      console.log(`\n📊 Final Curriculum Entries (after cleanup): ${finalRows}`);
    }

    // Show some sample data to verify
    console.log('\n📋 Sample curriculum entries (first 5):');
    const sampleResult = await client.query(`
      SELECT id, grade, subject, table_name 
      FROM curriculum_rows 
      ORDER BY id 
      LIMIT 5
    `);
    
    sampleResult.rows.forEach(row => {
      console.log(`  - ID: ${row.id}, Grade: ${row.grade}, Subject: ${row.subject}, tableName: "${row.table_name}"`);
    });

  } catch (error) {
    console.error('❌ Error checking database:', error);
  } finally {
    client.release();
    await pool.end();
  }
}

checkAndCleanDatabase();
