// ES module script for adding History and Geography standards

const historyStandards = [
  // Kindergarten
  { code: 'H1.K.1', description: 'Identify events in the school and community that have happened in the past and present.', category: 'Understands historical chronology' },
  { code: 'H1.K.2', description: 'Retell sequential events in the school day using words such as first, next, last.', category: 'Understands historical chronology' },
  { code: 'H2.K.1', description: 'Identify changes that have occurred in the local community over time.', category: 'Understands and analyzes causal factors that shape major events in history' },
  { code: 'H3.K.1', description: 'Identify the perspectives of family members on past events.', category: 'Understands that there are multiple perspectives and interpretations of historical events' },
  { code: 'H4.K.1', description: 'Ask questions about the past.', category: 'Uses historical thinking to understand the past' },
  { code: 'H4.K.2', description: 'Identify a primary source from school or family.', category: 'Uses historical thinking to understand the past' },

  // Grade 1
  { code: 'H1.1.1', description: 'Identify events in the local community that have happened in the past and are happening in the present.', category: 'Understands historical chronology' },
  { code: 'H1.1.2', description: 'Create and use a timeline to show events in chronological order.', category: 'Understands historical chronology' },
  { code: 'H2.1.1', description: 'Identify changes that have occurred in the local community over time.', category: 'Understands and analyzes causal factors that shape major events in history' },
  { code: 'H2.1.2', description: 'Describe the role of key people in the history of the school and community.', category: 'Understands and analyzes causal factors that shape major events in history' },
  { code: 'H3.1.1', description: 'Compare perspectives of family members and classmates on past events.', category: 'Understands that there are multiple perspectives and interpretations of historical events' },
  { code: 'H4.1.1', description: 'Ask questions about the past and seek answers from family members, photos, and artifacts.', category: 'Uses historical thinking to understand the past' },
  { code: 'H4.1.2', description: 'Identify a primary source from the community.', category: 'Uses historical thinking to understand the past' },

  // Grade 2
  { code: 'H1.2.1', description: 'Identify events in Washington State that have happened in the past and are happening in the present.', category: 'Understands historical chronology' },
  { code: 'H1.2.2', description: 'Create and use a timeline to show events in chronological order.', category: 'Understands historical chronology' },
  { code: 'H2.2.1', description: 'Identify changes in the local community and Washington State over time.', category: 'Understands and analyzes causal factors that shape major events in history' },
  { code: 'H2.2.2', description: 'Describe the role of key people in Washington State history.', category: 'Understands and analyzes causal factors that shape major events in history' },
  { code: 'H3.2.1', description: 'Explain why accounts of the same event can be different.', category: 'Understands that there are multiple perspectives and interpretations of historical events' },
  { code: 'H4.2.1', description: 'Ask questions about the past and use sources to answer them.', category: 'Uses historical thinking to understand the past' },
  { code: 'H4.2.2', description: 'Identify the difference between a primary and secondary source.', category: 'Uses historical thinking to understand the past' },

  // Grade 3
  { code: 'H1.3.1', description: 'Identify events in the history of Washington State that have happened in the past and are happening in the present.', category: 'Understands historical chronology' },
  { code: 'H1.3.2', description: 'Create and use a timeline to show events in chronological order.', category: 'Understands historical chronology' },
  { code: 'H2.3.1', description: 'Describe how natural resources have influenced settlement in the local community and Washington State.', category: 'Understands and analyzes causal factors that shape major events in history' },
  { code: 'H2.3.2', description: 'Describe the role of key people in Washington State history.', category: 'Understands and analyzes causal factors that shape major events in history' },
  { code: 'H3.3.1', description: 'Explain why accounts of the same event can be different.', category: 'Understands that there are multiple perspectives and interpretations of historical events' },
  { code: 'H3.3.2', description: 'Compare different cultural perspectives on historical events in Washington State.', category: 'Understands that there are multiple perspectives and interpretations of historical events' },
  { code: 'H4.3.1', description: 'Ask questions about the past and use sources to answer them.', category: 'Uses historical thinking to understand the past' },
  { code: 'H4.3.2', description: 'Identify and describe examples of primary and secondary sources.', category: 'Uses historical thinking to understand the past' },

  // Grade 4
  { code: 'H1.4.1', description: 'Identify events in Washington State history that have happened in the past and are happening in the present.', category: 'Understands historical chronology' },
  { code: 'H1.4.2', description: 'Create and use a timeline to show events in chronological order.', category: 'Understands historical chronology' },
  { code: 'H2.4.1', description: 'Explain how Washington State history has been shaped by many diverse people, events, and developments.', category: 'Understands and analyzes causal factors that shape major events in history' },
  { code: 'H2.4.2', description: 'Describe how the environment has affected settlement and development in Washington State.', category: 'Understands and analyzes causal factors that shape major events in history' },
  { code: 'H3.4.1', description: 'Compare different cultural perspectives on historical events in Washington State.', category: 'Understands that there are multiple perspectives and interpretations of historical events' },
  { code: 'H3.4.2', description: 'Explain why accounts of the same event can be different.', category: 'Understands that there are multiple perspectives and interpretations of historical events' },
  { code: 'H4.4.1', description: 'Analyze primary and secondary sources to answer questions about the past.', category: 'Uses historical thinking to understand the past' },
  { code: 'H4.4.2', description: 'Distinguish between fact and opinion in historical accounts.', category: 'Uses historical thinking to understand the past' },

  // Grade 5
  { code: 'H1.5.1', description: 'Identify major events in U.S. history that have happened in the past and are happening in the present.', category: 'Understands historical chronology' },
  { code: 'H1.5.2', description: 'Create and use a timeline to show events in chronological order.', category: 'Understands historical chronology' },
  { code: 'H2.5.1', description: 'Explain how U.S. history has been shaped by many diverse people, events, and developments.', category: 'Understands and analyzes causal factors that shape major events in history' },
  { code: 'H2.5.2', description: 'Describe how the environment has affected settlement and development in U.S. history.', category: 'Understands and analyzes causal factors that shape major events in history' },
  { code: 'H2.5.3', description: 'Explain the causes and effects of major events in early U.S. history.', category: 'Understands and analyzes causal factors that shape major events in history' },
  { code: 'H3.5.1', description: 'Compare cultural perspectives on historical events in U.S. history.', category: 'Understands that there are multiple perspectives and interpretations of historical events' },
  { code: 'H3.5.2', description: 'Explain why accounts of the same event can be different.', category: 'Understands that there are multiple perspectives and interpretations of historical events' },
  { code: 'H4.5.1', description: 'Analyze primary and secondary sources to answer questions about the past.', category: 'Uses historical thinking to understand the past' },
  { code: 'H4.5.2', description: 'Distinguish between fact and opinion in historical accounts.', category: 'Uses historical thinking to understand the past' },
  { code: 'H4.5.3', description: 'Construct a historical argument using evidence from multiple sources.', category: 'Uses historical thinking to understand the past' }
];

const geographyStandards = [
  // Kindergarten
  { code: 'G1.K.1', description: 'Identify maps and globes as ways of representing Earth.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G1.K.2', description: 'Identify the difference between a map and a globe.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G1.K.3', description: 'Identify land and water on a map or globe.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G1.K.4', description: 'Demonstrate how maps can show where things are located in the classroom.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G2.K.1', description: 'Describe how the environment influences how people live in the local community.', category: 'Understands human interaction with the environment' },
  { code: 'G2.K.2', description: 'Give examples of how people impact the local environment.', category: 'Understands human interaction with the environment' },
  { code: 'G3.K.1', description: 'Identify how people move from place to place.', category: 'Understands the movement of people, goods, ideas, and technology and the patterns and effects of those movements' },
  { code: 'G3.K.2', description: 'Identify how goods move from place to place.', category: 'Understands the movement of people, goods, ideas, and technology and the patterns and effects of those movements' },

  // Grade 1
  { code: 'G1.1.1', description: 'Use maps and globes to locate places in the classroom, school, and community.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G1.1.2', description: 'Identify cardinal directions on maps and globes.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G1.1.3', description: 'Identify landforms and bodies of water on maps and globes.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G2.1.1', description: 'Describe how the environment influences how people live in the community.', category: 'Understands human interaction with the environment' },
  { code: 'G2.1.2', description: 'Give examples of how people impact the local environment.', category: 'Understands human interaction with the environment' },
  { code: 'G3.1.1', description: 'Identify ways people move from place to place.', category: 'Understands the movement of people, goods, ideas, and technology and the patterns and effects of those movements' },
  { code: 'G3.1.2', description: 'Identify ways goods move from place to place.', category: 'Understands the movement of people, goods, ideas, and technology and the patterns and effects of those movements' },

  // Grade 2
  { code: 'G1.2.1', description: 'Use maps and globes to identify major physical features.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G1.2.2', description: 'Identify the location of the local community, state, and nation on a map and globe.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G1.2.3', description: 'Identify the continents and oceans on a map and globe.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G2.2.1', description: 'Describe how the environment influences how people live in the community.', category: 'Understands human interaction with the environment' },
  { code: 'G2.2.2', description: 'Describe how people impact the environment in the community.', category: 'Understands human interaction with the environment' },
  { code: 'G3.2.1', description: 'Describe how people move from place to place in the community.', category: 'Understands the movement of people, goods, ideas, and technology and the patterns and effects of those movements' },
  { code: 'G3.2.2', description: 'Describe how goods move from place to place in the community.', category: 'Understands the movement of people, goods, ideas, and technology and the patterns and effects of those movements' },

  // Grade 3
  { code: 'G1.3.1', description: 'Use maps and globes to identify major political and physical features.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G1.3.2', description: 'Locate the local community, Washington State, the United States, and the world on a map and globe.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G1.3.3', description: 'Identify lines of latitude and longitude on a globe.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G2.3.1', description: 'Explain how the environment affects how people live in the community.', category: 'Understands human interaction with the environment' },
  { code: 'G2.3.2', description: 'Explain how people affect the environment in the community.', category: 'Understands human interaction with the environment' },
  { code: 'G3.3.1', description: 'Explain how people move from place to place in the community.', category: 'Understands the movement of people, goods, ideas, and technology and the patterns and effects of those movements' },
  { code: 'G3.3.2', description: 'Explain how goods move from place to place in the community.', category: 'Understands the movement of people, goods, ideas, and technology and the patterns and effects of those movements' },

  // Grade 4
  { code: 'G1.4.1', description: 'Use maps and globes to identify major physical and political features of Washington State.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G1.4.2', description: 'Identify Washington State\'s location relative to the United States and the world.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G1.4.3', description: 'Locate lines of latitude and longitude and apply them to maps of Washington.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G2.4.1', description: 'Explain how the environment affects how people live in Washington State.', category: 'Understands human interaction with the environment' },
  { code: 'G2.4.2', description: 'Explain how people affect the environment in Washington State.', category: 'Understands human interaction with the environment' },
  { code: 'G3.4.1', description: 'Explain how people move from place to place in Washington State.', category: 'Understands the movement of people, goods, ideas, and technology and the patterns and effects of those movements' },
  { code: 'G3.4.2', description: 'Explain how goods move from place to place in Washington State.', category: 'Understands the movement of people, goods, ideas, and technology and the patterns and effects of those movements' },

  // Grade 5
  { code: 'G1.5.1', description: 'Use maps and globes to identify major physical and political features of the United States.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G1.5.2', description: 'Identify the United States\' location relative to the world.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G1.5.3', description: 'Locate lines of latitude and longitude and apply them to maps of the United States.', category: 'Uses maps and geographic representations, tools, and technologies to understand spatial patterns' },
  { code: 'G2.5.1', description: 'Explain how the environment affects how people live in the United States.', category: 'Understands human interaction with the environment' },
  { code: 'G2.5.2', description: 'Explain how people affect the environment in the United States.', category: 'Understands human interaction with the environment' },
  { code: 'G3.5.1', description: 'Explain how people move from place to place in the United States.', category: 'Understands the movement of people, goods, ideas, and technology and the patterns and effects of those movements' },
  { code: 'G3.5.2', description: 'Explain how goods move from place to place in the United States.', category: 'Understands the movement of people, goods, ideas, and technology and the patterns and effects of those movements' }
];

async function addHistoryGeographyStandards() {
  console.log('Adding History standards to the database...');
  
  for (const standard of historyStandards) {
    try {
      const response = await fetch('https://ecs-curriculum.onrender.com/api/standards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(standard),
      });

      if (response.ok) {
        console.log(`✅ Added History: ${standard.code}`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Failed to add History ${standard.code}: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Error adding History ${standard.code}: ${error.message}`);
    }
  }

  console.log('Adding Geography standards to the database...');
  
  for (const standard of geographyStandards) {
    try {
      const response = await fetch('https://ecs-curriculum.onrender.com/api/standards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(standard),
      });

      if (response.ok) {
        console.log(`✅ Added Geography: ${standard.code}`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Failed to add Geography ${standard.code}: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Error adding Geography ${standard.code}: ${error.message}`);
    }
  }
  
  console.log('Finished adding History and Geography standards!');
}

addHistoryGeographyStandards();
