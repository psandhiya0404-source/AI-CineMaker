const mongoose = require('mongoose');

const generationJobSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    sceneId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scene',
      default: null,
    },
    characterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character',
      default: null,
    },
    generationType: {
      type: String,
      enum: ['story-analysis', 'character-image', 'scene-image', 'video', 'voice', 'export-film'],
      required: true,
    },
    provider: {
      type: String,
      default: 'Cinematic AI Engine (Photorealistic)',
    },
    prompt: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['queued', 'processing', 'completed', 'failed'],
      default: 'queued',
    },
    progress: {
      type: Number,
      default: 0,
    },
    statusMessage: {
      type: String,
      default: 'Initializing generation pipeline...',
    },
    resultUrl: {
      type: String,
      default: '',
    },
    resultData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.GenerationJob || mongoose.model('GenerationJob', generationJobSchema);
