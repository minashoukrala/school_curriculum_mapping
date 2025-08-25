// Using built-in fetch (Node.js 18+)

const API_BASE = 'https://curriculum-crafter.onrender.com/api';

async function checkAndCleanDatabase() {
  try {
    console.log('🔍 Checking database via API...\n');

    // First, try to fix empty table names using our existing endpoint
    console.log('🔧 Attempting to fix empty table names...');
    try {
      const fixResponse = await fetch(`${API_BASE}/fix-empty-table-names`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (fixResponse.ok) {
        const fixResult = await fixResponse.json();
        console.log(`✅ Fixed ${fixResult.updatedCount} entries with empty tableName`);
      } else {
        console.log('❌ Could not fix empty table names via API');
      }
    } catch (error) {
      console.log('❌ Error fixing empty table names:', error.message);
    }

    // Now try to get some basic stats by checking a few known endpoints
    console.log('\n📊 Checking database statistics...');

    // Try to get standards count
    try {
      const standardsResponse = await fetch(`${API_BASE}/standards`);
      if (standardsResponse.ok) {
        const standards = await standardsResponse.json();
        console.log(`📚 Total Standards: ${standards.length}`);
      } else {
        console.log('📚 Standards: Could not fetch');
      }
    } catch (error) {
      console.log('📚 Standards: Error fetching');
    }

    // Try to get navigation tabs
    try {
      const tabsResponse = await fetch(`${API_BASE}/navigation-tabs`);
      if (tabsResponse.ok) {
        const tabs = await tabsResponse.json();
        console.log(`📑 Total Navigation Tabs: ${tabs.length}`);
      } else {
        console.log('📑 Navigation Tabs: Could not fetch');
      }
    } catch (error) {
      console.log('📑 Navigation Tabs: Error fetching');
    }

    // Try to get dropdown items
    try {
      const dropdownResponse = await fetch(`${API_BASE}/dropdown-items`);
      if (dropdownResponse.ok) {
        const dropdownItems = await dropdownResponse.json();
        console.log(`🔽 Total Dropdown Items: ${dropdownItems.length}`);
      } else {
        console.log('🔽 Dropdown Items: Could not fetch');
      }
    } catch (error) {
      console.log('🔽 Dropdown Items: Error fetching');
    }

    // Try to get table configs
    try {
      const tableConfigsResponse = await fetch(`${API_BASE}/table-configs`);
      if (tableConfigsResponse.ok) {
        const tableConfigs = await tableConfigsResponse.json();
        console.log(`📋 Total Table Configurations: ${tableConfigs.length}`);
      } else {
        console.log('📋 Table Configurations: Could not fetch');
      }
    } catch (error) {
      console.log('📋 Table Configurations: Error fetching');
    }

    // Try to get curriculum entries for a few known combinations
    console.log('\n📊 Checking curriculum entries...');
    const testCombinations = [
      ['KG', 'Bible Study'],
      ['Grade 1', 'Math'],
      ['Specialists', 'Art']
    ];

    let totalCurriculumEntries = 0;
    for (const [grade, subject] of testCombinations) {
      try {
        const response = await fetch(`${API_BASE}/curriculum/${encodeURIComponent(grade)}/${encodeURIComponent(subject)}`);
        if (response.ok) {
          const rows = await response.json();
          console.log(`  ${grade} - ${subject}: ${rows.length} entries`);
          totalCurriculumEntries += rows.length;
        } else {
          console.log(`  ${grade} - ${subject}: Could not fetch`);
        }
      } catch (error) {
        console.log(`  ${grade} - ${subject}: Error fetching`);
      }
    }

    console.log(`\n📊 Sample Curriculum Entries Found: ${totalCurriculumEntries}`);

  } catch (error) {
    console.error('❌ Error checking database:', error);
  }
}

checkAndCleanDatabase();
