const mongoose = require('mongoose');

const voiceProfileSchema = new mongoose.Schema(
  {
    characterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Character',
      required: true,
    },
    name: {
      type: String,
      default: 'Cinematic Voice',
    },
    provider: {
      type: String,
      default: 'ElevenLabs / Neural TTS',
    },
    voiceId: {
      type: String,
      default: '21m00Tcm4TlvDq8ikWAM',
    },
    language: {
      type: String,
      default: 'en-US',
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Non-binary'],
      default: 'Male',
    },
    pitch: {
      type: Number,
      default: 1.0,
    },
    speed: {
      type: Number,
      default: 1.0,
    },
    style: {
      type: String,
      default: 'Deep Cinematic Narration',
    },
    previewAudioUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.VoiceProfile || mongoose.model('VoiceProfile', voiceProfileSchema);
