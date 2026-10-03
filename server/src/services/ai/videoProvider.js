const axios = require('axios');

class VideoProvider {

  async generateSceneVideo({
    scene,
    imageUrl,
    characterReferences = [],
    motionPrompt = '',
    duration = 5
  }) {

    const cameraMotion = scene.camera?.movement || 'Slow Push-In';
    const actionDesc =
      scene.action || 'Characters in a realistic cinematic live-action scene';

    const compiledMotionPrompt =
      `Cinematic live-action scene. ${actionDesc}. ` +
      `Camera movement: ${cameraMotion}. ` +
      `Natural realistic motion, photorealistic, dramatic cinematic lighting. ` +
      `${motionPrompt}`;

    // REAL AI VIDEO GENERATION
    if (process.env.RUNWAY_API_KEY) {
      try {
        return await this.generateWithRunway({
          imageUrl,
          motionPrompt: compiledMotionPrompt,
          duration
        });
      } catch (err) {
        console.error(
          '[VideoProvider] Runway failed:',
          err.response?.data || err.message
        );

        throw new Error(
          'AI video generation failed. Please check RUNWAY_API_KEY.'
        );
      }
    }

    throw new Error(
      'RUNWAY_API_KEY is not configured. Add it in Render Environment Variables.'
    );
  }

  async generateWithRunway({
    imageUrl,
    motionPrompt,
    duration = 5
  }) {

    const response = await axios.post(
      'https://api.dev.runwayml.com/v1/image_to_video',
      {
        model: 'gen4.5',
        promptImage: imageUrl,
        promptText: motionPrompt,
        ratio: '1280:720',
        duration: duration
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
          'X-Runway-Version': '2024-11-06',
          'Content-Type': 'application/json'
        },
        timeout: 120000
      }
    );

    const taskId = response.data.id;

    if (!taskId) {
      throw new Error('Runway did not return a task ID');
    }

    // Wait for generated video
    for (let i = 0; i < 60; i++) {

      await new Promise(resolve => setTimeout(resolve, 5000));

      const statusResponse = await axios.get(
        `https://api.dev.runwayml.com/v1/tasks/${taskId}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.RUNWAY_API_KEY}`,
            'X-Runway-Version': '2024-11-06'
          }
        }
      );

      const task = statusResponse.data;

      console.log(
        `[Runway] ${task.status} - ${i + 1}/60`
      );

      if (task.status === 'SUCCEEDED') {

        const videoUrl =
          task.output?.[0] ||
          task.output?.video ||
          '';

        if (!videoUrl) {
          throw new Error('Runway completed but returned no video URL');
        }

        return {
          videoUrl,
          provider: 'Runway Gen-4.5',
          duration
        };
      }

      if (
        task.status === 'FAILED' ||
        task.status === 'CANCELED'
      ) {
        throw new Error(
          `Runway task ${task.status}: ${
            task.failure || 'Unknown error'
          }`
        );
      }
    }

    throw new Error('Runway video generation timed out');
  }
}

module.exports = new VideoProvider();
