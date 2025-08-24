import { execSync } from 'child_process';

// Grade 6 Math standards
const grade6MathStandards = [
  // Ratios & Proportional Relationships
  {
    code: "6.RP.A",
    description: "Understand ratio concepts and use ratio reasoning to solve problems.",
    category: "Ratios & Proportional Relationships"
  },
  
  // The Number System
  {
    code: "6.NS.A",
    description: "Apply and extend previous understandings of multiplication and division to divide fractions by fractions.",
    category: "The Number System"
  },
  {
    code: "6.NS.B",
    description: "Compute fluently with multi-digit numbers and find common factors and multiples.",
    category: "The Number System"
  },
  {
    code: "6.NS.C",
    description: "Apply and extend previous understandings of numbers to the system of rational numbers.",
    category: "The Number System"
  },
  
  // Expressions & Equations
  {
    code: "6.EE.A",
    description: "Apply and extend previous understandings of arithmetic to algebraic expressions.",
    category: "Expressions & Equations"
  },
  {
    code: "6.EE.B",
    description: "Reason about and solve one-variable equations and inequalities.",
    category: "Expressions & Equations"
  },
  {
    code: "6.EE.C",
    description: "Represent and analyze quantitative relationships between dependent and independent variables.",
    category: "Expressions & Equations"
  },
  
  // Geometry
  {
    code: "6.G.A",
    description: "Solve real-world and mathematical problems involving area, surface area, and volume.",
    category: "Geometry"
  },
  
  // Statistics & Probability
  {
    code: "6.SP.A",
    description: "Develop understanding of statistical variability.",
    category: "Statistics & Probability"
  },
  {
    code: "6.SP.B",
    description: "Summarize and describe distributions.",
    category: "Statistics & Probability"
  }
];

function addGrade6MathStandards() {
  console.log('Adding Grade 6 Math standards to the database...');
  
  for (const standard of grade6MathStandards) {
    try {
      const command = `curl -X POST https://ecs-curriculum.onrender.com/api/standards -H "Content-Type: application/json" -d '{"code":"${standard.code}","description":"${standard.description}","category":"${standard.category}"}'`;
      const result = execSync(command, { encoding: 'utf8' });
      console.log(`✅ Added ${standard.code}: ${standard.description}`);
    } catch (error) {
      console.error(`❌ Error adding ${standard.code}:`, error.message);
    }
  }
  
  console.log('\n✅ Grade 6 Math standards added successfully!');
  console.log('\nThe frontend will automatically display them under Math → Grade 6 → [Standards]');
}

addGrade6MathStandards();
