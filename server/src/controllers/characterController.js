const Character = require('../models/Character');
const { memStore, isMongoActive, generateId } = require('../utils/store');

// @desc    Get all characters for a project
// @route   GET /api/projects/:projectId/characters
// @access  Private
const getCharactersByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    let characters;

    if (isMongoActive()) {
      characters = await Character.find({ projectId }).sort({ createdAt: 1 });
    } else {
      characters = memStore.characters.filter(c => c.projectId.toString() === projectId.toString());
    }

    return res.json({ success: true, data: characters });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new character in a project
// @route   POST /api/projects/:projectId/characters
// @access  Private
const createCharacter = async (req, res) => {
  try {
    const { projectId } = req.params;
    const characterData = req.body;

    if (!characterData.name) {
      return res.status(400).json({ success: false, message: 'Character name is required' });
    }

    if (isMongoActive()) {
      const character = await Character.create({
        ...characterData,
        projectId,
      });
      return res.status(201).json({ success: true, data: character });
    } else {
      const newChar = {
        _id: generateId(),
        projectId,
        name: characterData.name,
        age: characterData.age || 30,
        gender: characterData.gender || 'Male',
        role: characterData.role || 'Protagonist',
        personality: characterData.personality || 'Determined and calm',
        appearance: {
          face: characterData.appearance?.face || 'Sharp jawline, focused eyes',
          hair: characterData.appearance?.hair || 'Dark textured hair',
          skinTone: characterData.appearance?.skinTone || 'Natural',
          bodyType: characterData.appearance?.bodyType || 'Athletic',
          clothing: characterData.appearance?.clothing || 'Cinematic costume',
          accessories: characterData.appearance?.accessories || 'None',
          identifyingFeatures: characterData.appearance?.identifyingFeatures || 'None',
        },
        description: characterData.description || '',
        referenceImage: characterData.referenceImage || '',
        referenceGallery: characterData.referenceGallery || [],
        voiceProfile: characterData.voiceProfile || {
          provider: 'Standard Cinematic',
          voiceId: 'en-US-DeepBaritone-1',
          language: 'English',
          gender: 'Male',
          pitch: 1.0,
          speed: 1.0,
          style: 'Serious / Dramatic',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memStore.characters.push(newChar);
      return res.status(201).json({ success: true, data: newChar });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get character by ID
// @route   GET /api/characters/:id
// @access  Private
const getCharacterById = async (req, res) => {
  try {
    const { id } = req.params;
    let character;

    if (isMongoActive()) {
      character = await Character.findById(id);
    } else {
      character = memStore.characters.find(c => c._id.toString() === id.toString());
    }

    if (!character) {
      return res.status(404).json({ success: false, message: 'Character not found' });
    }

    return res.json({ success: true, data: character });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update character
// @route   PUT /api/characters/:id
// @access  Private
const updateCharacter = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoActive()) {
      const character = await Character.findByIdAndUpdate(id, updates, { new: true });
      if (!character) return res.status(404).json({ success: false, message: 'Character not found' });
      return res.json({ success: true, data: character });
    } else {
      const index = memStore.characters.findIndex(c => c._id.toString() === id.toString());
      if (index === -1) return res.status(404).json({ success: false, message: 'Character not found' });

      // If reference image changed, also append to gallery
      const gallery = memStore.characters[index].referenceGallery || [];
      if (updates.referenceImage && updates.referenceImage !== memStore.characters[index].referenceImage) {
        gallery.push({
          url: updates.referenceImage,
          label: `Portrait Ref ${gallery.length + 1}`,
          createdAt: new Date(),
        });
      }

      memStore.characters[index] = {
        ...memStore.characters[index],
        ...updates,
        referenceGallery: gallery,
        updatedAt: new Date(),
      };
      return res.json({ success: true, data: memStore.characters[index] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete character
// @route   DELETE /api/characters/:id
// @access  Private
const deleteCharacter = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoActive()) {
      await Character.findByIdAndDelete(id);
    } else {
      memStore.characters = memStore.characters.filter(c => c._id.toString() !== id.toString());
    }

    return res.json({ success: true, message: 'Character deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getCharactersByProject,
  createCharacter,
  getCharacterById,
  updateCharacter,
  deleteCharacter,
};
