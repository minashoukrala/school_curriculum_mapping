import { execSync } from 'child_process';

// Grade 3 Math standards
const grade3MathStandards = [
  // Operations & Algebraic Thinking
  {
    code: "3.OA.A",
    description: "Represent and solve problems involving multiplication and division.",
    category: "Operations & Algebraic Thinking"
  },
  {
    code: "3.OA.B",
    description: "Understand properties of multiplication and the relationship between multiplication and division.",
    category: "Operations & Algebraic Thinking"
  },
  {
    code: "3.OA.C",
    description: "Multiply and divide within 100.",
    category: "Operations & Algebraic Thinking"
  },
  {
    code: "3.OA.D",
    description: "Solve problems involving the four operations, and identify and explain patterns in arithmetic.",
    category: "Operations & Algebraic Thinking"
  },
  
  // Number & Operations in Base Ten
  {
    code: "3.NBT.A",
    description: "Use place value understanding and properties of operations to perform multi-digit arithmetic.",
    category: "Number & Operations in Base Ten"
  },
  
  // Measurement & Data
  {
    code: "3.MD.A",
    description: "Solve problems involving measurement and estimation of intervals of time, liquid volumes, and masses of objects.",
    category: "Measurement & Data"
  },
  {
    code: "3.MD.B",
    description: "Represent and interpret data.",
    category: "Measurement & Data"
  },
  {
    code: "3.MD.C",
    description: "Geometric measurement: understand concepts of area and relate area to multiplication and to addition.",
    category: "Measurement & Data"
  },
  {
    code: "3.MD.D",
    description: "Geometric measurement: recognize perimeter as an attribute of plane figures and distinguish between linear and area measures.",
    category: "Measurement & Data"
  },
  
  // Geometry
  {
    code: "3.G.A",
    description: "Reason with shapes and their attributes.",
    category: "Geometry"
  },
  
  // Number & Operations—Fractions
  {
    code: "3.NF.A",
    description: "Develop understanding of fractions as numbers.",
    category: "Number & Operations—Fractions"
  }
];

function addGrade3MathStandards() {
  console.log('Adding Grade 3 Math standards to the database...');
  
  for (const standard of grade3MathStandards) {
    try {
      const command = `curl -X POST https://ecs-curriculum.onrender.com/api/standards -H "Content-Type: application/json" -d '{"code":"${standard.code}","description":"${standard.description}","category":"${standard.category}"}'`;
      const result = execSync(command, { encoding: 'utf8' });
      console.log(`✅ Added ${standard.code}: ${standard.description}`);
    } catch (error) {
      console.error(`❌ Error adding ${standard.code}:`, error.message);
    }
  }
  
  console.log('\n✅ Grade 3 Math standards added successfully!');
  console.log('\nThe frontend will automatically display them under Math → Grade 3 → [Standards]');
}

addGrade3MathStandards();
