import { execSync } from 'child_process';

// Grade 2 Math standards
const grade2MathStandards = [
  // Operations & Algebraic Thinking
  {
    code: "2.OA.A",
    description: "Represent and solve problems involving addition and subtraction.",
    category: "Operations & Algebraic Thinking"
  },
  {
    code: "2.OA.B",
    description: "Add and subtract within 20.",
    category: "Operations & Algebraic Thinking"
  },
  {
    code: "2.OA.C",
    description: "Work with equal groups of objects to gain foundations for multiplication.",
    category: "Operations & Algebraic Thinking"
  },
  
  // Number & Operations in Base Ten
  {
    code: "2.NBT.A",
    description: "Understand place value.",
    category: "Number & Operations in Base Ten"
  },
  {
    code: "2.NBT.B",
    description: "Use place value understanding and properties of operations to add and subtract.",
    category: "Number & Operations in Base Ten"
  },
  
  // Measurement & Data
  {
    code: "2.MD.A",
    description: "Measure and estimate lengths in standard units.",
    category: "Measurement & Data"
  },
  {
    code: "2.MD.B",
    description: "Relate addition and subtraction to length.",
    category: "Measurement & Data"
  },
  {
    code: "2.MD.C",
    description: "Work with time and money.",
    category: "Measurement & Data"
  },
  {
    code: "2.MD.D",
    description: "Represent and interpret data.",
    category: "Measurement & Data"
  },
  
  // Geometry
  {
    code: "2.G.A",
    description: "Reason with shapes and their attributes.",
    category: "Geometry"
  }
];

function addGrade2MathStandards() {
  console.log('Adding Grade 2 Math standards to the database...');
  
  for (const standard of grade2MathStandards) {
    try {
      const command = `curl -X POST https://ecs-curriculum.onrender.com/api/standards -H "Content-Type: application/json" -d '{"code":"${standard.code}","description":"${standard.description}","category":"${standard.category}"}'`;
      const result = execSync(command, { encoding: 'utf8' });
      console.log(`✅ Added ${standard.code}: ${standard.description}`);
    } catch (error) {
      console.error(`❌ Error adding ${standard.code}:`, error.message);
    }
  }
  
  console.log('\n✅ Grade 2 Math standards added successfully!');
  console.log('\nThe frontend will automatically display them under Math → Grade 2 → [Subject Areas]');
}

addGrade2MathStandards();
