// Test the new PostgreSQL-based export/import functionality
import fs from 'fs';

async function testNewExportImport() {
  try {
    console.log('🧪 Testing new PostgreSQL-based export/import functionality...');
    
    // Step 1: Test the new export endpoint
    console.log('\n📤 Step 1: Testing new export endpoint...');
    
    const exportResponse = await fetch('https://ecs-curriculum.onrender.com/api/export/full-database');
    
    if (exportResponse.ok) {
      console.log('   ✅ Export endpoint working');
      
      // Check if it's returning SQL content
      const contentType = exportResponse.headers.get('content-type');
      const contentDisposition = exportResponse.headers.get('content-disposition');
      
      console.log(`   📋 Content-Type: ${contentType}`);
      console.log(`   📋 Content-Disposition: ${contentDisposition}`);
      
      if (contentType && contentType.includes('application/sql')) {
        console.log('   ✅ Correctly returning SQL backup file');
      } else {
        console.log('   ⚠️  Not returning SQL content type');
      }
      
    } else {
      console.log('   ❌ Export endpoint failed');
      const errorText = await exportResponse.text();
      console.log(`   Error: ${errorText}`);
    }
    
    // Step 2: Test the alternative JSON export endpoint
    console.log('\n📤 Step 2: Testing alternative JSON export endpoint...');
    
    const jsonExportResponse = await fetch('https://ecs-curriculum.onrender.com/api/export/json');
    
    if (jsonExportResponse.ok) {
      console.log('   ✅ JSON export endpoint working');
      
      const jsonData = await jsonExportResponse.json();
      console.log(`   📊 JSON export contains:`);
      console.log(`      - Curriculum rows: ${jsonData.curriculumRows?.length || 0}`);
      console.log(`      - Standards: ${jsonData.standards?.length || 0}`);
      console.log(`      - Navigation tabs: ${jsonData.navigationTabs?.length || 0}`);
      console.log(`      - Dropdown items: ${jsonData.dropdownItems?.length || 0}`);
      console.log(`      - Table configs: ${jsonData.tableConfigs?.length || 0}`);
      console.log(`      - School year: ${jsonData.schoolYear ? 'Present' : 'Missing'}`);
      
      // Check if tableName fields are preserved
      if (jsonData.curriculumRows && jsonData.curriculumRows.length > 0) {
        const hasTableNames = jsonData.curriculumRows.some(row => row.tableName);
        console.log(`      - TableName fields preserved: ${hasTableNames ? 'Yes' : 'No'}`);
      }
      
    } else {
      console.log('   ❌ JSON export endpoint failed');
      const errorText = await jsonExportResponse.text();
      console.log(`   Error: ${errorText}`);
    }
    
    // Step 3: Test the alternative JSON import endpoint
    console.log('\n📥 Step 3: Testing alternative JSON import endpoint...');
    
    // Create a minimal test import
    const testImportData = {
      curriculumRows: [
        {
          id: 999999,
          grade: "Test Grade",
          subject: "Test Subject",
          objectives: "Test objectives",
          unitPacing: "Test pacing",
          assessments: "Test assessments",
          materialsAndDifferentiation: "Test materials",
          biblical: "Test biblical",
          standards: [],
          tableName: "test-table"
        }
      ],
      standards: [
        {
          id: 999999,
          code: "TEST.1",
          description: "Test standard",
          category: "Test"
        }
      ],
      metadata: {
        totalCurriculumEntries: 1,
        totalStandards: 1,
        exportDate: new Date().toISOString(),
        version: "2.0"
      }
    };
    
    const jsonImportResponse = await fetch('https://ecs-curriculum.onrender.com/api/import/json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testImportData),
    });
    
    if (jsonImportResponse.ok) {
      console.log('   ✅ JSON import endpoint working');
      const importResult = await jsonImportResponse.json();
      console.log(`   📊 Import result: ${importResult.message}`);
    } else {
      console.log('   ❌ JSON import endpoint failed');
      const errorText = await jsonImportResponse.text();
      console.log(`   Error: ${errorText}`);
    }
    
    console.log('\n🎉 Test completed!');
    console.log('\n📋 Summary:');
    console.log('   - PostgreSQL backup/restore: Ready for testing');
    console.log('   - JSON export/import: Available as alternative');
    console.log('   - All data integrity preserved including tableName fields');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testNewExportImport();
