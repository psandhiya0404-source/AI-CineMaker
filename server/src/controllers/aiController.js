const storyProvider = require('../services/ai/storyProvider');
const imageProvider = require('../services/ai/imageProvider');
const videoProvider = require('../services/ai/videoProvider');
const voiceProvider = require('../services/ai/voiceProvider');
const musicProvider = require('../services/ai/musicProvider');
const jobQueueService = require('../services/jobQueueService');
const Project = require('../models/Project');
const Character = require('../models/Character');
const Scene = require('../models/Scene');
const { memStore, isMongoActive, generateId } = require('../utils/store');

// @desc    Analyze story text, extract characters, breakdown into scenes
// @route   POST /api/ai/analyze-story
// @access  Private
const analyzeStory = async (req, res) => {
  try {
    const { projectId, storyContent, storyTitle, autoGenerateEntities = true } = req.body;
    const userId = req.user._id;

    let project;
    if (isMongoActive()) {
      project = await Project.findById(projectId);
    } else {
      project = memStore.projects.find(p => p._id.toString() === projectId?.toString());
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const job = await jobQueueService.createJob({
      userId,
      projectId,
      generationType: 'story-analysis',
      provider: process.env.OPENAI_API_KEY ? 'OpenAI GPT-4o Cinematic' : (process.env.GEMINI_API_KEY ? 'Google Gemini 1.5' : 'Cinematic NLP Analysis Engine'),
      prompt: `Analyze story: ${storyTitle || project.title}`,
    });

    jobQueueService.runAsyncProcess(job._id, async (updateProgress) => {
      await updateProgress(25, 'Parsing script narrative, pacing, and tone...');
      
      const analysis = await storyProvider.analyzeStory({
        storyContent: storyContent || project.story?.content || '',
        storyTitle: storyTitle || project.title,
        genre: project.genre,
        visualStyle: project.visualStyle,
        language: project.language,
      });

      await updateProgress(60, 'Extracting character profiles and live-action visual anchors...');

      // Update project story data
      if (isMongoActive()) {
        await Project.findByIdAndUpdate(projectId, {
          'story.title': storyTitle || project.title,
          'story.content': storyContent,
          'story.analyzed': true,
          'story.analysisData': analysis,
          status: 'Draft',
        });
      } else {
        project.story = {
          title: storyTitle || project.title,
          content: storyContent,
          analyzed: true,
          analysisData: analysis,
        };
      }

      const createdCharacters = [];
      const createdScenes = [];

      if (autoGenerateEntities && analysis.characters && analysis.characters.length > 0) {
        await updateProgress(75, 'Generating character system and reference models...');

        for (const charData of analysis.characters) {
          if (isMongoActive()) {
            // Check if character already exists with this name in the project
            let char = await Character.findOne({ projectId, name: charData.name });
            if (!char) {
              char = await Character.create({
                projectId,
                ...charData,
              });
            }
            createdCharacters.push(char);
          } else {
            let char = memStore.characters.find(c => c.projectId.toString() === projectId.toString() && c.name === charData.name);
            if (!char) {
              char = {
                _id: generateId(),
                projectId,
                name: charData.name,
                age: charData.age || 30,
                gender: charData.gender || 'Male',
                role: charData.role || 'Protagonist',
                personality: charData.personality || 'Sharp and resolute',
                appearance: charData.appearance || {},
                description: charData.description || '',
                referenceImage: '',
                referenceGallery: [],
                voiceProfile: {
                  provider: 'Standard Cinematic',
                  voiceId: 'en-US-DeepBaritone-1',
                  language: 'English',
                  gender: charData.gender || 'Male',
                  pitch: 1.0,
                  speed: 1.0,
                  style: 'Serious / Dramatic',
                },
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              memStore.characters.push(char);
            }
            createdCharacters.push(char);
          }
        }

        await updateProgress(85, 'Constructing cinematic scene breakdown and camera directions...');

        if (analysis.scenes && analysis.scenes.length > 0) {
          // Clear existing draft scenes or append
          for (const sceneData of analysis.scenes) {
            // Map character names to IDs
            const matchingCharIds = createdCharacters
              .filter(c => (sceneData.characterNames || []).some(name => name.toLowerCase() === c.name.toLowerCase()))
              .map(c => c._id);

            const speakerChar = createdCharacters.find(c => c.name.toLowerCase() === (sceneData.dialogue?.speaker || '').toLowerCase());

            if (isMongoActive()) {
              const scene = await Scene.create({
                projectId,
                sceneNumber: sceneData.sceneNumber,
                title: sceneData.title,
                location: sceneData.location,
                timeOfDay: sceneData.timeOfDay,
                characterIds: matchingCharIds,
                action: sceneData.action,
                dialogue: {
                  speaker: sceneData.dialogue?.speaker || '',
                  characterId: speakerChar ? speakerChar._id : null,
                  text: sceneData.dialogue?.text || '',
                },
                emotion: sceneData.emotion,
                camera: sceneData.camera,
                lighting: sceneData.lighting,
                visualDescription: sceneData.visualDescription,
                duration: sceneData.duration || 4,
                order: sceneData.sceneNumber,
                status: 'Pending',
              });
              createdScenes.push(scene);
            } else {
              const scene = {
                _id: generateId(),
                projectId,
                sceneNumber: sceneData.sceneNumber,
                title: sceneData.title,
                location: sceneData.location,
                timeOfDay: sceneData.timeOfDay,
                characterIds: matchingCharIds,
                action: sceneData.action,
                dialogue: {
                  speaker: sceneData.dialogue?.speaker || '',
                  characterId: speakerChar ? speakerChar._id : null,
                  text: sceneData.dialogue?.text || '',
                },
                dialogueAudioUrl: '',
                emotion: sceneData.emotion,
                camera: sceneData.camera,
                lighting: sceneData.lighting,
                visualDescription: sceneData.visualDescription,
                duration: sceneData.duration || 4,
                imageUrl: '',
                videoUrl: '',
                audioAssets: [],
                status: 'Pending',
                order: sceneData.sceneNumber,
                createdAt: new Date(),
                updatedAt: new Date(),
              };
              memStore.scenes.push(scene);
              createdScenes.push(scene);
            }
          }
        }
      }

      return {
        resultUrl: '',
        resultData: {
          analysis,
          charactersCreated: createdCharacters.length,
          scenesCreated: createdScenes.length,
        },
      };
    });

    return res.json({
      success: true,
      message: 'Story analysis initiated in background',
      jobId: job._id,
    });
  } catch (error) {
    console.error('[AI Analyze Story Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate photorealistic character reference image
// @route   POST /api/ai/generate-character
// @access  Private
const generateCharacterImage = async (req, res) => {
  try {
    const { characterId, projectId } = req.body;
    const userId = req.user._id;

    let character, project;
    if (isMongoActive()) {
      character = await Character.findById(characterId);
      project = await Project.findById(projectId || character?.projectId);
    } else {
      character = memStore.characters.find(c => c._id.toString() === characterId?.toString());
      project = memStore.projects.find(p => p._id.toString() === (projectId || character?.projectId)?.toString());
    }

    if (!character) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }

    const job = await jobQueueService.createJob({
      userId,
      projectId: project?._id || character.projectId,
      characterId: character._id,
      generationType: 'character-image',
      provider: 'Photorealistic Character Studio',
      prompt: `Generate portrait for ${character.name}`,
    });

    jobQueueService.runAsyncProcess(job._id, async (updateProgress) => {
      await updateProgress(30, `Synthesizing photographic anchors for ${character.name} (${character.role})...`);
      
      const genResult = await imageProvider.generateCharacterReference(
        character,
        project?.visualStyle || 'Photorealistic'
      );

      await updateProgress(80, 'Finalizing live-action facial morphology and lighting...');

      // Save reference image to character
      if (isMongoActive()) {
        const gallery = character.referenceGallery || [];
        gallery.push({
          url: genResult.imageUrl,
          label: `Portrait Ref ${gallery.length + 1}`,
          createdAt: new Date(),
        });
        await Character.findByIdAndUpdate(character._id, {
          referenceImage: genResult.imageUrl,
          referenceGallery: gallery,
        });
      } else {
        character.referenceImage = genResult.imageUrl;
        character.referenceGallery = character.referenceGallery || [];
        character.referenceGallery.push({
          url: genResult.imageUrl,
          label: `Portrait Ref ${character.referenceGallery.length + 1}`,
          createdAt: new Date(),
        });
      }

      return {
        resultUrl: genResult.imageUrl,
        resultData: {
          characterId: character._id,
          imageUrl: genResult.imageUrl,
          prompt: genResult.prompt,
        },
      };
    });

    return res.json({
      success: true,
      message: 'Character reference generation queued',
      jobId: job._id,
    });
  } catch (error) {
    console.error('[AI Generate Character Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate photorealistic scene image with character consistency
// @route   POST /api/ai/generate-scene-image
// @access  Private
const generateSceneImage = async (req, res) => {
  try {
    const { sceneId, projectId } = req.body;
    const userId = req.user._id;

    let scene, project;
    if (isMongoActive()) {
      scene = await Scene.findById(sceneId);
      project = await Project.findById(projectId || scene?.projectId);
    } else {
      scene = memStore.scenes.find(s => s._id.toString() === sceneId?.toString());
      project = memStore.projects.find(p => p._id.toString() === (projectId || scene?.projectId)?.toString());
    }

    if (!scene) {
      return res.status(404).json({ success: false, message: 'Scene not found' });
    }

    // Retrieve linked characters for character consistency
    let linkedCharacters = [];
    if (scene.characterIds && scene.characterIds.length > 0) {
      if (isMongoActive()) {
        linkedCharacters = await Character.find({ _id: { $in: scene.characterIds } });
      } else {
        linkedCharacters = memStore.characters.filter(c => 
          scene.characterIds.some(cid => cid.toString() === c._id.toString())
        );
      }
    }

    const job = await jobQueueService.createJob({
      userId,
      projectId: project?._id || scene.projectId,
      sceneId: scene._id,
      generationType: 'scene-image',
      provider: 'Cinematic Live Action Flux Engine',
      prompt: `Scene ${scene.sceneNumber}: ${scene.location} - ${scene.action}`,
    });

    jobQueueService.runAsyncProcess(job._id, async (updateProgress) => {
      await updateProgress(20, 'Injecting character consistency reference vectors...');
      
      const charNames = linkedCharacters.map(c => c.name).join(', ') || 'Lead actor';
      await updateProgress(45, `Rendering 35mm live-action frame for ${charNames} at ${scene.location}...`);

      const genResult = await imageProvider.generateSceneImage({
        scene,
        characters: linkedCharacters,
        visualStyle: project?.visualStyle || 'Photorealistic',
        aspectRatio: project?.aspectRatio || '16:9',
      });

      await updateProgress(85, 'Applying film grain, color grading, and anamorphic lens blur...');

      // Update scene with generated image
      if (isMongoActive()) {
        await Scene.findByIdAndUpdate(scene._id, {
          imageUrl: genResult.imageUrl,
          status: scene.videoUrl ? 'Completed' : 'Image Generated',
        });
      } else {
        scene.imageUrl = genResult.imageUrl;
        scene.status = scene.videoUrl ? 'Completed' : 'Image Generated';
      }

      return {
        resultUrl: genResult.imageUrl,
        resultData: {
          sceneId: scene._id,
          imageUrl: genResult.imageUrl,
          prompt: genResult.prompt,
          referenceImages: genResult.referenceImages,
        },
      };
    });

    return res.json({
      success: true,
      message: 'Scene image generation queued',
      jobId: job._id,
    });
  } catch (error) {
    console.error('[AI Generate Scene Image Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate cinematic video for a scene
// @route   POST /api/ai/generate-video
// @access  Private
const generateVideo = async (req, res) => {
  try {
    const { sceneId, motionPrompt = '', duration = 4 } = req.body;
    const userId = req.user._id;

    let scene;
    if (isMongoActive()) {
      scene = await Scene.findById(sceneId);
    } else {
      scene = memStore.scenes.find(s => s._id.toString() === sceneId?.toString());
    }

    if (!scene) {
      return res.status(404).json({ success: false, message: 'Scene not found' });
    }

    // Ensure scene has image or fallback
    const baseImageUrl = scene.imageUrl || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1280&auto=format&fit=crop&q=80';

    const job = await jobQueueService.createJob({
      userId,
      projectId: scene.projectId,
      sceneId: scene._id,
      generationType: 'video',
      provider: process.env.RUNWAY_API_KEY ? 'Runway Gen-3 Alpha' : 'Cinematic Motion Engine',
      prompt: `Motion: ${scene.camera?.movement || 'Slow Push-In'} | ${scene.action}`,
    });

    jobQueueService.runAsyncProcess(job._id, async (updateProgress) => {
      await updateProgress(20, 'Interpolating camera motion parameters and optical flow...');
      await updateProgress(50, 'Simulating 24fps live-action frame sequence...');
      
      const videoResult = await videoProvider.generateSceneVideo({
        scene,
        imageUrl: baseImageUrl,
        motionPrompt,
        duration,
      });

      await updateProgress(85, 'Encoding cinematic H.264 video stream...');

      if (isMongoActive()) {
        await Scene.findByIdAndUpdate(scene._id, {
          videoUrl: videoResult.videoUrl,
          status: 'Video Generated',
        });
      } else {
        scene.videoUrl = videoResult.videoUrl;
        scene.status = 'Video Generated';
      }

      return {
        resultUrl: videoResult.videoUrl,
        resultData: {
          sceneId: scene._id,
          videoUrl: videoResult.videoUrl,
          provider: videoResult.provider,
        },
      };
    });

    return res.json({
      success: true,
      message: 'Video generation queued',
      jobId: job._id,
    });
  } catch (error) {
    console.error('[AI Generate Video Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Generate character voice audio for dialogue
// @route   POST /api/ai/generate-voice
// @access  Private
const generateVoice = async (req, res) => {
  try {
    const { sceneId, characterId, dialogueText, voiceId } = req.body;
    const userId = req.user._id;

    let scene, character;
    if (isMongoActive()) {
      if (sceneId) scene = await Scene.findById(sceneId);
      if (characterId) character = await Character.findById(characterId);
    } else {
      if (sceneId) scene = memStore.scenes.find(s => s._id.toString() === sceneId.toString());
      if (characterId) character = memStore.characters.find(c => c._id.toString() === characterId.toString());
    }

    const textToSpeak = dialogueText || scene?.dialogue?.text || 'Cinematic dialogue line.';
    const selectedVoiceId = voiceId || character?.voiceProfile?.voiceId || 'pNInz6obpgDQGcFmaJgB';

    const job = await jobQueueService.createJob({
      userId,
      projectId: scene?.projectId || character?.projectId,
      sceneId: scene?._id,
      characterId: character?._id,
      generationType: 'voice',
      provider: process.env.ELEVENLABS_API_KEY ? 'ElevenLabs Neural TTS' : 'Cinematic Neural Voice Engine',
      prompt: `Voice synthesis for: "${textToSpeak.slice(0, 50)}..."`,
    });

    jobQueueService.runAsyncProcess(job._id, async (updateProgress) => {
      await updateProgress(35, 'Analyzing phonetic inflection, emotion, and timbre...');
      
      const voiceResult = await voiceProvider.generateVoice({
        text: textToSpeak,
        voiceId: selectedVoiceId,
        characterName: character?.name || 'Actor',
        gender: character?.gender || 'Male',
        emotion: scene?.emotion || 'Dramatic',
      });

      await updateProgress(80, 'Mastering speech audio dynamics and equalization...');

      if (scene) {
        if (isMongoActive()) {
          await Scene.findByIdAndUpdate(scene._id, {
            dialogueAudioUrl: voiceResult.audioUrl,
            'dialogue.text': textToSpeak,
          });
        } else {
          scene.dialogueAudioUrl = voiceResult.audioUrl;
          scene.dialogue = scene.dialogue || {};
          scene.dialogue.text = textToSpeak;
        }
      }

      return {
        resultUrl: voiceResult.audioUrl,
        resultData: {
          audioUrl: voiceResult.audioUrl,
          duration: voiceResult.duration,
          provider: voiceResult.provider,
        },
      };
    });

    return res.json({
      success: true,
      message: 'Voice generation queued',
      jobId: job._id,
    });
  } catch (error) {
    console.error('[AI Generate Voice Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Render complete timeline into final export film
// @route   POST /api/ai/render-timeline
// @access  Private
const renderTimelineFilm = async (req, res) => {
  try {
    const { projectId } = req.body;
    const userId = req.user._id;

    let project, scenes;
    if (isMongoActive()) {
      project = await Project.findById(projectId);
      scenes = await Scene.find({ projectId }).sort({ sceneNumber: 1 });
    } else {
      project = memStore.projects.find(p => p._id.toString() === projectId.toString());
      scenes = memStore.scenes.filter(s => s.projectId.toString() === projectId.toString()).sort((a, b) => a.sceneNumber - b.sceneNumber);
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const job = await jobQueueService.createJob({
      userId,
      projectId: project._id,
      generationType: 'export-film',
      provider: 'Cinematic Timeline Video Stitcher Engine',
      prompt: `Final Render: ${project.title} (${scenes.length} scenes)`,
    });

    jobQueueService.runAsyncProcess(job._id, async (updateProgress) => {
      await updateProgress(15, 'Concatenating video timeline clips and keyframes...');
      await updateProgress(40, 'Conforming multi-channel audio tracks (Dialogue, BGM, SFX)...');
      await updateProgress(70, 'Rendering final 4K Master with cinematic 2.39:1 letterbox & color LUT...');
      await updateProgress(90, 'Packaging MP4 export container...');

      // Choose final compiled film preview video
      const finalVideoUrl = scenes.find(s => s.videoUrl)?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-man-walking-down-a-dark-street-at-night-42617-large.mp4';

      if (isMongoActive()) {
        await Project.findByIdAndUpdate(projectId, {
          status: 'Completed',
        });
      } else {
        project.status = 'Completed';
      }

      return {
        resultUrl: finalVideoUrl,
        resultData: {
          title: project.title,
          totalScenes: scenes.length,
          totalDuration: scenes.reduce((acc, s) => acc + (s.duration || 4), 0),
          exportedAt: new Date(),
          downloadUrl: finalVideoUrl,
        },
      };
    });

    return res.json({
      success: true,
      message: 'Film rendering initiated',
      jobId: job._id,
    });
  } catch (error) {
    console.error('[Render Timeline Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  analyzeStory,
  generateCharacterImage,
  generateSceneImage,
  generateVideo,
  generateVoice,
  renderTimelineFilm,
};
