const express = require('express');
const router = express.Router();
const {
  getSceneById,
  updateScene,
  deleteScene,
} = require('../controllers/sceneController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/:id')
  .get(getSceneById)
  .put(updateScene)
  .delete(deleteScene);

module.exports = router;
