/**
 * In-memory fallback and helper utilities for database operations.
 * Allows AI CineMaker to run immediately with 0 configuration,
 * while automatically persisting to real MongoDB whenever available.
 */
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const { getIsConnected } = require('../config/db');

// In-memory collections
const memStore = {
  users: [],
  projects: [],
  characters: [],
  scenes: [],
  jobs: [],
  voiceProfiles: [],
  audioAssets: [],
};

// Seed initial default audio tracks
memStore.audioAssets.push(
  {
    _id: 'bgm-1',
    projectId: null,
    title: 'Cinematic Noir Suspense Theme',
    type: 'bgm',
    genre: 'Mystery / Thriller',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cinematic-atmosphere-score-112177.mp3',
    duration: 120,
    volume: 0.7,
  },
  {
    _id: 'bgm-2',
    projectId: null,
    title: 'Epic Dramatic Strings & Pulse',
    type: 'bgm',
    genre: 'Drama / Action',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8bbf7b952.mp3?filename=cinematic-epic-emotional-106517.mp3',
    duration: 140,
    volume: 0.75,
  },
  {
    _id: 'sfx-rain',
    projectId: null,
    title: 'Heavy Rain & Thunder Ambience',
    type: 'ambient',
    genre: 'Atmosphere',
    url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_4d94fe9579.mp3?filename=rain-and-thunder-16705.mp3',
    duration: 60,
    volume: 0.5,
  },
  {
    _id: 'sfx-door',
    projectId: null,
    title: 'Creaking Door & Footsteps',
    type: 'sfx',
    genre: 'Foley',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=door-creak-and-shut-99887.mp3',
    duration: 5,
    volume: 0.9,
  }
);

function generateId() {
  return new mongoose.Types.ObjectId().toString();
}

module.exports = {
  memStore,
  generateId,
  isMongoActive: () => getIsConnected(),
};
