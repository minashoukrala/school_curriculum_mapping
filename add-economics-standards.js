// ES module script for adding Economics standards

const economicsStandards = [
  // Kindergarten
  { code: 'E1.K.1', description: 'Explain the difference between a need and a want.', category: 'Makes decisions between wants and needs' },
  { code: 'E1.K.2', description: 'Explain why people have to make choices between needs and wants.', category: 'Makes decisions between wants and needs' },
  { code: 'E2.K.1', description: 'Identify consumers and producers.', category: 'Understands the components of an economic system' },
  { code: 'E2.K.2', description: 'List and provide examples of goods and services.', category: 'Understands the components of an economic system' },
  { code: 'E3.K.1', description: 'Identify public and private providers of goods and services.', category: 'Understands the government\'s role in the economy' },
  { code: 'E4.K.1', description: 'Describe goods that are produced in local geographic regions.', category: 'Understands the economic issues and problems that all societies face' },

  // Grade 1
  { code: 'E1.1.1', description: 'Identify differences between natural, human, and capital resources.', category: 'Makes decisions between wants and needs' },
  { code: 'E1.1.2', description: 'Explain how and why families make choices between wants and needs.', category: 'Makes decisions between wants and needs' },
  { code: 'E1.1.3', description: 'Evaluate the outcomes of choices.', category: 'Makes decisions between wants and needs' },
  { code: 'E1.1.4', description: 'Explore the different resources that families use to access what they want and need.', category: 'Makes decisions between wants and needs' },
  { code: 'E2.1.1', description: 'Demonstrate how sharing and bartering are basic economic systems.', category: 'Understands the components of an economic system' },
  { code: 'E2.1.2', description: 'Give examples of how people earn income.', category: 'Understands the components of an economic system' },
  { code: 'E2.1.3', description: 'Describe how consumers spend money or use markets (banks, goods and services).', category: 'Understands the components of an economic system' },
  { code: 'E2.1.4', description: 'Explain why people save money.', category: 'Understands the components of an economic system' },
  { code: 'E3.1.1', description: 'Examine the difference between public and private providers of goods and services.', category: 'Understands the government\'s role in the economy' },
  { code: 'E3.1.2', description: 'Explain the purpose for public and private providers of goods and services.', category: 'Understands the government\'s role in the economy' },
  { code: 'E4.1.1', description: 'Explain that people need to trade for products that are not found in their geographic region.', category: 'Understands the economic issues and problems that all societies face' },
  { code: 'E4.1.2', description: 'Describe why people in one country trade goods and services with people in other countries.', category: 'Understands the economic issues and problems that all societies face' },
  { code: 'E4.1.3', description: 'Describe products that are produced abroad and sold domestically and products that are produced domestically and sold abroad.', category: 'Understands the economic issues and problems that all societies face' },

  // Grade 2
  { code: 'E1.2.1', description: 'Explain how and why members of a community make choices among products and services that have costs and benefits.', category: 'Makes decisions between wants and needs' },
  { code: 'E1.2.2', description: 'Define scarcity and explain how it necessitates decision-making.', category: 'Makes decisions between wants and needs' },
  { code: 'E1.2.3', description: 'Identify the costs and benefits of making various personal decisions on the community.', category: 'Makes decisions between wants and needs' },
  { code: 'E2.2.1', description: 'Identify the skills and knowledge required to produce certain goods and services.', category: 'Understands the components of an economic system' },
  { code: 'E2.2.2', description: 'Describe the goods and services that people in the local community produce and those that are produced in other communities.', category: 'Understands the components of an economic system' },
  { code: 'E3.2.1', description: 'Identify examples of the goods and services that governments provide.', category: 'Understands the government\'s role in the economy' },
  { code: 'E3.2.2', description: 'Identify costs and benefits of publicly owned services.', category: 'Understands the government\'s role in the economy' },
  { code: 'E4.2.1', description: 'Clarify that there are factors that lead to trading with one group over another (e.g., seasons, prices, distance).', category: 'Understands the economic issues and problems that all societies face' },

  // Grade 3
  { code: 'E1.3.1', description: 'Identify the costs and benefits of individual choices.', category: 'Makes decisions between wants and needs' },
  { code: 'E1.3.2', description: 'Identify positive and negative incentives that influence the decisions people make.', category: 'Makes decisions between wants and needs' },
  { code: 'E1.3.3', description: 'Describe how individual choices are influenced by various cultural norms.', category: 'Makes decisions between wants and needs' },
  { code: 'E2.3.1', description: 'Recognize how the economic systems of groups are influenced by community and cultural laws, values, and customs.', category: 'Understands the components of an economic system' },
  { code: 'E2.3.2', description: 'Identify examples of human capital, physical capital, and natural resources used to produce goods and services.', category: 'Understands the components of an economic system' },
  { code: 'E2.3.3', description: 'Explain why individuals and businesses specialize and trade.', category: 'Understands the components of an economic system' },
  { code: 'E2.3.4', description: 'Explain the role of money in making exchange easier.', category: 'Understands the components of an economic system' },
  { code: 'E2.3.5', description: 'Explain how profits influence sellers in markets.', category: 'Understands the components of an economic system' },
  { code: 'E2.3.6', description: 'Identify examples of external benefits and costs.', category: 'Understands the components of an economic system' },
  { code: 'E2.3.7', description: 'Describe the role of financial institutions in an economy.', category: 'Understands the components of an economic system' },
  { code: 'E3.3.1', description: 'Describe how local taxation supports one\'s community.', category: 'Understands the government\'s role in the economy' },
  { code: 'E3.3.2', description: 'Explain the ways in which the government pays for the goods and services it provides.', category: 'Understands the government\'s role in the economy' },
  { code: 'E4.3.1', description: 'Identify the positive and negative impacts of trade among and between cultural groups.', category: 'Understands the economic issues and problems that all societies face' },
  { code: 'E4.3.2', description: 'Explain how trade leads to increasing economic interdependence among cultural groups.', category: 'Understands the economic issues and problems that all societies face' },
  { code: 'E4.3.3', description: 'Explain the effects of increasing economic interdependence on different groups within participating cultural groups.', category: 'Understands the economic issues and problems that all societies face' },

  // Grade 4
  { code: 'E1.4.1', description: 'Analyze and explain the costs and benefits of people\'s decisions to move and relocate to meet their needs and wants.', category: 'Makes decisions between wants and needs' },
  { code: 'E1.4.2', description: 'Compare the costs and benefits of individual choices.', category: 'Makes decisions between wants and needs' },
  { code: 'E1.4.3', description: 'Compare positive and negative incentives that influence the decisions people make.', category: 'Makes decisions between wants and needs' },
  { code: 'E2.4.1', description: 'Compare different historic economic systems in Washington state tribes.', category: 'Understands the components of an economic system' },
  { code: 'E2.4.2', description: 'Identify the basic elements of Washington state\'s economic system, including agriculture, businesses, industry, natural resources, and labor.', category: 'Understands the components of an economic system' },
  { code: 'E2.4.3', description: 'Identify examples of human capital, physical capital, and natural resources used to produce goods and services in Washington state.', category: 'Understands the components of an economic system' },
  { code: 'E2.4.4', description: 'Explain why individuals and businesses specialize and trade in Washington state.', category: 'Understands the components of an economic system' },
  { code: 'E2.4.5', description: 'Explain the relationship between investment in human capital, productivity, and future incomes.', category: 'Understands the components of an economic system' },
  { code: 'E3.4.1', description: 'Describe how people and businesses support Washington state government through taxation.', category: 'Understands the government\'s role in the economy' },
  { code: 'E3.4.2', description: 'Explain the meaning of inflation, deflation, and unemployment.', category: 'Understands the government\'s role in the economy' },
  { code: 'E3.4.3', description: 'Describe ways government can improve productivity by using capital goods and human capital.', category: 'Understands the government\'s role in the economy' },
  { code: 'E4.4.1', description: 'Explain how geography, natural resources, climate, and available labor contributed to the exploitation of resources in the Pacific Northwest.', category: 'Understands the economic issues and problems that all societies face' },
  { code: 'E4.4.2', description: 'Explain the economic issues that different communities within the Pacific Northwest faced.', category: 'Understands the economic issues and problems that all societies face' },
  { code: 'E4.4.3', description: 'Explain how trade led to increasing economic interdependence among groups within the Pacific Northwest.', category: 'Understands the economic issues and problems that all societies face' },

  // Grade 5
  { code: 'E1.5.1', description: 'Analyze and explain the benefits of the decisions that colonists made to meet their wants and needs.', category: 'Makes decisions between wants and needs' },
  { code: 'E1.5.2', description: 'Explain how people have to make choices between wants and needs, and evaluate the outcomes or consequences of those choices.', category: 'Makes decisions between wants and needs' },
  { code: 'E1.5.3', description: 'Evaluate the costs and benefits of individual choices.', category: 'Makes decisions between wants and needs' },
  { code: 'E1.5.4', description: 'Evaluate positive and negative incentives to individuals and communities that influence the decisions people make.', category: 'Makes decisions between wants and needs' },
  { code: 'E2.5.1', description: 'Describe how colonial American economic systems worked.', category: 'Understands the components of an economic system' },
  { code: 'E2.5.2', description: 'Identify examples of human capital, physical capital, and natural resources used to produce goods and services.', category: 'Understands the components of an economic system' },
  { code: 'E2.5.3', description: 'Explain why individuals and businesses specialize and trade.', category: 'Understands the components of an economic system' },
  { code: 'E2.5.4', description: 'Explain the relationship between investment in human capital, productivity, and future incomes.', category: 'Understands the components of an economic system' },
  { code: 'E3.5.1', description: 'Describe the impact of the British government on the economy of the American colonies.', category: 'Understands the government\'s role in the economy' },
  { code: 'E3.5.2', description: 'Explain ways the British used taxation policies to pay for goods and services they provided.', category: 'Understands the government\'s role in the economy' },
  { code: 'E3.5.3', description: 'Explain what interest rates are.', category: 'Understands the government\'s role in the economy' },
  { code: 'E4.5.1', description: 'Explain how trade leads to increasing economic interdependence among nations.', category: 'Understands the economic issues and problems that all societies face' },
  { code: 'E4.5.2', description: 'Explain the effects of increasing economic interdependence on different groups within participating nations.', category: 'Understands the economic issues and problems that all societies face' },
  { code: 'E4.5.3', description: 'Describe ways people can increase productivity by using improved capital goods and improving their human capital.', category: 'Understands the economic issues and problems that all societies face' }
];

async function addEconomicsStandards() {
  console.log('Adding Economics standards to the database...');
  
  for (const standard of economicsStandards) {
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
  
  console.log('Finished adding Economics standards!');
}

addEconomicsStandards();
