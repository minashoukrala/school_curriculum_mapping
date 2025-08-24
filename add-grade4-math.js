import { execSync } from 'child_process';

// Grade 4 Math standards
const grade4MathStandards = [
  // Operations & Algebraic Thinking
  {
    code: "4.OA.A",
    description: "Use the four operations with whole numbers to solve problems.",
    category: "Operations & Algebraic Thinking"
  },
  {
    code: "4.OA.B",
    description: "Gain familiarity with factors and multiples.",
    category: "Operations & Algebraic Thinking"
  },
  {
    code: "4.OA.C",
    description: "Generate and analyze patterns.",
    category: "Operations & Algebraic Thinking"
  },
  
  // Number & Operations in Base Ten
  {
    code: "4.NBT.A",
    description: "Generalize place value understanding for multi-digit whole numbers.",
    category: "Number & Operations in Base Ten"
  },
  {
    code: "4.NBT.B",
    description: "Use place value understanding and properties of operations to perform multi-digit arithmetic.",
    category: "Number & Operations in Base Ten"
  },
  
  // Measurement & Data
  {
    code: "4.MD.A",
    description: "Solve problems involving measurement and conversion of measurements from a larger unit to a smaller unit.",
    category: "Measurement & Data"
  },
  {
    code: "4.MD.B",
    description: "Represent and interpret data.",
    category: "Measurement & Data"
  },
  {
    code: "4.MD.C",
    description: "Geometric measurement: understand concepts of angle and measure angles.",
    category: "Measurement & Data"
  },
  
  // Geometry
  {
    code: "4.G.A",
    description: "Draw and identify lines and angles, and classify shapes by properties of their lines and angles.",
    category: "Geometry"
  },
  
  // Number & Operations—Fractions
  {
    code: "4.NF.A",
    description: "Extend understanding of fraction equivalence and ordering.",
    category: "Number & Operations—Fractions"
  },
  {
    code: "4.NF.B",
    description: "Build fractions from unit fractions by applying and extending previous understandings of operations on whole numbers.",
    category: "Number & Operations—Fractions"
  },
  {
    code: "4.NF.C",
    description: "Understand decimal notation for fractions, and compare decimal fractions.",
    category: "Number & Operations—Fractions"
  }
];

function addGrade4MathStandards() {
  console.log('Adding Grade 4 Math standards to the database...');
  
  for (const standard of grade4MathStandards) {
    try {
      const command = `curl -X POST https://ecs-curriculum.onrender.com/api/standards -H "Content-Type: application/json" -d '{"code":"${standard.code}","description":"${standard.description}","category":"${standard.category}"}'`;
      const result = execSync(command, { encoding: 'utf8' });
      console.log(`✅ Added ${standard.code}: ${standard.description}`);
    } catch (error) {
      console.error(`❌ Error adding ${standard.code}:`, error.message);
    }
  }
  
  console.log('\n✅ Grade 4 Math standards added successfully!');
  console.log('\nThe frontend will automatically display them under Math → Grade 4 → [Standards]');
}

addGrade4MathStandards();
