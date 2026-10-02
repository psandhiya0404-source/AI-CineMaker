const axios = require('axios');

class StoryProvider {
  /**
   * Analyze a story script/text to extract characters, breakdown scenes, and cinematic metadata.
   * @param {Object} params - { storyContent, storyTitle, genre, visualStyle, language }
   */
  async analyzeStory({ storyContent, storyTitle, genre = 'Thriller', visualStyle = 'Photorealistic', language = 'English' }) {
    // If OpenAI or Gemini API key is configured, attempt LLM call
    if (process.env.OPENAI_API_KEY) {
      try {
        return await this.analyzeWithOpenAI({ storyContent, storyTitle, genre, visualStyle, language });
      } catch (err) {
        console.warn('[AI Story] OpenAI failed, falling back to cinematic NLP parser:', err.message);
      }
    }

    if (process.env.GEMINI_API_KEY) {
      try {
        return await this.analyzeWithGemini({ storyContent, storyTitle, genre, visualStyle, language });
      } catch (err) {
        console.warn('[AI Story] Gemini failed, falling back to cinematic NLP parser:', err.message);
      }
    }

    // High-fidelity built-in cinematic analysis engine
    return this.analyzeWithLocalEngine({ storyContent, storyTitle, genre, visualStyle, language });
  }

  async analyzeWithOpenAI({ storyContent, storyTitle, genre, visualStyle, language }) {
    const prompt = `You are a Hollywood Director and Screenplay Analyst.
Analyze the following story and return a JSON object with:
1. "summary": A brief 2-3 sentence cinematic logline.
2. "characters": Array of objects:
   - "name": string
   - "age": number
   - "gender": string ("Male" | "Female" | "Other")
   - "role": string ("Protagonist" | "Antagonist" | "Detective" | "Supporting" | "Mentor")
   - "personality": string
   - "appearance": {
       "face": string,
       "hair": string,
       "skinTone": string,
       "bodyType": string,
       "clothing": string,
       "accessories": string,
       "identifyingFeatures": string
     }
   - "description": string
3. "scenes": Array of objects (in chronological sequence):
   - "sceneNumber": number (1, 2, 3...)
   - "title": string
   - "location": string (e.g. "Interior Detective Office", "Exterior Rainy Alleyway")
   - "timeOfDay": string ("Night", "Day", "Golden Hour", "Dusk", "Midnight")
   - "characterNames": array of strings (names matching characters)
   - "action": string (detailed live-action cinematic action)
   - "dialogue": { "speaker": string, "text": string }
   - "emotion": string
   - "camera": { "shot": string, "movement": string, "angle": string, "lens": string }
   - "lighting": string (detailed photorealistic lighting description)
   - "visualDescription": string (detailed live-action cinematic film still prompt)
   - "duration": number (duration in seconds, 3 to 8)
4. "themes": array of strings
5. "locations": array of strings

Story Title: ${storyTitle || 'Untitled'}
Genre: ${genre}
Visual Style: ${visualStyle}
Language: ${language}

STORY CONTENT:
${storyContent}

Return ONLY valid JSON matching this schema.`;

    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      }
    );

    return JSON.parse(response.data.choices[0].message.content);
  }

  async analyzeWithGemini({ storyContent, storyTitle, genre, visualStyle, language }) {
    const prompt = `You are a Hollywood Director and Screenplay Analyst.
Analyze this story and output strict JSON with summary, characters, scenes, themes, locations:
Title: ${storyTitle}
Genre: ${genre}
Style: ${visualStyle}
Story:
${storyContent}`;

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const response = await axios.post(
      url,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      },
      { timeout: 30000 }
    );

    const text = response.data.candidates[0].content.parts[0].text;
    return JSON.parse(text);
  }

  /**
   * Built-in intelligent cinematic parsing engine.
   * Extracts characters and breaks story paragraphs/sentences into screenplay scenes.
   */
  analyzeWithLocalEngine({ storyContent = '', storyTitle = 'Cinematic Story', genre = 'Thriller', visualStyle = 'Photorealistic', language = 'English' }) {
    const text = storyContent.trim();
    if (!text) {
      return this.getDefaultSampleAnalysis(genre, visualStyle);
    }

    // Identify named entities / characters in story
    const extractedCharacters = this.extractCharactersFromText(text, genre);

    // Break text into logical scenes (split by paragraphs or double newlines)
    const paragraphs = text
      .split(/\n\s*\n|\n(?=[A-Z][a-z]+ [A-Z]|Scene \d+|SCENE \d+)/)
      .map(p => p.trim())
      .filter(p => p.length > 15);

    const rawSceneChunks = paragraphs.length > 0 ? paragraphs : [text];

    const scenes = rawSceneChunks.map((chunk, index) => {
      const sceneNum = index + 1;
      const matchedCharacters = extractedCharacters.filter(c => 
        chunk.toLowerCase().includes(c.name.toLowerCase())
      );

      // Determine speaker & dialogue if present in quotes
      const dialogueMatch = chunk.match(/"([^"]+)"|'([^']+)'|“([^”]+)”/);
      let dialogueText = '';
      let speakerName = matchedCharacters[0] ? matchedCharacters[0].name : '';

      if (dialogueMatch) {
        dialogueText = dialogueMatch[1] || dialogueMatch[2] || dialogueMatch[3] || '';
      }

      // Infer location and time
      const isNight = /night|dark|rain|streetlamp|shadow|midnight|evening|lamp/i.test(chunk);
      const isExt = /street|road|alley|outside|forest|city|park|car|exterior|ext\./i.test(chunk);
      const location = isExt 
        ? (chunk.toLowerCase().includes('rain') ? 'Exterior Rain-Soaked Neon Alley' : 'Exterior Urban Downtown District')
        : (chunk.toLowerCase().includes('office') ? 'Interior Private Investigation Office' : 'Interior Dimly Lit Chamber');

      const timeOfDay = isNight ? 'Night' : 'Golden Hour';

      // Cinematic camera shot variations
      const cameraSetups = [
        { shot: 'Medium Close-Up', movement: 'Slow Push-In', lens: '50mm Anamorphic f/1.4', angle: 'Eye Level' },
        { shot: 'Wide Establishing Shot', movement: 'Slow Drone Dolly Forward', lens: '24mm Master Prime', angle: 'Low Angle' },
        { shot: 'Over-The-Shoulder Shot', movement: 'Subtle Handheld Drift', lens: '85mm f/1.8', angle: 'Eye Level' },
        { shot: 'Extreme Close-Up', movement: 'Rack Focus on Eyes', lens: '100mm Macro f/2.8', angle: 'Dutch Angle' },
        { shot: 'Tracking Two-Shot', movement: 'Smooth Steadicam Tracking', lens: '35mm High-Speed Cine', angle: 'Eye Level' }
      ];
      const camera = cameraSetups[index % cameraSetups.length];

      return {
        sceneNumber: sceneNum,
        title: `Scene ${sceneNum < 10 ? '0' + sceneNum : sceneNum}: ${location}`,
        location,
        timeOfDay,
        characterNames: matchedCharacters.length > 0 ? matchedCharacters.map(c => c.name) : [extractedCharacters[0]?.name || 'Protagonist'],
        action: chunk.replace(/"[^"]+"/g, '').trim() || 'A tense cinematic moment unfolds with intense character focus.',
        dialogue: {
          speaker: speakerName || 'Protagonist',
          text: dialogueText || (index === 0 ? 'We only have one shot at this.' : 'Everything connects back to that night.'),
        },
        emotion: this.inferEmotion(chunk, genre),
        camera,
        lighting: isNight 
          ? 'Low-key atmospheric moody lighting, warm tungsten practicals with deep cool shadows and anamorphic blue streak flares'
          : 'Natural diffused golden hour sunlight streaming through atmospheric dust motes with soft shadow roll-off',
        visualDescription: `Cinematic photorealistic live-action still, ${location}, ${timeOfDay}. ${chunk.slice(0, 150)}. 35mm film grain, 8k resolution, Arri Alexa Mini LF.`,
        duration: Math.min(8, Math.max(4, Math.round(chunk.length / 50))),
      };
    });

    return {
      summary: `A gripping ${genre.toLowerCase()} narrative focused on ${extractedCharacters.map(c => c.name).join(' and ')}, exploring high-stakes conflict and realistic live-action cinematic drama.`,
      characters: extractedCharacters,
      scenes: scenes.slice(0, 12), // Up to 12 structured scenes
      themes: ['Deception', 'Survival', 'Identity', 'Resolution'],
      locations: [...new Set(scenes.map(s => s.location))],
    };
  }

  extractCharactersFromText(text, genre) {
    // Look for capitalized names or detective/protagonist archetypes
    const nameRegex = /\b([A-Z][a-z]{2,15})\b/g;
    const commonWords = new Set([
      'The', 'Then', 'They', 'This', 'That', 'When', 'Where', 'What', 'While', 'After', 'Before', 'Suddenly', 'With', 'From', 'Into', 'Scene', 'Night', 'Dark', 'Rain', 'Door', 'Room', 'Street', 'Light', 'Look', 'Walk', 'Said', 'Whispered', 'Stood', 'Turned', 'He', 'She', 'His', 'Her'
    ]);

    const detectedNames = new Map();
    let match;
    while ((match = nameRegex.exec(text)) !== null) {
      const name = match[1];
      if (!commonWords.has(name) && name.length >= 3) {
        detectedNames.set(name, (detectedNames.get(name) || 0) + 1);
      }
    }

    const sortedNames = [...detectedNames.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);

    if (sortedNames.length === 0) {
      sortedNames.push('Vikram', 'Kavin');
    }

    const characterTemplates = [
      {
        name: sortedNames[0] || 'Vikram',
        age: 32,
        gender: 'Male',
        role: 'Protagonist / Detective',
        personality: 'Observant, stoic, razor-sharp instincts, burdened by the past',
        appearance: {
          face: 'Sharp chiseled jawline, focused dark eyes, slight rugged stubble',
          hair: 'Short textured dark brown hair swept back',
          skinTone: 'Warm olive complexion',
          bodyType: 'Athletic, lean build',
          clothing: 'Charcoal tailored trench coat over an unbuttoned dark linen shirt',
          accessories: 'Vintage silver wristwatch, weathered leather notebook',
          identifyingFeatures: 'Faint thin scar near the left eyebrow',
        },
        description: 'A dedicated investigator with an analytical mind, unwavering under pressure.',
      },
      {
        name: sortedNames[1] || 'Elena',
        age: 28,
        gender: 'Female',
        role: 'Confidant / Key Ally',
        personality: 'Perceptive, quick-witted, fiercely loyal, guarded emotions',
        appearance: {
          face: 'High cheekbones, piercing hazel eyes, determined expression',
          hair: 'Shoulder-length wavy auburn hair tied back loosely',
          skinTone: 'Fair with warm undertones',
          bodyType: 'Slender, poised posture',
          clothing: 'Dark emerald wool coat over a charcoal turtleneck',
          accessories: 'Silver pendant necklace, leather gloves',
          identifyingFeatures: 'Small beauty mark beneath right eye',
        },
        description: 'An astute strategist who holds critical missing pieces of the puzzle.',
      },
      {
        name: sortedNames[2] || 'Marcus',
        age: 45,
        gender: 'Male',
        role: 'Antagonist / Shadow Broker',
        personality: 'Calculating, manipulative, soft-spoken yet commanding',
        appearance: {
          face: 'Stern weathered features, cold steel-grey eyes',
          hair: 'Neatly groomed salt-and-pepper hair',
          skinTone: 'Pale natural tone',
          bodyType: 'Broad-shouldered, imposing presence',
          clothing: 'Midnight navy bespoke double-breasted suit',
          accessories: 'Gold signet ring on right pinky finger',
          identifyingFeatures: 'Slight limp when walking',
        },
        description: 'A shadowy figure orchestrating events from behind the scenes.',
      }
    ];

    return characterTemplates.slice(0, Math.max(2, Math.min(3, sortedNames.length)));
  }

  inferEmotion(chunk, genre) {
    if (/fear|horror|terrified|scream|blood/i.test(chunk)) return 'Intense Fear';
    if (/love|kiss|gentle|touch|embrace/i.test(chunk)) return 'Intimate & Tender';
    if (/fight|run|gun|explosion|punch|crash/i.test(chunk)) return 'High Adrenaline';
    if (/puzzle|clue|investigate|secret|whisper/i.test(chunk)) return 'Suspenseful Intrigue';
    if (/sad|cry|grief|lost|alone/i.test(chunk)) return 'Melancholy';
    return genre === 'Romance' ? 'Romantic Tension' : 'Tense & Gripping';
  }

  getDefaultSampleAnalysis(genre, visualStyle) {
    return {
      summary: `A high-stakes ${genre.toLowerCase()} film exploring mystery, character bonds, and thrilling cinematic confrontations.`,
      characters: [
        {
          name: 'Vikram',
          age: 32,
          gender: 'Male',
          role: 'Lead Detective',
          personality: 'Sharp-minded, observant, stoic',
          appearance: {
            face: 'Sharp chiseled jawline, intense focused eyes, slight stubble',
            hair: 'Short textured dark hair',
            skinTone: 'Warm olive',
            bodyType: 'Athletic, lean',
            clothing: 'Charcoal trench coat, dark shirt',
            accessories: 'Vintage silver wristwatch',
            identifyingFeatures: 'Faint scar over left eyebrow',
          },
          description: 'A veteran investigator uncovering an intricate web of secrets.',
        },
        {
          name: 'Kavin',
          age: 29,
          gender: 'Male',
          role: 'Analyst & Partner',
          personality: 'Technical genius, alert, loyal',
          appearance: {
            face: 'Youthful expressive face, keen gaze',
            hair: 'Neat taper fade cut',
            skinTone: 'Natural tan',
            bodyType: 'Slender',
            clothing: 'Dark bomber jacket, graphite crewneck',
            accessories: 'Wireframe glasses',
            identifyingFeatures: 'None',
          },
          description: 'Vikram’s trusted intelligence specialist.',
        }
      ],
      scenes: [
        {
          sceneNumber: 1,
          title: 'Scene 01: The Investigation Begins',
          location: 'Interior Detective Office',
          timeOfDay: 'Night',
          characterNames: ['Vikram', 'Kavin'],
          action: 'Vikram examines a weathered photograph under the desk lamp while Kavin reviews surveillance notes.',
          dialogue: { speaker: 'Vikram', text: 'This timeline doesn’t make sense. Someone altered the logs.' },
          emotion: 'Suspenseful Intrigue',
          camera: { shot: 'Medium Close-Up', movement: 'Slow Push-In', lens: '50mm Anamorphic', angle: 'Eye Level' },
          lighting: 'Low-key warm tungsten desk light contrasting against cool blue rain-splashed window reflections',
          visualDescription: 'Realistic cinematic live-action film still, 35mm photography, Vikram inspecting clues in a dark moody office.',
          duration: 5,
        },
        {
          sceneNumber: 2,
          title: 'Scene 02: Rain-Soaked Street Encounter',
          location: 'Exterior Wet City Street',
          timeOfDay: 'Midnight',
          characterNames: ['Vikram'],
          action: 'Vikram steps out onto the wet asphalt, headlights illuminating mist as a black sedan idles in the distance.',
          dialogue: { speaker: 'Vikram', text: 'Stay in position, Kavin. I see them.' },
          emotion: 'High Tension',
          camera: { shot: 'Wide Tracking Shot', movement: 'Steadicam tracking alongside', lens: '35mm Cine Lens', angle: 'Low Angle' },
          lighting: 'Neon amber and cyan wet asphalt reflections, volumetric rain fog',
          visualDescription: 'Photorealistic live-action cinematic frame, Vikram in charcoal coat on rainy street, headlights through mist.',
          duration: 6,
        }
      ],
      themes: ['Truth', 'Loyalty', 'Conspiracy'],
      locations: ['Interior Detective Office', 'Exterior Wet City Street'],
    };
  }
}

module.exports = new StoryProvider();
