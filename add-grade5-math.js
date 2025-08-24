import { execSync } from 'child_process';

// Grade 5 Math standards
const grade5MathStandards = [
  // Operations & Algebraic Thinking
  {
    code: "5.OA.A",
    description: "Write and interpret numerical expressions.",
    category: "Operations & Algebraic Thinking"
  },
  {
    code: "5.OA.B",
    description: "Analyze patterns and relationships.",
    category: "Operations & Algebraic Thinking"
  },
  
  // Number & Operations in Base Ten
  {
    code: "5.NBT.A",
    description: "Understand the place value system.",
    category: "Number & Operations in Base Ten"
  },
  {
    code: "5.NBT.B",
    description: "Perform operations with multi-digit whole numbers and with decimals to hundredths.",
    category: "Number & Operations in Base Ten"
  },
  
  // Measurement & Data
  {
    code: "5.MD.A",
    description: "Convert like measurement units within a given measurement system.",
    category: "Measurement & Data"
  },
  {
    code: "5.MD.B",
    description: "Represent and interpret data.",
    category: "Measurement & Data"
  },
  {
    code: "5.MD.C",
    description: "Geometric measurement: understand concepts of volume and relate volume to multiplication and to addition.",
    category: "Measurement & Data"
  },
  
  // Geometry
  {
    code: "5.G.A",
    description: "Graph points on the coordinate plane to solve real-world and mathematical problems.",
    category: "Geometry"
  },
  {
    code: "5.G.B",
    description: "Classify two-dimensional figures into categories based on their properties.",
    category: "Geometry"
  },
  
  // Number & Operations—Fractions
  {
    code: "5.NF.A",
    description: "Use equivalent fractions as a strategy to add and subtract fractions.",
    category: "Number & Operations—Fractions"
  },
  {
    code: "5.NF.B",
    description: "Apply and extend previous understandings of multiplication and division to multiply and divide fractions.",
    category: "Number & Operations—Fractions"
  }
];

function addGrade5MathStandards() {
  console.log('Adding Grade 5 Math standards to the database...');
  
  for (const standard of grade5MathStandards) {
    try {
      const command = `curl -X POST https://ecs-curriculum.onrender.com/api/standards -H "Content-Type: application/json" -d '{"code":"${standard.code}","description":"${standard.description}","category":"${standard.category}"}'`;
      const result = execSync(command, { encoding: 'utf8' });
      console.log(`✅ Added ${standard.code}: ${standard.description}`);
    } catch (error) {
      console.error(`❌ Error adding ${standard.code}:`, error.message);
    }
  }
  
  console.log('\n✅ Grade 5 Math standards added successfully!');
  console.log('\nThe frontend will automatically display them under Math → Grade 5 → [Standards]');
}

addGrade5MathStandards();
