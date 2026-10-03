const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const ffmpegPath = require('ffmpeg-static');
const { v4: uuidv4 } = require('uuid');

class VideoProvider {

  async generateSceneVideo({
    scene,
    imageUrl,
    characterReferences = [],
    motionPrompt = '',
    duration = 5
  }) {

    if (!imageUrl) {
      throw new Error('Scene image URL is missing');
    }

    const cameraMotion =
      scene.camera?.movement || 'Slow Push-In';

    const actionDesc =
      scene.action ||
      'Characters in a realistic cinematic scene';

    const compiledMotionPrompt =
      `Cinematic live-action scene. ${actionDesc}. ` +
      `Camera movement: ${cameraMotion}. ` +
      `Photorealistic cinematic motion. ${motionPrompt}`;

    console.log('[VideoProvider] Creating free cinematic MP4');
    console.log('[VideoProvider] Image:', imageUrl);

    return await this.generateFreeCinematicVideo({
      imageUrl,
      duration,
      motionPrompt: compiledMotionPrompt
    });
  }

  async generateFreeCinematicVideo({
    imageUrl,
    duration = 5
  }) {

    const uploadsDir = path.join(
      __dirname,
      '../../uploads/videos'
    );

    fs.mkdirSync(uploadsDir, { recursive: true });

    const id = uuidv4();

    const imagePath = path.join(
      uploadsDir,
      `${id}.jpg`
    );

    const videoPath = path.join(
      uploadsDir,
      `${id}.mp4`
    );

    // Download generated cinematic image
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 60000
    });

    fs.writeFileSync(
      imagePath,
      Buffer.from(response.data)
    );

    console.log('[VideoProvider] Image downloaded');

    // Create 24fps cinematic motion video
    await new Promise((resolve, reject) => {

      const frames = Math.max(
        1,
        Math.round(duration * 24)
      );

      const zoom =
        `zoompan=z='min(zoom+0.0008,1.12)':` +
        `x='iw/2-(iw/zoom/2)':` +
        `y='ih/2-(ih/zoom/2)':` +
        `d=${frames}:s=1280x720:fps=24`;

      const ffmpeg = spawn(ffmpegPath, [
        '-y',
        '-loop',
        '1',
        '-i',
        imagePath,
        '-vf',
        zoom,
        '-t',
        String(duration),
        '-r',
        '24',
        '-c:v',
        'libx264',
        '-pix_fmt',
        'yuv420p',
        '-movflags',
        '+faststart',
        videoPath
      ]);

      let stderr = '';

      ffmpeg.stderr.on('data', data => {
        stderr += data.toString();
      });

      ffmpeg.on('error', reject);

      ffmpeg.on('close', code => {
        if (code === 0) {
          resolve();
        } else {
          reject(
            new Error(
              `FFmpeg failed: ${stderr.slice(-1000)}`
            )
          );
        }
      });

    });

    // Remove temporary image
    try {
      fs.unlinkSync(imagePath);
    } catch (err) {
      console.warn(
        '[VideoProvider] Could not remove temp image'
      );
    }

    const baseUrl =
      process.env.PUBLIC_BASE_URL ||
      `http://localhost:${process.env.PORT || 5000}`;

    const videoUrl =
      `${baseUrl}/uploads/videos/${id}.mp4`;

    console.log(
      '[VideoProvider] Video created:',
      videoUrl
    );

    return {
      videoUrl,
      provider: 'Free Cinematic Motion Engine',
      duration,
      fps: 24
    };
  }
}

module.exports = new VideoProvider();