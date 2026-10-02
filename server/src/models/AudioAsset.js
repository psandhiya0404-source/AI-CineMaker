const mongoose = require('mongoose');

const audioAssetSchema = new mongoose.Schema(
  {
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
    title: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['bgm', 'sfx', 'voice', 'ambient'],
      default: 'bgm',
    },
    genre: {
      type: String,
      default: 'Cinematic Thriller',
    },
    url: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      default: 30, // seconds
    },
    volume: {
      type: Number,
      default: 0.8,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.AudioAsset || mongoose.model('AudioAsset', audioAssetSchema);
