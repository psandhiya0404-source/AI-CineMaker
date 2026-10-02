const express = require('express');
const router = express.Router();
const { getJobById, getJobs } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/', getJobs);
router.get('/:id', getJobById);

module.exports = router;
