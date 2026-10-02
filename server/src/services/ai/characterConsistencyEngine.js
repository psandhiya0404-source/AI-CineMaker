/**
 * Character Consistency Engine
 * Ensures that character facial features, body type, clothing, and reference identifiers
 * are consistently injected into all scene prompts and multi-modal generation payloads.
 */

class CharacterConsistencyEngine {
  /**
   * Build a unified cinematic prompt for a scene containing character references.
   * @param {Object} scene - The scene object
   * @param {Array} characters - List of character objects in the scene
   * @param {String} visualStyle - The project's visual style (e.g., 'Photorealistic', 'Dark Cinematic')
   * @returns {Object} { prompt, negativePrompt, referenceImages, characterTokens }
   */
  buildConsistentScenePrompt(scene, characters = [], visualStyle = 'Photorealistic') {
    const styleModifiers = this.getStyleModifiers(visualStyle);
    
    // Build character appearance descriptions
    const characterDescriptions = characters.map(char => {
      const app = char.appearance || {};
      return `[CHARACTER: ${char.name.toUpperCase()}, ${char.age}yo ${char.gender}, ${char.role}. Face: ${app.face || 'sharp features'}. Hair: ${app.hair || 'dark'}. Skin tone: ${app.skinTone || 'natural'}. Body: ${app.bodyType || 'average'}. Clothing: ${app.clothing || 'cinematic wardrobe'}. Distinguishing: ${app.identifyingFeatures || 'none'}.]`;
    }).join(' ');

    const characterNames = characters.map(c => c.name).join(' and ');
    const cameraDetails = scene.camera 
      ? `${scene.camera.shot || 'Cinematic Shot'}, ${scene.camera.movement || 'Static'}, ${scene.camera.lens || '35mm anamorphic'}`
      : 'Cinematic Wide Shot, 35mm lens';

    const prompt = [
      `A hyper-realistic cinematic live-action film still.`,
      characters.length > 0 ? `Featuring ${characterNames}.` : '',
      characterDescriptions,
      `Scene action: ${scene.action || 'Characters in dramatic focus'}.`,
      `Location: ${scene.location || 'Cinematic set'}, ${scene.timeOfDay || 'Night'}.`,
      `Lighting: ${scene.lighting || 'Atmospheric volumetric lighting, high contrast cinematic chiaroscuro'}.`,
      `Camera setup: ${cameraDetails}.`,
      `Emotion and atmosphere: ${scene.emotion || 'Intense and dramatic'}.`,
      styleModifiers.positive,
      `Shot on ARRI Alexa LF, 70mm IMAX film, Kodak Vision3 500T, real human skin texture, natural pores, subsurface scattering, 8k raw photo, film grain.`
    ].filter(Boolean).join(' ');

    const negativePrompt = [
      'cartoon, anime, 3d render, illustration, drawing, painting, cgi, fake, plastic skin, doll, deformed eyes, extra limbs, bad anatomy, over-saturated, airbrushed, video game graphic, low quality, blurry, watermark, text, subtitles'
    ].join(', ');

    const referenceImages = characters
      .filter(c => c.referenceImage && c.referenceImage.trim().length > 0)
      .map(c => ({
        characterId: c._id || c.id,
        name: c.name,
        imageUrl: c.referenceImage,
      }));

    return {
      prompt,
      negativePrompt,
      referenceImages,
      charactersInvolved: characters.map(c => c.name),
    };
  }

  /**
   * Build a dedicated character reference portrait prompt
   */
  buildCharacterPortraitPrompt(character, visualStyle = 'Photorealistic') {
    const app = character.appearance || {};
    const styleModifiers = this.getStyleModifiers(visualStyle);

    const prompt = [
      `A cinematic 8k portrait photography of ${character.name}, a ${character.age}-year-old ${character.gender}.`,
      `Role: ${character.role}. Personality: ${character.personality}.`,
      `Face: ${app.face || 'Sharp defined jawline, expressive eyes, realistic skin texture'}.`,
      `Hair: ${app.hair || 'Neat dark hair'}.`,
      `Skin Tone: ${app.skinTone || 'Natural'}.`,
      `Body Type: ${app.bodyType || 'Athletic'}.`,
      `Clothing: ${app.clothing || 'Tailored cinematic outfit'}.`,
      `Accessories: ${app.accessories || 'Minimal subtle accessories'}.`,
      `Identifying Features: ${app.identifyingFeatures || 'None'}.`,
      styleModifiers.positive,
      `Photographed on Hasselblad H6D-100c, 85mm portrait lens at f/1.4, Rembrandt studio lighting, authentic human pores, film grain, live-action feature film character reference, ultra-detailed.`
    ].filter(Boolean).join(' ');

    const negativePrompt = 'cartoon, anime, 3d character, drawing, render, sketch, video game, smooth plastic skin, distorted face, oversaturated, amateur photo, illustration';

    return { prompt, negativePrompt };
  }

  getStyleModifiers(visualStyle) {
    switch (visualStyle) {
      case 'Dark Cinematic':
        return {
          positive: 'Dark atmospheric cinematic mood, deep shadows, teal and orange film color grading, neo-noir aesthetic, brooding ambience',
        };
      case 'Warm Cinematic':
        return {
          positive: 'Warm golden hour cinematic glow, amber highlights, soft film diffusion, rich warm film tones, natural sunlight warmth',
        };
      case 'Night':
        return {
          positive: 'Moody nighttime scene, cinematic wet asphalt reflections, neon and tungsten practical light sources, dark contrast',
        };
      case 'Noir':
        return {
          positive: 'Dramatic film noir lighting, venetian blind shadows, high contrast black and white cinematic composition, smoky atmosphere',
        };
      case 'Vintage 35mm':
        return {
          positive: 'Vintage 1970s Panavision 35mm film stock, organic film grain, warm pastel color palette, cinematic halation',
        };
      case 'Photorealistic':
      default:
        return {
          positive: 'Hyper-realistic live action cinema, authentic natural lighting, award-winning cinematography, photorealistic realism',
        };
    }
  }
}

module.exports = new CharacterConsistencyEngine();
