import { execSync } from 'child_process';

// Grade 7 Math standards
const grade7MathStandards = [
  // Ratios & Proportional Relationships
  {
    code: "7.RP.A",
    description: "Analyze proportional relationships and use them to solve real-world and mathematical problems.",
    category: "Ratios & Proportional Relationships"
  },
  
  // The Number System
  {
    code: "7.NS.A",
    description: "Apply and extend previous understandings of operations with fractions to add, subtract, multiply, and divide rational numbers.",
    category: "The Number System"
  },
  
  // Expressions & Equations
  {
    code: "7.EE.A",
    description: "Use properties of operations to generate equivalent expressions.",
    category: "Expressions & Equations"
  },
  {
    code: "7.EE.B",
    description: "Solve real-life and mathematical problems using numerical and algebraic expressions and equations.",
    category: "Expressions & Equations"
  },
  
  // Geometry
  {
    code: "7.G.A",
    description: "Draw, construct, and describe geometrical figures and describe the relationships between them.",
    category: "Geometry"
  },
  {
    code: "7.G.B",
    description: "Solve real-life and mathematical problems involving angle measure, area, surface area, and volume.",
    category: "Geometry"
  },
  
  // Statistics & Probability
  {
    code: "7.SP.A",
    description: "Use random sampling to draw inferences about a population.",
    category: "Statistics & Probability"
  },
  {
    code: "7.SP.B",
    description: "Draw informal comparative inferences about two populations.",
    category: "Statistics & Probability"
  },
  {
    code: "7.SP.C",
    description: "Investigate chance processes and develop, use, and evaluate probability models.",
    category: "Statistics & Probability"
  }
];

function addGrade7MathStandards() {
  console.log('Adding Grade 7 Math standards to the database...');
  
  for (const standard of grade7MathStandards) {
    try {
      const command = `curl -X POST https://ecs-curriculum.onrender.com/api/standards -H "Content-Type: application/json" -d '{"code":"${standard.code}","description":"${standard.description}","category":"${standard.category}"}'`;
      const result = execSync(command, { encoding: 'utf8' });
      console.log(`✅ Added ${standard.code}: ${standard.description}`);
    } catch (error) {
      console.error(`❌ Error adding ${standard.code}:`, error.message);
    }
  }
  
  console.log('\n✅ Grade 7 Math standards added successfully!');
  console.log('\nThe frontend will automatically display them under Math → Grade 7 → [Standards]');
}

addGrade7MathStandards();
