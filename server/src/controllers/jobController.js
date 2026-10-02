const jobQueueService = require('../services/jobQueueService');
const GenerationJob = require('../models/GenerationJob');
const { memStore, isMongoActive } = require('../utils/store');

// @desc    Get job status by ID
// @route   GET /api/jobs/:id
// @access  Private
const getJobById = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await jobQueueService.getJob(id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    return res.json({ success: true, data: job });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all jobs for current user / project
// @route   GET /api/jobs
// @access  Private
const getJobs = async (req, res) => {
  try {
    const userId = req.user._id;
    const { projectId } = req.query;

    let jobs;
    if (isMongoActive()) {
      const filter = { userId };
      if (projectId) filter.projectId = projectId;
      jobs = await GenerationJob.find(filter).sort({ createdAt: -1 }).limit(50);
    } else {
      jobs = memStore.jobs
        .filter(j => j.userId.toString() === userId.toString() && (!projectId || j.projectId?.toString() === projectId.toString()))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return res.json({ success: true, data: jobs });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getJobById,
  getJobs,
};
