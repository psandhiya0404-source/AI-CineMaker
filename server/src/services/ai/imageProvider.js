const axios = require('axios');
const characterConsistencyEngine = require('./characterConsistencyEngine');

class ImageProvider {
  /**
   * Generate a character portrait reference image.
   * @param {Object} character - Character object
   * @param {String} visualStyle - Project visual style
   * @returns {Promise<{ imageUrl: string, prompt: string }>}
   */
  async generateCharacterReference(character, visualStyle = 'Photorealistic') {
    const { prompt, negativePrompt } = characterConsistencyEngine.buildCharacterPortraitPrompt(character, visualStyle);

    // If Stability or OpenAI is configured, call them
    if (process.env.STABILITY_API_KEY) {
      try {
        const imageUrl = await this.generateWithStability(prompt, negativePrompt, '1:1');
        return { imageUrl, prompt };
      } catch (err) {
        console.warn('[ImageProvider] Stability AI failed, falling back:', err.message);
      }
    }

    if (process.env.OPENAI_API_KEY) {
      try {
        const imageUrl = await this.generateWithDallE(prompt);
        return { imageUrl, prompt };
      } catch (err) {
        console.warn('[ImageProvider] DALL-E failed, falling back:', err.message);
      }
    }

    // Direct Photorealistic Pollinations / Flux generator URL (Free & high quality live-action)
    const encodedPrompt = encodeURIComponent(`${prompt} --no ${negativePrompt}`);
    const seed = Math.floor(Math.random() * 1000000);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&seed=${seed}&nologo=true&enhance=true&model=flux`;

    return { imageUrl, prompt };
  }

  /**
   * Generate a realistic cinematic scene image using character consistency reference data.
   * @param {Object} params - { scene, characters, visualStyle, aspectRatio }
   * @returns {Promise<{ imageUrl: string, prompt: string, negativePrompt: string }>}
   */
  async generateSceneImage({ scene, characters = [], visualStyle = 'Photorealistic', aspectRatio = '16:9' }) {
    const { prompt, negativePrompt, referenceImages } = characterConsistencyEngine.buildConsistentScenePrompt(
      scene,
      characters,
      visualStyle
    );

    let width = 1280;
    let height = 720;
    if (aspectRatio === '2.39:1' || aspectRatio === 'cinematic') {
      width = 1344;
      height = 576;
    } else if (aspectRatio === '9:16') {
      width = 720;
      height = 1280;
    }

    if (process.env.STABILITY_API_KEY) {
      try {
        const imageUrl = await this.generateWithStability(prompt, negativePrompt, aspectRatio);
        return { imageUrl, prompt, negativePrompt, referenceImages };
      } catch (err) {
        console.warn('[ImageProvider] Stability AI failed, falling back:', err.message);
      }
    }

    if (process.env.OPENAI_API_KEY) {
      try {
        const imageUrl = await this.generateWithDallE(prompt);
        return { imageUrl, prompt, negativePrompt, referenceImages };
      } catch (err) {
        console.warn('[ImageProvider] DALL-E failed, falling back:', err.message);
      }
    }

    // High quality live action cinematic generation via Pollinations / Flux
    const seed = Math.floor(Math.random() * 1000000);
    const encodedPrompt = encodeURIComponent(`${prompt} --no ${negativePrompt}`);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true&enhance=true&model=flux`;

    return {
      imageUrl,
      prompt,
      negativePrompt,
      referenceImages,
    };
  }

  async generateWithStability(prompt, negativePrompt, aspectRatio = '16:9') {
    const response = await axios.post(
      'https://api.stability.ai/v2beta/stable-image/generate/core',
      {
        prompt: prompt,
        negative_prompt: negativePrompt,
        aspect_ratio: aspectRatio === '16:9' ? '16:9' : '1:1',
        output_format: 'webp',
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.STABILITY_API_KEY}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        timeout: 45000,
      }
    );

    if (response.data && response.data.image) {
      return `data:image/webp;base64,${response.data.image}`;
    }
    throw new Error('Stability did not return image data');
  }

  async generateWithDallE(prompt) {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations',
      {
        model: 'dall-e-3',
        prompt: `Live-action photographic film still: ${prompt.slice(0, 950)}`,
        n: 1,
        size: '1792x1024',
        quality: 'hd',
        style: 'natural',
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 45000,
      }
    );

    return response.data.data[0].url;
  }
}

module.exports = new ImageProvider();
