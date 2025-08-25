// ES module script for adding English Language Arts Language and Research & Media Literacy standards

const elaLanguageStandards = [
  // Kindergarten - Language
  { code: 'WA.ELA-LITERACY.LK.1', description: 'Students notice when and why language is used differently at school, at home, and with peers.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.LK.2', description: 'Students determine the meaning of unknown and multiple-meaning words and phrases.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.LK.3', description: 'Students demonstrate command of the conventions of standard English grammar and usage when speaking and writing.', category: 'Language' },

  // Grade 1 - Language
  { code: 'WA.ELA-LITERACY.L1st.1', description: 'Students notice when and why language is used differently across settings.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L1st.2', description: 'Students determine the meaning of unknown and multiple-meaning words and phrases.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L1st.3', description: 'Students produce and expand sentences in group and individual activities.', category: 'Language' },

  // Grade 2 - Language
  { code: 'WA.ELA-LITERACY.L2nd.1', description: 'Students recognize differences in language use across contexts.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L2nd.2', description: 'Students determine or clarify the meaning of unknown and multiple-meaning words and phrases.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L2nd.3', description: 'Students demonstrate command of English grammar, usage, capitalization, punctuation, and spelling.', category: 'Language' },

  // Grade 3 - Language
  { code: 'WA.ELA-LITERACY.L3rd.1', description: 'Students recognize that language varies depending on audience and purpose.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L3rd.2', description: 'Students determine or clarify the meaning of unknown and multiple-meaning words and phrases.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L3rd.3', description: 'Students demonstrate command of grammar and usage, capitalization, punctuation, and spelling.', category: 'Language' },

  // Grade 4 - Language
  { code: 'WA.ELA-LITERACY.L4th.1', description: 'Students recognize differences between formal and informal English.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L4th.2', description: 'Students determine or clarify the meaning of unknown and multiple-meaning words and phrases.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L4th.3', description: 'Students demonstrate command of grammar and usage, capitalization, punctuation, and spelling.', category: 'Language' },

  // Grade 5 - Language
  { code: 'WA.ELA-LITERACY.L5th.1', description: 'Students expand, combine, and reduce sentences for meaning and style.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L5th.2', description: 'Students determine or clarify the meaning of unknown and multiple-meaning words and phrases.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L5th.3', description: 'Students demonstrate command of grammar and usage, capitalization, punctuation, and spelling.', category: 'Language' },

  // Grade 6 - Language
  { code: 'WA.ELA-LITERACY.L6th.1', description: 'Students use knowledge of language to make effective choices for meaning, style, and impact.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L6th.2', description: 'Students determine or clarify the meaning of unknown and multiple-meaning words and phrases.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L6th.3', description: 'Students demonstrate command of grammar, usage, capitalization, punctuation, and spelling.', category: 'Language' },

  // Grade 7 - Language
  { code: 'WA.ELA-LITERACY.L7th.1', description: 'Students use knowledge of language to make effective choices for meaning, style, and impact.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L7th.2', description: 'Students determine or clarify the meaning of unknown and multiple-meaning words and phrases.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L7th.3', description: 'Students demonstrate command of grammar, usage, capitalization, punctuation, and spelling.', category: 'Language' },

  // Grade 8 - Language
  { code: 'WA.ELA-LITERACY.L8th.1', description: 'Students use knowledge of language to make effective choices for meaning, style, and impact.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L8th.2', description: 'Students determine or clarify the meaning of unknown and multiple-meaning words and phrases.', category: 'Language' },
  { code: 'WA.ELA-LITERACY.L8th.3', description: 'Students demonstrate command of grammar, usage, capitalization, punctuation, and spelling.', category: 'Language' }
];

const elaRMLStandards = [
  // Kindergarten - Research & Media Literacy
  { code: 'WA.ELA-LITERACY.RMLK.1', description: 'Students ask questions about topics or things that make them curious.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RMLK.2', description: 'Students seek answers from provided sources.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RMLK.3', description: 'Students organize information into categories.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RMLK.4', description: 'Students share learning using pictures, words, and digital tools.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RMLK.5', description: 'Students identify the effects of media messages.', category: 'Research & Media Literacy' },

  // Grade 1 - Research & Media Literacy
  { code: 'WA.ELA-LITERACY.RML1st.1', description: 'Students ask questions about a provided topic or things that make them curious.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML1st.2', description: 'Students seek answers from provided information sources.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML1st.3', description: 'Students organize information into categories.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML1st.4', description: 'Students share learning using pictures, words, and digital tools.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML1st.5', description: 'Students identify the effects of media messages.', category: 'Research & Media Literacy' },

  // Grade 2 - Research & Media Literacy
  { code: 'WA.ELA-LITERACY.RML2nd.1', description: 'Students generate questions and identify topics for inquiry.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML2nd.2', description: 'Students gather information from multiple provided sources.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML2nd.3', description: 'Students categorize and interpret information.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML2nd.4', description: 'Students share learning using writing, speaking, and digital tools.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML2nd.5', description: 'Students identify the effects of media messages.', category: 'Research & Media Literacy' },

  // Grade 3 - Research & Media Literacy
  { code: 'WA.ELA-LITERACY.RML3rd.1', description: 'Students generate questions and identify topics for inquiry.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML3rd.2', description: 'Students gather information from multiple print and digital sources.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML3rd.3', description: 'Students categorize and interpret information.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML3rd.4', description: 'Students share learning through writing, speaking, and digital tools.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML3rd.5', description: 'Students evaluate the effects of media messages.', category: 'Research & Media Literacy' },

  // Grade 4 - Research & Media Literacy
  { code: 'WA.ELA-LITERACY.RML4th.1', description: 'Students generate questions and identify topics for inquiry.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML4th.2', description: 'Students gather relevant information from multiple print and digital sources.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML4th.3', description: 'Students analyze and interpret information.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML4th.4', description: 'Students share learning through writing, speaking, and digital tools.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML4th.5', description: 'Students evaluate the effects of media messages.', category: 'Research & Media Literacy' },

  // Grade 5 - Research & Media Literacy
  { code: 'WA.ELA-LITERACY.RML5th.1', description: 'Students generate questions and identify topics for inquiry.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML5th.2', description: 'Students gather relevant information from multiple print and digital sources.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML5th.3', description: 'Students analyze and interpret information.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML5th.4', description: 'Students share learning through writing, speaking, and digital tools.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML5th.5', description: 'Students evaluate the effects of media messages.', category: 'Research & Media Literacy' },

  // Grade 6 - Research & Media Literacy
  { code: 'WA.ELA-LITERACY.RML6th.1', description: 'Students generate compelling questions for inquiry.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML6th.2', description: 'Students gather information from multiple credible sources.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML6th.3', description: 'Students analyze and interpret information to answer questions.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML6th.4', description: 'Students share learning through writing, speaking, and digital tools.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML6th.5', description: 'Students evaluate the impact of media messages and sources.', category: 'Research & Media Literacy' },

  // Grade 7 - Research & Media Literacy
  { code: 'WA.ELA-LITERACY.RML7th.1', description: 'Students generate compelling questions for inquiry.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML7th.2', description: 'Students gather information from multiple credible sources.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML7th.3', description: 'Students analyze and interpret information to answer questions.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML7th.4', description: 'Students share learning through writing, speaking, and digital tools.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML7th.5', description: 'Students evaluate the impact of media messages and sources.', category: 'Research & Media Literacy' },

  // Grade 8 - Research & Media Literacy
  { code: 'WA.ELA-LITERACY.RML8th.1', description: 'Students generate compelling questions for inquiry.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML8th.2', description: 'Students gather information from multiple credible sources.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML8th.3', description: 'Students analyze and interpret information to answer questions.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML8th.4', description: 'Students share learning through writing, speaking, and digital tools.', category: 'Research & Media Literacy' },
  { code: 'WA.ELA-LITERACY.RML8th.5', description: 'Students evaluate the impact of media messages and sources.', category: 'Research & Media Literacy' }
];

async function addELALanguageRMLStandards() {
  console.log('Adding English Language Arts Language standards to the database...');
  
  for (const standard of elaLanguageStandards) {
    try {
      const response = await fetch('https://ecs-curriculum.onrender.com/api/standards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(standard),
      });

      if (response.ok) {
        console.log(`✅ Added Language: ${standard.code}`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Failed to add Language ${standard.code}: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Error adding Language ${standard.code}: ${error.message}`);
    }
  }

  console.log('Adding English Language Arts Research & Media Literacy standards to the database...');
  
  for (const standard of elaRMLStandards) {
    try {
      const response = await fetch('https://ecs-curriculum.onrender.com/api/standards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(standard),
      });

      if (response.ok) {
        console.log(`✅ Added RML: ${standard.code}`);
      } else {
        const errorText = await response.text();
        console.log(`❌ Failed to add RML ${standard.code}: ${errorText}`);
      }
    } catch (error) {
      console.log(`❌ Error adding RML ${standard.code}: ${error.message}`);
    }
  }
  
  console.log('Finished adding English Language Arts Language and Research & Media Literacy standards!');
}

addELALanguageRMLStandards();
