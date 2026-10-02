const musicProvider = require('../services/ai/musicProvider');
const AudioAsset = require('../models/AudioAsset');
const Scene = require('../models/Scene');
const { memStore, isMongoActive, generateId } = require('../utils/store');

// @desc    Get cinematic audio library (BGM, SFX, Ambient)
// @route   GET /api/audio/library
// @access  Private
const getAudioLibrary = async (req, res) => {
  try {
    const library = musicProvider.getCinematicLibrary();
    return res.json({ success: true, data: library });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Attach audio to a scene
// @route   POST /api/audio/attach
// @access  Private
const attachAudioToScene = async (req, res) => {
  try {
    const { sceneId, audioData } = req.body;

    if (!sceneId || !audioData) {
      return res.status(400).json({ success: false, message: 'Scene ID and audio data are required' });
    }

    if (isMongoActive()) {
      const scene = await Scene.findById(sceneId);
      if (!scene) return res.status(404).json({ success: false, message: 'Scene not found' });

      const currentAssets = scene.audioAssets || [];
      currentAssets.push(audioData);

      const updatedScene = await Scene.findByIdAndUpdate(
        sceneId,
        { audioAssets: currentAssets },
        { new: true }
      );
      return res.json({ success: true, data: updatedScene });
    } else {
      const scene = memStore.scenes.find(s => s._id.toString() === sceneId.toString());
      if (!scene) return res.status(404).json({ success: false, message: 'Scene not found' });

      scene.audioAssets = scene.audioAssets || [];
      scene.audioAssets.push(audioData);

      return res.json({ success: true, data: scene });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAudioLibrary,
  attachAudioToScene,
};
