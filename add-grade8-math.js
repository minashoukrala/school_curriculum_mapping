import { execSync } from 'child_process';

// Grade 8 Math standards
const grade8MathStandards = [
  // The Number System
  {
    code: "8.NS.A",
    description: "Know that there are numbers that are not rational, and approximate them by rational numbers.",
    category: "The Number System"
  },
  
  // Expressions & Equations
  {
    code: "8.EE.A",
    description: "Work with radicals and integer exponents.",
    category: "Expressions & Equations"
  },
  {
    code: "8.EE.B",
    description: "Understand the connections between proportional relationships, lines, and linear equations.",
    category: "Expressions & Equations"
  },
  {
    code: "8.EE.C",
    description: "Analyze and solve linear equations and pairs of simultaneous linear equations.",
    category: "Expressions & Equations"
  },
  
  // Geometry
  {
    code: "8.G.A",
    description: "Understand congruence and similarity using physical models, transparencies, or geometry software.",
    category: "Geometry"
  },
  {
    code: "8.G.B",
    description: "Understand and apply the Pythagorean Theorem.",
    category: "Geometry"
  },
  {
    code: "8.G.C",
    description: "Solve real-world and mathematical problems involving volume of cylinders, cones, and spheres.",
    category: "Geometry"
  },
  
  // Statistics & Probability
  {
    code: "8.SP.A",
    description: "Investigate patterns of association in bivariate data.",
    category: "Statistics & Probability"
  },
  
  // Functions
  {
    code: "8.F.A",
    description: "Define, evaluate, and compare functions.",
    category: "Functions"
  },
  {
    code: "8.F.B",
    description: "Use functions to model relationships between quantities.",
    category: "Functions"
  }
];

function addGrade8MathStandards() {
  console.log('Adding Grade 8 Math standards to the database...');
  
  for (const standard of grade8MathStandards) {
    try {
      const command = `curl -X POST https://ecs-curriculum.onrender.com/api/standards -H "Content-Type: application/json" -d '{"code":"${standard.code}","description":"${standard.description}","category":"${standard.category}"}'`;
      const result = execSync(command, { encoding: 'utf8' });
      console.log(`✅ Added ${standard.code}: ${standard.description}`);
    } catch (error) {
      console.error(`❌ Error adding ${standard.code}:`, error.message);
    }
  }
  
  console.log('\n✅ Grade 8 Math standards added successfully!');
  console.log('\nThe frontend will automatically display them under Math → Grade 8 → [Standards]');
}

addGrade8MathStandards();
