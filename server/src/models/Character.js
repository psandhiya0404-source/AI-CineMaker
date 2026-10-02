const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide character name'],
      trim: true,
    },
    age: {
      type: Number,
      default: 30,
    },
    gender: {
      type: String,
      default: 'Male',
    },
    role: {
      type: String,
      default: 'Protagonist', // Protagonist, Antagonist, Supporting, Mentor, Detective, etc.
    },
    personality: {
      type: String,
      default: 'Calm, sharp-minded, observant',
    },
    appearance: {
      face: { type: String, default: 'Chiseled jawline, sharp focused brown eyes, slight stubble' },
      hair: { type: String, default: 'Short textured dark brown hair' },
      skinTone: { type: String, default: 'Warm olive' },
      bodyType: { type: String, default: 'Athletic, lean build' },
      clothing: { type: String, default: 'Charcoal trench coat over dark button-up shirt' },
      accessories: { type: String, default: 'Vintage silver wristwatch, leather notepad' },
      identifyingFeatures: { type: String, default: 'Faint scar over left eyebrow' },
    },
    description: {
      type: String,
      default: '',
    },
    referenceImage: {
      type: String,
      default: '',
    },
    referenceGallery: [
      {
        url: String,
        label: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    voiceProfile: {
      provider: { type: String, default: 'Standard Cinematic' },
      voiceId: { type: String, default: 'en-US-DeepBaritone-1' },
      language: { type: String, default: 'English' },
      gender: { type: String, default: 'Male' },
      pitch: { type: Number, default: 1.0 },
      speed: { type: Number, default: 1.0 },
      style: { type: String, default: 'Serious / Dramatic' },
      previewUrl: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Character || mongoose.model('Character', characterSchema);
