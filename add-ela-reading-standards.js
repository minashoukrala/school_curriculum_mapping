// ES module script for adding English Language Arts Reading standards

const elaReadingStandards = [
  // Grade 1 - Reading
  { code: 'WA.ELA-LITERACY.R1st.1', description: 'Students interact with and explore texts in a language-rich environment.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R1st.2', description: 'Students know and apply the basic features of print and how it is organized.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R1st.3', description: 'Students know and apply how concepts of sounds, syllables, words, and silence function in speech.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R1st.4', description: 'Students decode words with accuracy and fluency using grade-level word analysis skills.', category: 'Reading' },

  // Grade 2 - Reading
  { code: 'WA.ELA-LITERACY.R2nd.1', description: 'Students interact with and explore texts in a language-rich environment.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R2nd.2', description: 'Students know and apply the basic features of print and how it is organized.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R2nd.3', description: 'Students know and apply how concepts of sounds, syllables, words, and silence function in speech.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R2nd.4', description: 'Students decode words with accuracy and fluency using grade-level word analysis skills.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R2nd.5', description: 'Students comprehend and interpret texts using a variety of strategies.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R2nd.6', description: 'Students describe how the author, illustrator, and/or creator shape meaning and affect a reader\'s experience.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R2nd.7', description: 'Students evaluate texts.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R2nd.8', description: 'Students use texts they have read for purposes relevant to them.', category: 'Reading' },

  // Grade 3 - Reading
  { code: 'WA.ELA-LITERACY.R3rd.1', description: 'Students interact with and explore texts in a language-rich environment.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R3rd.2', description: 'Students know and apply the basic features of print and how it is organized.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R3rd.5', description: 'Students comprehend and interpret texts using a variety of strategies.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R3rd.6', description: 'Students describe how the author, illustrator, and/or creator shape meaning and affect a reader\'s experience.', category: 'Reading' },

  // Grade 4 - Reading
  { code: 'WA.ELA-LITERACY.R4th.1', description: 'Students interact with and explore texts in a language-rich environment.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R4th.2', description: 'Students know and apply the basic features of print and how it is organized.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R4th.4', description: 'Students decode words with accuracy and fluency using grade-level word analysis skills.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R4th.5', description: 'Students comprehend and interpret texts using a variety of strategies.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R4th.6', description: 'Students explain how the author, illustrator, and/or creator shape meaning and reader experience.', category: 'Reading' },

  // Grade 5 - Reading
  { code: 'WA.ELA-LITERACY.R5th.1', description: 'Students interact with and explore texts in a language-rich environment.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R5th.2', description: 'Students know and apply the basic features of print and how it is organized.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R5th.4', description: 'Students decode words with accuracy and fluency using grade-level word analysis skills.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R5th.5', description: 'Students comprehend and interpret texts using a variety of strategies.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R5th.6', description: 'Students explain how the author, illustrator, and/or creator shape meaning and reader experience.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R5th.7', description: 'Students evaluate texts.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R5th.8', description: 'Students use texts they have read for purposes relevant to them.', category: 'Reading' }
];

async function addELAReadingStandards() {
  console.log('Adding English Language Arts Reading standards to the database...');
  
  for (const standard of elaReadingStandards) {
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
  
  console.log('Finished adding English Language Arts Reading standards!');
}

addELAReadingStandards();
