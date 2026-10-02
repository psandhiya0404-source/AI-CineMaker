const GenerationJob = require('../models/GenerationJob');
const { memStore, isMongoActive, generateId } = require('../utils/store');

class JobQueueService {
  /**
   * Create and register a new generation job.
   */
  async createJob({ userId, projectId, sceneId = null, characterId = null, generationType, provider = 'Cinematic AI', prompt = '' }) {
    let job;
    if (isMongoActive()) {
      job = await GenerationJob.create({
        userId,
        projectId,
        sceneId,
        characterId,
        generationType,
        provider,
        prompt,
        status: 'queued',
        progress: 5,
        statusMessage: 'Task queued in cinematic pipeline...',
      });
    } else {
      job = {
        _id: generateId(),
        userId,
        projectId,
        sceneId,
        characterId,
        generationType,
        provider,
        prompt,
        status: 'queued',
        progress: 5,
        statusMessage: 'Task queued in cinematic pipeline...',
        resultUrl: '',
        resultData: null,
        error: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      memStore.jobs.push(job);
    }
    return job;
  }

  /**
   * Update job progress status
   */
  async updateProgress(jobId, { progress, status = 'processing', statusMessage = '', resultUrl = '', resultData = null, error = null }) {
    if (isMongoActive()) {
      return await GenerationJob.findByIdAndUpdate(
        jobId,
        {
          progress,
          status,
          statusMessage,
          resultUrl,
          resultData,
          error,
          completedAt: status === 'completed' || status === 'failed' ? new Date() : null,
        },
        { new: true }
      );
    } else {
      const job = memStore.jobs.find(j => j._id.toString() === jobId.toString());
      if (job) {
        if (progress !== undefined) job.progress = progress;
        if (status) job.status = status;
        if (statusMessage) job.statusMessage = statusMessage;
        if (resultUrl) job.resultUrl = resultUrl;
        if (resultData !== null) job.resultData = resultData;
        if (error !== null) job.error = error;
        if (status === 'completed' || status === 'failed') job.completedAt = new Date();
        job.updatedAt = new Date();
        return job;
      }
      return null;
    }
  }

  /**
   * Get job by ID
   */
  async getJob(jobId) {
    if (isMongoActive()) {
      return await GenerationJob.findById(jobId);
    }
    return memStore.jobs.find(j => j._id.toString() === jobId.toString()) || null;
  }

  /**
   * Run an asynchronous worker with progressive status milestones
   */
  runAsyncProcess(jobId, processFn) {
    // Fire and run asynchronously
    (async () => {
      try {
        await this.updateProgress(jobId, { progress: 20, status: 'processing', statusMessage: 'Loading character models and visual anchors...' });
        
        // Execute the processing function
        const result = await processFn(async (pct, msg) => {
          await this.updateProgress(jobId, { progress: pct, status: 'processing', statusMessage: msg });
        });

        await this.updateProgress(jobId, {
          progress: 100,
          status: 'completed',
          statusMessage: 'Generation completed successfully!',
          resultUrl: result.resultUrl || '',
          resultData: result.resultData || result,
        });
      } catch (err) {
        console.error(`[JobQueue] Job ${jobId} failed:`, err);
        await this.updateProgress(jobId, {
          progress: 100,
          status: 'failed',
          statusMessage: `Generation failed: ${err.message}`,
          error: err.message,
        });
      }
    })();
  }
}

module.exports = new JobQueueService();
