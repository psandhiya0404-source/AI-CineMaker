const express = require('express');
const router = express.Router();
const {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { getCharactersByProject, createCharacter } = require('../controllers/characterController');
const { getScenesByProject, createScene, reorderScenes } = require('../controllers/sceneController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getProjects)
  .post(createProject);

router.route('/:id')
  .get(getProjectById)
  .put(updateProject)
  .delete(deleteProject);

// Nested routes for project characters & scenes
router.route('/:projectId/characters')
  .get(getCharactersByProject)
  .post(createCharacter);

router.route('/:projectId/scenes')
  .get(getScenesByProject)
  .post(createScene);

router.route('/:projectId/scenes/reorder')
  .post(reorderScenes);

module.exports = router;
