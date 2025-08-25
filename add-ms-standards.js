// ES module script for adding Middle School standards for History, Geography, Economics, and Civics

const msHistoryStandards = [
  // Understands historical chronology and the defining of eras
  { code: 'H1.6-8.1', description: 'Analyze different cultural measurements of time.', category: 'Understands historical chronology and the defining of eras' },
  { code: 'H1.6-8.2', description: 'Explain how the rise of civilizations defines eras in world history in two or more regions of the world.', category: 'Understands historical chronology and the defining of eras' },
  { code: 'H1.6-8.4', description: 'Analyze a major historical event and how it is represented on timelines from different cultural perspectives, including those of indigenous people.', category: 'Understands historical chronology and the defining of eras' },
  { code: 'H1.6-8.6', description: 'Analyze historical events and their representation on timelines.', category: 'Understands historical chronology and the defining of eras' },

  // Understands and analyzes causal factors shaping historical events
  { code: 'H2.6-8.1', description: 'Explain and analyze how individuals, movements, cultural and ethnic groups, and technology from past civilizations have shaped world history.', category: 'Understands and analyzes causal factors shaping historical events' },
  { code: 'H2.6-8.2', description: 'Explain and analyze how individuals and movements have shaped Washington State history since statehood.', category: 'Understands and analyzes causal factors shaping historical events' },
  { code: 'H2.6-8.3', description: 'Explain and analyze how cultures and ethnic groups contributed to Washington State history since statehood.', category: 'Understands and analyzes causal factors shaping historical events' },
  { code: 'H2.6-8.4', description: 'Explain and analyze how technology and ideas have impacted Washington State history since statehood.', category: 'Understands and analyzes causal factors shaping historical events' },
  { code: 'H2.6-8.5', description: 'Explain and analyze how individuals and movements have shaped United States history (1763–1877).', category: 'Understands and analyzes causal factors shaping historical events' },
  { code: 'H2.6-8.6', description: 'Explain and analyze how cultures and ethnic groups contributed to United States history (1763–1877).', category: 'Understands and analyzes causal factors shaping historical events' },
  { code: 'H2.6-8.7', description: 'Explain and analyze how technology and ideas have impacted United States history (1763–1877).', category: 'Understands and analyzes causal factors shaping historical events' },

  // Understands that multiple perspectives shape our understanding of history
  { code: 'H3.6-8.1', description: 'Analyze and interpret historical materials from a variety of perspectives in world history.', category: 'Understands that multiple perspectives shape our understanding of history' },
  { code: 'H3.6-8.2', description: 'Analyze multiple causal factors to create and support a claim about major events in world history.', category: 'Understands that multiple perspectives shape our understanding of history' },
  { code: 'H3.6-8.3', description: 'Explain, analyze, and develop an argument about how Washington State has been impacted by individuals and movements; cultures and cultural groups; technology and ideas.', category: 'Understands that multiple perspectives shape our understanding of history' },
  { code: 'H3.6-8.4', description: 'Analyze and interpret historical materials from a variety of perspectives in United States history (1763–1877).', category: 'Understands that multiple perspectives shape our understanding of history' },
  { code: 'H3.6-8.5', description: 'Analyze multiple causal factors to create positions on major events in United States history (1763–1877).', category: 'Understands that multiple perspectives shape our understanding of history' },

  // Understands how historical events inform analysis of contemporary issues
  { code: 'H4.6-8.1', description: 'Analyze how a historical event in world history helps us understand contemporary issues and events.', category: 'Understands how historical events inform analysis of contemporary issues' },
  { code: 'H4.6-8.2', description: 'Analyze how a historical event in Washington State history helps us understand contemporary issues and events.', category: 'Understands how historical events inform analysis of contemporary issues' },
  { code: 'H4.6-8.3', description: 'Analyze how a historical event in United States history helps us understand contemporary issues and events.', category: 'Understands how historical events inform analysis of contemporary issues' }
];

const msGeographyStandards = [
  // Understands the physical and cultural characteristics of places and spatial patterns
  { code: 'G1.6-8.1', description: 'Construct and analyze maps using scale, direction, symbols, legends, and projections to gather information.', category: 'Understands the physical and cultural characteristics of places and spatial patterns' },
  { code: 'G1.6-8.2', description: 'Identify the location of places and regions in the world and understand their physical and cultural characteristics.', category: 'Understands the physical and cultural characteristics of places and spatial patterns' },
  { code: 'G1.6-8.3', description: 'Analyze maps and charts from a specific time period to understand an issue or event.', category: 'Understands the physical and cultural characteristics of places and spatial patterns' },
  { code: 'G1.6-8.4', description: 'Explain how human spatial patterns have emerged from natural processes and human activities.', category: 'Understands the physical and cultural characteristics of places and spatial patterns' },
  { code: 'G1.6-8.5', description: 'Explain and analyze physical and cultural characteristics of places and regions in the United States.', category: 'Understands the physical and cultural characteristics of places and spatial patterns' },
  { code: 'G1.6-8.6', description: 'Use maps, satellite images, photographs, and other representations to explain relationships between the locations of places and regions and their political, cultural, and economic dynamics.', category: 'Understands the physical and cultural characteristics of places and spatial patterns' },

  // Understands human interaction with the environment
  { code: 'G2.6-8.1', description: 'Explain and analyze how the environment has affected people and how people have affected the environment in world history.', category: 'Understands human interaction with the environment' },
  { code: 'G2.6-8.2', description: 'Explain the geographic factors that influence the movement of groups of people in world history.', category: 'Understands human interaction with the environment' },
  { code: 'G2.6-8.3', description: 'Explain and analyze how the environment has affected people and how human actions modify the physical environment—and, in turn, how the physical environment limits or promotes human activities in Washington State.', category: 'Understands human interaction with the environment' },
  { code: 'G2.6-8.4', description: 'Explain the role of immigration in shaping societies in the past or present.', category: 'Understands human interaction with the environment' },
  { code: 'G2.6-8.5', description: 'Explain examples of cultural diffusion in the world from the past or present.', category: 'Understands human interaction with the environment' },
  { code: 'G2.6-8.6', description: 'Analyze how the environment has affected people and how people have affected the environment in the United States in the past or present.', category: 'Understands human interaction with the environment' },
  { code: 'G2.6-8.7', description: 'Explain cultural diffusion in the United States from the past or present.', category: 'Understands human interaction with the environment' },
  { code: 'G2.6-8.8', description: 'Explain and analyze migration as a catalyst for the growth of the United States in the past or present.', category: 'Understands human interaction with the environment' },

  // Understands the geographic context of global issues and events
  { code: 'G3.6-8.1', description: 'Explain how learning about the geography of the world helps us understand global issues such as diversity, sustainability, and trade.', category: 'Understands the geographic context of global issues and events' },
  { code: 'G3.6-8.2', description: 'Explain how learning about the geography of Washington State helps us understand global issues such as diversity, sustainability, and trade.', category: 'Understands the geographic context of global issues and events' },
  { code: 'G3.6-8.3', description: 'Explain how learning about the geography of the United States helps us understand global issues such as diversity, trade, and sustainability.', category: 'Understands the geographic context of global issues and events' }
];

const msEconomicsStandards = [
  // Analyzes economic choices (costs & benefits)
  { code: 'E1.6-8.1', description: 'Analyze the costs and benefits of economic choices made by groups and individuals in the past or present.', category: 'Analyzes economic choices (costs & benefits)' },
  { code: 'E1.6-8.2', description: 'Evaluate alternative approaches or solutions to current economic issues in Washington State in terms of costs and benefits for different groups.', category: 'Analyzes economic choices (costs & benefits)' },
  { code: 'E1.6-8.3', description: 'Analyze examples of how groups and individuals have considered profit and personal values in making economic choices, historically or today.', category: 'Analyzes economic choices (costs & benefits)' },

  // Understands how economic systems function
  { code: 'E2.6-8.1', description: 'Describe the production, distribution, and consumption of goods, services, and resources in societies—including past and present.', category: 'Understands how economic systems function' },
  { code: 'E2.6-8.2', description: 'Explain how scarce resources have affected international trade in the past or present.', category: 'Understands how economic systems function' },
  { code: 'E2.6-8.3', description: 'Analyze production, distribution, and consumption of goods, services, and resources in societies (past or present).', category: 'Understands how economic systems function' },
  { code: 'E2.6-8.4', description: 'Analyze how supply and demand forces have affected international trade in Washington State, past or present.', category: 'Understands how economic systems function' },
  { code: 'E2.6-8.5', description: 'Analyze how supply and demand have influenced production, distribution, and consumption in the United States over time.', category: 'Understands how economic systems function' },
  { code: 'E2.6-8.6', description: 'Analyze how supply and demand have affected international trade in the United States, historically or currently.', category: 'Understands how economic systems function' },

  // Understands the government\'s role in the economy
  { code: 'E3.6-8.1', description: 'Explain the role of government in global economies, including creation of money, taxation, and spending (past or present).', category: 'Understands the government\'s role in the economy' },
  { code: 'E3.6-8.2', description: 'Analyze how government in Washington State impacts its economy through taxation, spending, and policy (past or present).', category: 'Understands the government\'s role in the economy' },
  { code: 'E3.6-8.3', description: 'Analyze how the U.S. government influences the economy via taxation, currency control, and tariffs (past or present).', category: 'Understands the government\'s role in the economy' },

  // Understands economic issues faced by societies
  { code: 'E4.6-8.1', description: 'Explain the distribution of wealth and sustainability of resources around the world.', category: 'Understands economic issues faced by societies' },
  { code: 'E4.6-8.2', description: 'Explain trade barriers and how they affect international trade.', category: 'Understands economic issues faced by societies' },
  { code: 'E4.6-8.3', description: 'Analyze the distribution of wealth and sustainability of resources in Washington State.', category: 'Understands economic issues faced by societies' },
  { code: 'E4.6-8.4', description: 'Explain the costs and benefits of trade policies to individuals, businesses, and society in Washington State.', category: 'Understands economic issues faced by societies' },
  { code: 'E4.6-8.5', description: 'Analyze the distribution of wealth and resource sustainability in the United States.', category: 'Understands economic issues faced by societies' },
  { code: 'E4.6-8.6', description: 'Explain the costs and benefits of trade policies to individuals, businesses, and society in the United States.', category: 'Understands economic issues faced by societies' }
];

const msCivicsStandards = [
  // Understands key ideals and principles of the United States
  { code: 'C1.6-8.1', description: 'Explain how early works such as the Code of Justinian or the Magna Carta contributed to foundational documents of the United States.', category: 'Understands key ideals and principles of the United States' },
  { code: 'C1.6-8.2', description: 'Explain the structure of and key ideals set forth in fundamental documents, including the Washington State Constitution and tribal treaties with the United States government.', category: 'Understands key ideals and principles of the United States' },
  { code: 'C1.6-8.3', description: 'Explain key ideals and principles outlined in the Declaration of Independence, the U.S. Constitution (rule of law, separation of powers, representative government, popular sovereignty), and the Bill of Rights.', category: 'Understands key ideals and principles of the United States' },
  { code: 'C1.6-8.4', description: 'Evaluate efforts to reduce discrepancies between key ideals and reality in the United States.', category: 'Understands key ideals and principles of the United States' },

  // Understands the purposes, organization, and function of governments, laws, and political systems
  { code: 'C2.6-8.1', description: 'Explain a variety of forms of government from the past or present.', category: 'Understands the purposes, organization, and function of governments, laws, and political systems' },
  { code: 'C2.6-8.2', description: 'Distinguish the structure, organization, powers, and limits of government at the local, state, and tribal levels.', category: 'Understands the purposes, organization, and function of governments, laws, and political systems' },
  { code: 'C2.6-8.3', description: 'Analyze the structure and powers of government at the national level.', category: 'Understands the purposes, organization, and function of governments, laws, and political systems' },
  { code: 'C2.6-8.4', description: 'Use knowledge of the function of government to analyze and address a political issue.', category: 'Understands the purposes, organization, and function of governments, laws, and political systems' },
  { code: 'C2.6-8.5', description: 'Evaluate the effectiveness of the system of checks and balances in the United States based on an event.', category: 'Understands the purposes, organization, and function of governments, laws, and political systems' },
  { code: 'C2.6-8.6', description: 'Demonstrate that the U.S. government includes concepts of both democracy and a republic.', category: 'Understands the purposes, organization, and function of governments, laws, and political systems' },

  // Understands the purposes and organization of tribal and international relationships and U.S. foreign policy
  { code: 'C3.6-8.1', description: 'Analyze how societies have interacted with one another.', category: 'Understands the purposes and organization of tribal and international relationships and U.S. foreign policy' },
  { code: 'C3.6-8.2', description: 'Analyze how international agreements have affected Washington State.', category: 'Understands the purposes and organization of tribal and international relationships and U.S. foreign policy' },
  { code: 'C3.6-8.3', description: 'Recognize that treaties are "the supreme law of the land," and treaty rights supersede most state laws.', category: 'Understands the purposes and organization of tribal and international relationships and U.S. foreign policy' },
  { code: 'C3.6-8.4', description: 'Explain elements of the agreements contained in one or more treaty agreements between Washington tribes and the U.S.', category: 'Understands the purposes and organization of tribal and international relationships and U.S. foreign policy' },
  { code: 'C3.6-8.5', description: 'Identify early examples of foreign policy between the United States and other nations.', category: 'Understands the purposes and organization of tribal and international relationships and U.S. foreign policy' },
  { code: 'C3.6-8.6', description: 'Analyze how the United States has interacted with other countries.', category: 'Understands the purposes and organization of tribal and international relationships and U.S. foreign policy' },

  // Understands civic involvement
  { code: 'C4.6-8.1', description: 'Describe the historical origins of civic involvement.', category: 'Understands civic involvement' },
  { code: 'C4.6-8.2', description: 'Describe the relationship between the actions of people in Washington State and the ideals outlined in the Washington State Constitution.', category: 'Understands civic involvement' },
  { code: 'C4.6-8.3', description: 'Employ strategies for civic involvement that address a state or local issue.', category: 'Understands civic involvement' },
  { code: 'C4.6-8.4', description: 'Analyze how a claim on an issue attempts to balance individual rights and the common good.', category: 'Understands civic involvement' },
  { code: 'C4.6-8.5', description: 'Employ strategies for civic involvement that address a national issue.', category: 'Understands civic involvement' }
];

async function addMSStandards() {
  console.log('Adding Middle School History standards to the database...');
  
  for (const standard of msHistoryStandards) {
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

  console.log('Adding Middle School Geography standards to the database...');
  
  for (const standard of msGeographyStandards) {
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

  console.log('Adding Middle School Economics standards to the database...');
  
  for (const standard of msEconomicsStandards) {
    try {
      const response = await fetch('https://ecs-curriculum.onrender.com/api/standards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(standard),
      });

      if (response.ok) {
        console.log(`✅ Added Economics: ${standard.code}`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Failed to add Economics ${standard.code}: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Error adding Economics ${standard.code}: ${error.message}`);
    }
  }

  console.log('Adding Middle School Civics standards to the database...');
  
  for (const standard of msCivicsStandards) {
    try {
      const response = await fetch('https://ecs-curriculum.onrender.com/api/standards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(standard),
      });

      if (response.ok) {
        console.log(`✅ Added Civics: ${standard.code}`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Failed to add Civics ${standard.code}: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Error adding Civics ${standard.code}: ${error.message}`);
    }
  }
  
  console.log('Finished adding all Middle School standards!');
}

addMSStandards();
