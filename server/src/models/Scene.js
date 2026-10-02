const mongoose = require('mongoose');

const sceneSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    sceneNumber: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      default: 'Scene',
    },
    location: {
      type: String,
      default: 'Interior Detective Office',
    },
    timeOfDay: {
      type: String,
      enum: ['Dawn', 'Morning', 'Noon', 'Afternoon', 'Golden Hour', 'Dusk', 'Night', 'Midnight'],
      default: 'Night',
    },
    characterIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Character',
      },
    ],
    action: {
      type: String,
      default: '',
    },
    dialogue: {
      speaker: { type: String, default: '' },
      characterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', default: null },
      text: { type: String, default: '' },
    },
    dialogueAudioUrl: {
      type: String,
      default: '',
    },
    emotion: {
      type: String,
      default: 'Suspenseful',
    },
    camera: {
      shot: { type: String, default: 'Medium Close-Up' }, // Extreme Wide, Wide, Medium, Close-Up, Extreme Close-Up, Over-The-Shoulder
      movement: { type: String, default: 'Slow Cinematic Push-In' }, // Static, Pan Left, Pan Right, Tilt Up, Tilt Down, Dolly In, Tracking, Crane
      angle: { type: String, default: 'Eye Level' }, // Low Angle, High Angle, Dutch Angle, Bird's Eye
      lens: { type: String, default: '50mm Anamorphic f/1.8' },
    },
    lighting: {
      type: String,
      default: 'Low-key atmospheric lighting, warm tungsten desk lamp with blue exterior rain reflections',
    },
    visualDescription: {
      type: String,
      default: '',
    },
    duration: {
      type: Number,
      default: 4, // in seconds
    },
    imageUrl: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
    },
    audioAssets: [
      {
        type: { type: String, enum: ['bgm', 'sfx', 'ambient', 'voice'], default: 'ambient' },
        title: String,
        url: String,
        volume: { type: Number, default: 0.8 },
      },
    ],
    status: {
      type: String,
      enum: ['Pending', 'Image Generated', 'Video Generated', 'Completed', 'Failed'],
      default: 'Pending',
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Scene || mongoose.model('Scene', sceneSchema);
