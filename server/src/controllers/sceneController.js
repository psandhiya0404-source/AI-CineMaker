const Scene = require('../models/Scene');
const { memStore, isMongoActive, generateId } = require('../utils/store');

// @desc    Get all scenes for a project
// @route   GET /api/projects/:projectId/scenes
// @access  Private
const getScenesByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    let scenes;

    if (isMongoActive()) {
      scenes = await Scene.find({ projectId }).sort({ sceneNumber: 1 });
    } else {
      scenes = memStore.scenes
        .filter(s => s.projectId.toString() === projectId.toString())
        .sort((a, b) => a.sceneNumber - b.sceneNumber);
    }

    return res.json({ success: true, data: scenes });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new scene
// @route   POST /api/projects/:projectId/scenes
// @access  Private
const createScene = async (req, res) => {
  try {
    const { projectId } = req.params;
    const sceneData = req.body;

    let sceneCount = 0;
    if (isMongoActive()) {
      sceneCount = await Scene.countDocuments({ projectId });
    } else {
      sceneCount = memStore.scenes.filter(s => s.projectId.toString() === projectId.toString()).length;
    }

    const sceneNumber = sceneData.sceneNumber || (sceneCount + 1);

    if (isMongoActive()) {
      const scene = await Scene.create({
        ...sceneData,
        projectId,
        sceneNumber,
      });
      return res.status(201).json({ success: true, data: scene });
    } else {
      const newScene = {
        _id: generateId(),
        projectId,
        sceneNumber,
        title: sceneData.title || `Scene ${sceneNumber < 10 ? '0' + sceneNumber : sceneNumber}`,
        location: sceneData.location || 'Interior Detective Office',
        timeOfDay: sceneData.timeOfDay || 'Night',
        characterIds: sceneData.characterIds || [],
        action: sceneData.action || 'A tense cinematic moment begins.',
        dialogue: sceneData.dialogue || { speaker: '', text: '' },
        dialogueAudioUrl: sceneData.dialogueAudioUrl || '',
        emotion: sceneData.emotion || 'Suspenseful',
        camera: sceneData.camera || {
          shot: 'Medium Close-Up',
          movement: 'Slow Push-In',
          angle: 'Eye Level',
          lens: '50mm Anamorphic',
        },
        lighting: sceneData.lighting || 'Atmospheric moody lighting',
        visualDescription: sceneData.visualDescription || '',
        duration: sceneData.duration || 4,
        imageUrl: sceneData.imageUrl || '',
        videoUrl: sceneData.videoUrl || '',
        audioAssets: sceneData.audioAssets || [],
        status: sceneData.status || 'Pending',
        order: sceneData.order !== undefined ? sceneData.order : sceneNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memStore.scenes.push(newScene);
      return res.status(201).json({ success: true, data: newScene });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get scene by ID
// @route   GET /api/scenes/:id
// @access  Private
const getSceneById = async (req, res) => {
  try {
    const { id } = req.params;
    let scene;

    if (isMongoActive()) {
      scene = await Scene.findById(id);
    } else {
      scene = memStore.scenes.find(s => s._id.toString() === id.toString());
    }

    if (!scene) {
      return res.status(404).json({ success: false, message: 'Scene not found' });
    }

    return res.json({ success: true, data: scene });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update scene
// @route   PUT /api/scenes/:id
// @access  Private
const updateScene = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoActive()) {
      const scene = await Scene.findByIdAndUpdate(id, updates, { new: true });
      if (!scene) return res.status(404).json({ success: false, message: 'Scene not found' });
      return res.json({ success: true, data: scene });
    } else {
      const index = memStore.scenes.findIndex(s => s._id.toString() === id.toString());
      if (index === -1) return res.status(404).json({ success: false, message: 'Scene not found' });
      memStore.scenes[index] = {
        ...memStore.scenes[index],
        ...updates,
        updatedAt: new Date(),
      };
      return res.json({ success: true, data: memStore.scenes[index] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete scene
// @route   DELETE /api/scenes/:id
// @access  Private
const deleteScene = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoActive()) {
      await Scene.findByIdAndDelete(id);
    } else {
      memStore.scenes = memStore.scenes.filter(s => s._id.toString() !== id.toString());
    }

    return res.json({ success: true, message: 'Scene deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Reorder scenes in a project
// @route   POST /api/projects/:projectId/scenes/reorder
// @access  Private
const reorderScenes = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { sceneIds } = req.body; // Array of scene IDs in new order

    if (!Array.isArray(sceneIds)) {
      return res.status(400).json({ success: false, message: 'sceneIds array is required' });
    }

    if (isMongoActive()) {
      await Promise.all(
        sceneIds.map((id, index) =>
          Scene.findByIdAndUpdate(id, { sceneNumber: index + 1, order: index + 1 })
        )
      );
      const updated = await Scene.find({ projectId }).sort({ sceneNumber: 1 });
      return res.json({ success: true, data: updated });
    } else {
      sceneIds.forEach((id, index) => {
        const scene = memStore.scenes.find(s => s._id.toString() === id.toString());
        if (scene) {
          scene.sceneNumber = index + 1;
          scene.order = index + 1;
        }
      });
      const updated = memStore.scenes
        .filter(s => s.projectId.toString() === projectId.toString())
        .sort((a, b) => a.sceneNumber - b.sceneNumber);
      return res.json({ success: true, data: updated });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getScenesByProject,
  createScene,
  getSceneById,
  updateScene,
  deleteScene,
  reorderScenes,
};
