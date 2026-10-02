const express = require('express');
const router = express.Router();
const {
  getCharacterById,
  updateCharacter,
  deleteCharacter,
} = require('../controllers/characterController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/:id')
  .get(getCharacterById)
  .put(updateCharacter)
  .delete(deleteCharacter);

module.exports = router;
