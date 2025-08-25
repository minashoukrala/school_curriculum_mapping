// Using built-in fetch (Node.js 18+)

const API_BASE = 'https://curriculum-crafter.onrender.com/api';

async function checkDatabase() {
  try {
    console.log('🔍 Checking database contents...\n');

    // Get all curriculum rows
    const allRowsResponse = await fetch(`${API_BASE}/curriculum/all`);
    if (!allRowsResponse.ok) {
      throw new Error(`Curriculum API failed: ${allRowsResponse.status}`);
    }
    const allRows = await allRowsResponse.json();
    console.log(`📊 Total Curriculum Entries: ${allRows.length}`);

    // Check entries with empty tableName
    const emptyTableNameRows = allRows.filter(row => !row.tableName || row.tableName === '');
    console.log(`❌ Entries with empty tableName: ${emptyTableNameRows.length}`);

    if (emptyTableNameRows.length > 0) {
      console.log('\n🗑️  Entries with empty tableName:');
      emptyTableNameRows.forEach(row => {
        console.log(`  - ID: ${row.id}, Grade: ${row.grade}, Subject: ${row.subject}, tableName: "${row.tableName}"`);
      });

      // Delete entries with empty tableName
      console.log('\n🧹 Deleting entries with empty tableName...');
      let deletedCount = 0;
      
      for (const row of emptyTableNameRows) {
        try {
          const deleteResponse = await fetch(`${API_BASE}/curriculum/${row.id}`, {
            method: 'DELETE'
          });
          
          if (deleteResponse.ok) {
            console.log(`  ✅ Deleted ID: ${row.id} (${row.grade} - ${row.subject})`);
            deletedCount++;
          } else {
            console.log(`  ❌ Failed to delete ID: ${row.id}: ${deleteResponse.status}`);
          }
        } catch (error) {
          console.log(`  ❌ Error deleting ID: ${row.id}:`, error.message);
        }
      }

      console.log(`\n🎯 Successfully deleted ${deletedCount} entries with empty tableName`);
    } else {
      console.log('\n✅ No entries with empty tableName found!');
    }

    // Check standards count
    try {
      const standardsResponse = await fetch(`${API_BASE}/standards`);
      if (standardsResponse.ok) {
        const standards = await standardsResponse.json();
        console.log(`\n📚 Total Standards: ${standards.length}`);
      }
    } catch (error) {
      console.log('\n📚 Standards: Could not fetch');
    }

    // Check navigation tabs
    try {
      const tabsResponse = await fetch(`${API_BASE}/navigation-tabs`);
      if (tabsResponse.ok) {
        const tabs = await tabsResponse.json();
        console.log(`📑 Total Navigation Tabs: ${tabs.length}`);
      }
    } catch (error) {
      console.log('📑 Navigation Tabs: Could not fetch');
    }

    // Check dropdown items
    try {
      const dropdownResponse = await fetch(`${API_BASE}/dropdown-items`);
      if (dropdownResponse.ok) {
        const dropdownItems = await dropdownResponse.json();
        console.log(`🔽 Total Dropdown Items: ${dropdownItems.length}`);
      }
    } catch (error) {
      console.log('🔽 Dropdown Items: Could not fetch');
    }

    // Check table configs
    try {
      const tableConfigsResponse = await fetch(`${API_BASE}/table-configs`);
      if (tableConfigsResponse.ok) {
        const tableConfigs = await tableConfigsResponse.json();
        console.log(`📋 Total Table Configurations: ${tableConfigs.length}`);
      }
    } catch (error) {
      console.log('📋 Table Configurations: Could not fetch');
    }

    // Final count after cleanup
    if (emptyTableNameRows.length > 0) {
      const finalRowsResponse = await fetch(`${API_BASE}/curriculum/all`);
      const finalRows = await finalRowsResponse.json();
      console.log(`\n📊 Final Curriculum Entries (after cleanup): ${finalRows.length}`);
    }

  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

checkDatabase();
