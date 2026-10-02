const express = require('express');
const router = express.Router();
const {
  analyzeStory,
  generateCharacterImage,
  generateSceneImage,
  generateVideo,
  generateVoice,
  renderTimelineFilm,
} = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/analyze-story', analyzeStory);
router.post('/generate-character', generateCharacterImage);
router.post('/generate-scene-image', generateSceneImage);
router.post('/generate-video', generateVideo);
router.post('/generate-voice', generateVoice);
router.post('/render-timeline', renderTimelineFilm);

module.exports = router;
