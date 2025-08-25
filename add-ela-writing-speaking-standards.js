// ES module script for adding English Language Arts Writing and Speaking/Listening standards

const elaWritingStandards = [
  // Grade 1 - Writing
  { code: 'WA.ELA-LITERACY.W1st.1', description: 'Students compose to make personal sense of information, ideas, opinions, emotions, and/or experiences.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W1st.2', description: 'Students compose multimodal texts in a variety of genres to communicate with others.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W1st.3', description: 'Students compose to extend thinking and check understanding of self and others.', category: 'Writing' },

  // Grade 2 - Writing
  { code: 'WA.ELA-LITERACY.W2nd.1', description: 'Students compose to make personal sense of information, ideas, opinions, emotions, and/or experiences.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W2nd.2', description: 'Students compose multimodal texts in a variety of genres to communicate with others.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W2nd.3', description: 'Students compose to extend thinking and check understanding of self and others.', category: 'Writing' },

  // Grade 3 - Writing
  { code: 'WA.ELA-LITERACY.W3rd.1', description: 'Students compose to make personal sense of information, ideas, opinions, emotions, and/or experiences.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W3rd.2', description: 'Students compose multimodal texts in a variety of genres to communicate with others.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W3rd.3', description: 'Students compose to extend thinking and check understanding of self and others.', category: 'Writing' },

  // Grade 4 - Writing
  { code: 'WA.ELA-LITERACY.W4th.1', description: 'Students compose to make personal sense of information, ideas, opinions, emotions, and/or experiences.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W4th.2', description: 'Students compose multimodal texts in a variety of genres to communicate with others.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W4th.3', description: 'Students compose to extend thinking and check understanding of self and others.', category: 'Writing' },

  // Grade 5 - Writing
  { code: 'WA.ELA-LITERACY.W5th.1', description: 'Students compose to make personal sense of information, ideas, opinions, emotions, and/or experiences.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W5th.2', description: 'Students compose multimodal texts in a variety of genres to communicate with others.', category: 'Writing' },
  { code: 'WA.ELA-LITERACY.W5th.3', description: 'Students compose to extend thinking and check understanding of self and others.', category: 'Writing' }
];

const elaSpeakingListeningStandards = [
  // Grade 1 - Speaking/Listening
  { code: 'WA.ELA-LITERACY.SLDF1st.1', description: 'Students listen, respond respectfully, and contribute during discussions.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF1st.2', description: 'Students prepare for and contribute to discussions in groups of various sizes.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF1st.3', description: 'Students integrate and evaluate information presented in diverse media and formats.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF1st.4', description: 'Students present information and support ideas with evidence.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF1st.5', description: 'Students use digital forums for reading, writing, listening, and speaking.', category: 'Speaking/Listening' },

  // Grade 2 - Speaking/Listening
  { code: 'WA.ELA-LITERACY.SLDF2nd.1', description: 'Students listen, respond respectfully, and contribute during discussions.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF2nd.2', description: 'Students prepare for and contribute to discussions in groups of various sizes.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF2nd.3', description: 'Students integrate and evaluate information presented in diverse media and formats.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF2nd.4', description: 'Students present information and support ideas with evidence.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF2nd.5', description: 'Students use digital forums for reading, writing, listening, and speaking.', category: 'Speaking/Listening' },

  // Grade 3 - Speaking/Listening
  { code: 'WA.ELA-LITERACY.SLDF3rd.1', description: 'Students listen, respond respectfully, and contribute during discussions.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF3rd.2', description: 'Students prepare for and contribute to discussions in groups of various sizes.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF3rd.3', description: 'Students integrate and evaluate information presented in diverse media and formats.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF3rd.4', description: 'Students present information and support ideas with evidence.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF3rd.5', description: 'Students use digital forums for reading, writing, listening, and speaking.', category: 'Speaking/Listening' },

  // Grade 4 - Speaking/Listening
  { code: 'WA.ELA-LITERACY.SLDF4th.1', description: 'Students listen, respond respectfully, and contribute during discussions.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF4th.2', description: 'Students prepare for and contribute to discussions in groups of various sizes.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF4th.3', description: 'Students integrate and evaluate information presented in diverse media and formats.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF4th.4', description: 'Students present information and support ideas with evidence.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF4th.5', description: 'Students use digital forums for reading, writing, listening, and speaking.', category: 'Speaking/Listening' },

  // Grade 5 - Speaking/Listening
  { code: 'WA.ELA-LITERACY.SLDF5th.1', description: 'Students listen, respond respectfully, and contribute during discussions.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF5th.2', description: 'Students prepare for and contribute to discussions in groups of various sizes.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF5th.3', description: 'Students integrate and evaluate information presented in diverse media and formats.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF5th.4', description: 'Students present information and support ideas with evidence.', category: 'Speaking/Listening' },
  { code: 'WA.ELA-LITERACY.SLDF5th.5', description: 'Students use digital forums for reading, writing, listening, and speaking.', category: 'Speaking/Listening' }
];

async function addELAWritingSpeakingStandards() {
  console.log('Adding English Language Arts Writing standards to the database...');
  
  for (const standard of elaWritingStandards) {
    try {
      const response = await fetch('https://ecs-curriculum.onrender.com/api/standards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(standard),
      });

      if (response.ok) {
        console.log(`✅ Added Writing: ${standard.code}`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Failed to add Writing ${standard.code}: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Error adding Writing ${standard.code}: ${error.message}`);
    }
  }

  console.log('Adding English Language Arts Speaking/Listening standards to the database...');
  
  for (const standard of elaSpeakingListeningStandards) {
    try {
      const response = await fetch('https://ecs-curriculum.onrender.com/api/standards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(standard),
      });

      if (response.ok) {
        console.log(`✅ Added Speaking/Listening: ${standard.code}`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Failed to add Speaking/Listening ${standard.code}: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Error adding Speaking/Listening ${standard.code}: ${error.message}`);
    }
  }
  
  console.log('Finished adding English Language Arts Writing and Speaking/Listening standards!');
}

addELAWritingSpeakingStandards();
