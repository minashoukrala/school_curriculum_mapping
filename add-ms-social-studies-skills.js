// ES module script for adding Middle School Social Studies Skills standards

const msSocialStudiesSkillsStandards = [
  // Uses critical reasoning skills to analyze and evaluate claims
  { code: 'SSS1.6-8.1', description: 'Compare the multiple perspectives and interpretations of historical events.', category: 'Uses critical reasoning skills to analyze and evaluate claims' },
  { code: 'SSS1.6-8.2', description: 'Evaluate the significance of historical events from multiple perspectives.', category: 'Uses critical reasoning skills to analyze and evaluate claims' },
  { code: 'SSS1.6-8.3', description: 'Analyze cause-and-effect relationships to create a timeline of key events.', category: 'Uses critical reasoning skills to analyze and evaluate claims' },
  { code: 'SSS1.6-8.4', description: 'Analyze the credibility, validity, and reliability of information from multiple sources.', category: 'Uses critical reasoning skills to analyze and evaluate claims' },
  { code: 'SSS1.6-8.5', description: 'Evaluate sources for bias and propaganda.', category: 'Uses critical reasoning skills to analyze and evaluate claims' },
  { code: 'SSS1.6-8.6', description: 'Construct arguments, supported by evidence, about historical or social issues.', category: 'Uses critical reasoning skills to analyze and evaluate claims' },

  // Uses inquiry-based research
  { code: 'SSS2.6-8.1', description: 'Develop compelling questions that frame an inquiry.', category: 'Uses inquiry-based research' },
  { code: 'SSS2.6-8.2', description: 'Generate supporting questions to help answer compelling questions.', category: 'Uses inquiry-based research' },
  { code: 'SSS2.6-8.3', description: 'Gather relevant information from multiple primary and secondary sources.', category: 'Uses inquiry-based research' },
  { code: 'SSS2.6-8.4', description: 'Assess the credibility of sources.', category: 'Uses inquiry-based research' },
  { code: 'SSS2.6-8.5', description: 'Cite sources appropriately in written and oral work.', category: 'Uses inquiry-based research' },
  { code: 'SSS2.6-8.6', description: 'Use evidence to answer compelling and supporting questions.', category: 'Uses inquiry-based research' },

  // Deliberates public issues
  { code: 'SSS3.6-8.1', description: 'Engage in discussions to understand diverse perspectives on public issues.', category: 'Deliberates public issues' },
  { code: 'SSS3.6-8.2', description: 'Construct claims and counterclaims while supporting them with reasoning and evidence.', category: 'Deliberates public issues' },
  { code: 'SSS3.6-8.3', description: 'Evaluate different ways of addressing public issues.', category: 'Deliberates public issues' },
  { code: 'SSS3.6-8.4', description: 'Demonstrate respect and civic responsibility while deliberating public issues.', category: 'Deliberates public issues' },

  // Creates a product that uses social studies content to support a claim
  { code: 'SSS4.6-8.1', description: 'Construct arguments using claims and evidence from multiple sources.', category: 'Creates a product that uses social studies content to support a claim' },
  { code: 'SSS4.6-8.2', description: 'Present social studies arguments and explanations using technology, visuals, and writing.', category: 'Creates a product that uses social studies content to support a claim' },
  { code: 'SSS4.6-8.3', description: 'Use social studies content to take informed action on a public issue.', category: 'Creates a product that uses social studies content to support a claim' }
];

async function addMSSocialStudiesSkillsStandards() {
  console.log('Adding Middle School Social Studies Skills standards to the database...');
  
  for (const standard of msSocialStudiesSkillsStandards) {
    try {
      const response = await fetch('https://ecs-curriculum.onrender.com/api/standards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(standard),
      });

      if (response.ok) {
        console.log(`✅ Added: ${standard.code}`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Failed to add ${standard.code}: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Error adding ${standard.code}: ${error.message}`);
    }
  }
  
  console.log('Finished adding Middle School Social Studies Skills standards!');
}

addMSSocialStudiesSkillsStandards();
