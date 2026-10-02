const express = require('express');
const router = express.Router();
const { getAudioLibrary, attachAudioToScene } = require('../controllers/audioController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/library', getAudioLibrary);
router.post('/attach', attachAudioToScene);

module.exports = router;
