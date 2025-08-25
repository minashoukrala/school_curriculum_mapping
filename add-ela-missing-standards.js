// ES module script for adding missing English Language Arts standards (Kindergarten and Grades 6-8)

const elaMissingStandards = [
  // Kindergarten - Reading
  { code: 'WA.ELA-LITERACY.RK.1', description: 'Students interact with and explore texts in a language-rich environment.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.RK.2', description: 'Students know and apply the basic features of print and how it is organized.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.RK.3', description: 'Students know and apply how concepts of sounds, syllables, words, and silence function in speech.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.RK.4', description: 'Students decode words with accuracy and fluency using grade-level word analysis skills.', category: 'Reading' },

  // Grade 6 - Reading
  { code: 'WA.ELA-LITERACY.R6th.1', description: 'Students interact with and explore texts in a language-rich environment.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R6th.2', description: 'Students comprehend and interpret texts using a variety of strategies.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R6th.3', description: 'Students analyze how authors develop meaning and influence readers.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R6th.4', description: 'Students evaluate texts.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R6th.5', description: 'Students use texts they have read for purposes relevant to them.', category: 'Reading' },

  // Grade 7 - Reading
  { code: 'WA.ELA-LITERACY.R7th.1', description: 'Students interact with and explore texts in a language-rich environment.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R7th.2', description: 'Students comprehend and interpret texts using a variety of strategies.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R7th.3', description: 'Students analyze how authors develop meaning and influence readers.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R7th.4', description: 'Students evaluate texts.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R7th.5', description: 'Students use texts they have read for purposes relevant to them.', category: 'Reading' },

  // Grade 8 - Reading
  { code: 'WA.ELA-LITERACY.R8th.1', description: 'Students interact with and explore texts in a language-rich environment.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R8th.2', description: 'Students comprehend and interpret texts using a variety of strategies.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R8th.3', description: 'Students analyze how authors develop meaning and influence readers.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R8th.4', description: 'Students evaluate texts.', category: 'Reading' },
  { code: 'WA.ELA-LITERACY.R8th.5', description: 'Students use texts they have read for purposes relevant to them.', category: 'Reading' },

  // Kindergarten - Writing
  { code: 'WA.ELA-LITERACY.WK.1', description: 'Students compose to make personal sense of information, ideas, opinions, emotions, and/or experiences.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.WK.2', description: 'Students compose multimodal texts in a variety of genres to communicate with others.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.WK.3', description: 'Students compose to extend thinking and check understanding of self and others.', category: 'Writing' },

  // Grade 6 - Writing
  { code: 'WA.ELA-LITERACY.W6th.1', description: 'Students compose to make personal sense of information, ideas, opinions, emotions, and/or experiences.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W6th.2', description: 'Students compose multimodal texts in a variety of genres to communicate with others.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W6th.3', description: 'Students compose to extend thinking and check understanding of self and others.', category: 'Writing' },

  // Grade 7 - Writing
  { code: 'WA.ELA-LITERACY.W7th.1', description: 'Students compose to make personal sense of information, ideas, opinions, emotions, and/or experiences.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W7th.2', description: 'Students compose multimodal texts in a variety of genres to communicate with others.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W7th.3', description: 'Students compose to extend thinking and check understanding of self and others.', category: 'Writing' },

  // Grade 8 - Writing
  { code: 'WA.ELA-LITERACY.W8th.1', description: 'Students compose to make personal sense of information, ideas, opinions, emotions, and/or experiences.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W8th.2', description: 'Students compose multimodal texts in a variety of genres to communicate with others.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W8th.3', description: 'Students compose to extend thinking and check understanding of self and others.', category: 'Writing' },

  // Kindergarten - Speaking/Listening
  { code: 'WA.ELA-LITERACY.SLDFK.1', description: 'Students listen, respond respectfully, and contribute during discussions.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDFK.2', description: 'Students prepare for and contribute to discussions in groups of various sizes.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDFK.3', description: 'Students integrate and evaluate information presented in diverse media and formats.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDFK.4', description: 'Students present information and support ideas with evidence.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDFK.5', description: 'Students use digital forums for reading, writing, listening, and speaking.', category: 'Speaking/Listening' },

  // Grade 6 - Speaking/Listening
  { code: 'WA.ELA-LITERACY.SLDF6th.1', description: 'Students listen, respond respectfully, and contribute during discussions.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF6th.2', description: 'Students prepare for and contribute to discussions in groups of various sizes.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF6th.3', description: 'Students integrate and evaluate information presented in diverse media and formats.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF6th.4', description: 'Students present information and support ideas with evidence.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF6th.5', description: 'Students use digital forums for reading, writing, listening, and speaking.', category: 'Speaking/Listening' },

  // Grade 7 - Speaking/Listening
  { code: 'WA.ELA-LITERACY.SLDF7th.1', description: 'Students listen, respond respectfully, and contribute during discussions.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF7th.2', description: 'Students prepare for and contribute to discussions in groups of various sizes.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF7th.3', description: 'Students integrate and evaluate information presented in diverse media and formats.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF7th.4', description: 'Students present information and support ideas with evidence.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF7th.5', description: 'Students use digital forums for reading, writing, listening, and speaking.', category: 'Speaking/Listening' },

  // Grade 8 - Speaking/Listening
  { code: 'WA.ELA-LITERACY.SLDF8th.1', description: 'Students listen, respond respectfully, and contribute during discussions.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF8th.2', description: 'Students prepare for and contribute to discussions in groups of various sizes.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF8th.3', description: 'Students integrate and evaluate information presented in diverse media and formats.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF8th.4', description: 'Students present information and support ideas with evidence.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF8th.5', description: 'Students use digital forums for reading, writing, listening, and speaking.', category: 'Speaking/Listening' }
];

async function addELAMissingStandards() {
  console.log('Adding missing English Language Arts standards to the database...');
  
  for (const standard of elaMissingStandards) {
    try {
      const response = await fetch('https://ecs-curriculum.onrender.com/api/standards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(standard),
      });

      if (response.ok) {
        console.log(`✅ Added: ${standard.code} (${standard.category})`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Failed to add ${standard.code}: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Error adding ${standard.code}: ${error.message}`);
    }
  }
  
  console.log('Finished adding missing English Language Arts standards!');
}

addELAMissingStandards();
