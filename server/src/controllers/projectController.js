const Project = require('../models/Project');
const Character = require('../models/Character');
const Scene = require('../models/Scene');
const { memStore, isMongoActive, generateId } = require('../utils/store');

// @desc    Get all projects for current user
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res) => {
  try {
    const userId = req.user._id;
    let projects;

    if (isMongoActive()) {
      projects = await Project.find({ userId }).sort({ updatedAt: -1 });
    } else {
      projects = memStore.projects
        .filter(p => p.userId.toString() === userId.toString())
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    // Enhance project stats (character count, scene count)
    const enhancedProjects = await Promise.all(
      projects.map(async (p) => {
        const pObj = p.toObject ? p.toObject() : { ...p };
        let charCount = 0;
        let sceneCount = 0;

        if (isMongoActive()) {
          charCount = await Character.countDocuments({ projectId: p._id });
          sceneCount = await Scene.countDocuments({ projectId: p._id });
        } else {
          charCount = memStore.characters.filter(c => c.projectId.toString() === p._id.toString()).length;
          sceneCount = memStore.scenes.filter(s => s.projectId.toString() === p._id.toString()).length;
        }

        return {
          ...pObj,
          characterCount: charCount,
          sceneCount: sceneCount,
        };
      })
    );

    return res.json({ success: true, data: enhancedProjects });
  } catch (error) {
    console.error('[Get Projects Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { title, genre, language, duration, visualStyle, description } = req.body;
    const userId = req.user._id;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Project title is required' });
    }

    const defaultThumbnailMap = {
      Thriller: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80',
      Mystery: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80',
      Romance: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=800&auto=format&fit=crop&q=80',
      Action: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80',
      Drama: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
      Horror: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800&auto=format&fit=crop&q=80',
      Crime: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&auto=format&fit=crop&q=80',
    };

    const thumbnail = defaultThumbnailMap[genre] || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80';

    if (isMongoActive()) {
      const project = await Project.create({
        userId,
        title,
        genre: genre || 'Thriller',
        language: language || 'English',
        duration: duration || '2-3 Minutes',
        visualStyle: visualStyle || 'Photorealistic',
        description: description || '',
        thumbnail,
        status: 'Draft',
      });

      return res.status(201).json({ success: true, data: project });
    } else {
      const newProject = {
        _id: generateId(),
        userId,
        title,
        genre: genre || 'Thriller',
        language: language || 'English',
        duration: duration || '2-3 Minutes',
        visualStyle: visualStyle || 'Photorealistic',
        description: description || '',
        story: { title: '', content: '', analyzed: false, analysisData: null },
        thumbnail,
        status: 'Draft',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memStore.projects.push(newProject);

      return res.status(201).json({ success: true, data: newProject });
    }
  } catch (error) {
    console.error('[Create Project Error]', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get project by ID
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    let project;

    if (isMongoActive()) {
      project = await Project.findById(id);
    } else {
      project = memStore.projects.find(p => p._id.toString() === id.toString());
    }

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    return res.json({ success: true, data: project });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (isMongoActive()) {
      const project = await Project.findByIdAndUpdate(id, updates, { new: true });
      if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
      return res.json({ success: true, data: project });
    } else {
      const index = memStore.projects.findIndex(p => p._id.toString() === id.toString());
      if (index === -1) return res.status(404).json({ success: false, message: 'Project not found' });
      memStore.projects[index] = {
        ...memStore.projects[index],
        ...updates,
        updatedAt: new Date(),
      };
      return res.json({ success: true, data: memStore.projects[index] });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete project and its associated data
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    if (isMongoActive()) {
      await Project.findByIdAndDelete(id);
      await Character.deleteMany({ projectId: id });
      await Scene.deleteMany({ projectId: id });
    } else {
      memStore.projects = memStore.projects.filter(p => p._id.toString() !== id.toString());
      memStore.characters = memStore.characters.filter(c => c.projectId.toString() !== id.toString());
      memStore.scenes = memStore.scenes.filter(s => s.projectId.toString() !== id.toString());
    }

    return res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
};
