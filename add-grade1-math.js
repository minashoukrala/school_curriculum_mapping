import { execSync } from 'child_process';

// Grade 1 Math standards
const grade1MathStandards = [
  // Operations & Algebraic Thinking
  {
    code: "1.OA.A",
    description: "Represent and solve problems involving addition and subtraction.",
    category: "Operations & Algebraic Thinking"
  },
  {
    code: "1.OA.B",
    description: "Understand and apply properties of operations and the relationship between addition and subtraction.",
    category: "Operations & Algebraic Thinking"
  },
  {
    code: "1.OA.C",
    description: "Add and subtract within 20.",
    category: "Operations & Algebraic Thinking"
  },
  {
    code: "1.OA.D",
    description: "Work with addition and subtraction equations.",
    category: "Operations & Algebraic Thinking"
  },
  
  // Number & Operations in Base Ten
  {
    code: "1.NBT.A",
    description: "Extend the counting sequence.",
    category: "Number & Operations in Base Ten"
  },
  {
    code: "1.NBT.B",
    description: "Understand place value.",
    category: "Number & Operations in Base Ten"
  },
  {
    code: "1.NBT.C",
    description: "Use place value understanding and properties of operations to add and subtract.",
    category: "Number & Operations in Base Ten"
  },
  
  // Measurement & Data
  {
    code: "1.MD.A",
    description: "Measure lengths indirectly and by iterating length units.",
    category: "Measurement & Data"
  },
  {
    code: "1.MD.B",
    description: "Tell and write time.",
    category: "Measurement & Data"
  },
  {
    code: "1.MD.C",
    description: "Represent and interpret data.",
    category: "Measurement & Data"
  },
  
  // Geometry
  {
    code: "1.G.A",
    description: "Reason with shapes and their attributes.",
    category: "Geometry"
  }
];

function addGrade1MathStandards() {
  console.log('Adding Grade 1 Math standards to the database...');
  
  for (const standard of grade1MathStandards) {
    try {
      const command = `curl -X POST https://ecs-curriculum.onrender.com/api/standards -H "Content-Type: application/json" -d '{"code":"${standard.code}","description":"${standard.description}","category":"${standard.category}"}'`;
      const result = execSync(command, { encoding: 'utf8' });
      console.log(`✅ Added ${standard.code}: ${standard.description}`);
    } catch (error) {
      console.error(`❌ Error adding ${standard.code}:`, error.message);
    }
  }
  
  console.log('\n✅ Grade 1 Math standards added successfully!');
  console.log('\nThe frontend will automatically display them under Math → Grade 1 → [Subject Areas]');
}

addGrade1MathStandards();
