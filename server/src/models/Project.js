const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
    },
    genre: {
      type: String,
      enum: [
        'Romance',
        'Mystery',
        'Thriller',
        'Horror',
        'Comedy',
        'Drama',
        'Action',
        'Fantasy',
        'Crime',
        'Sci-Fi',
      ],
      default: 'Thriller',
    },
    language: {
      type: String,
      default: 'English',
    },
    duration: {
      type: String,
      default: '2-3 Minutes',
    },
    visualStyle: {
      type: String,
      enum: [
        'Photorealistic',
        'Cinematic',
        'Dark Cinematic',
        'Warm Cinematic',
        'Natural',
        'Night',
        'Day',
        'Noir',
        'Vintage 35mm',
      ],
      default: 'Photorealistic',
    },
    description: {
      type: String,
      default: '',
    },
    story: {
      title: { type: String, default: '' },
      content: { type: String, default: '' },
      analyzed: { type: Boolean, default: false },
      analysisData: { type: mongoose.Schema.Types.Mixed, default: null },
    },
    thumbnail: {
      type: String,
      default: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80',
    },
    status: {
      type: String,
      enum: ['Draft', 'Processing', 'Ready', 'Completed', 'Failed'],
      default: 'Draft',
    },
    aspectRatio: {
      type: String,
      default: '16:9',
    },
    fps: {
      type: Number,
      default: 24,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);
