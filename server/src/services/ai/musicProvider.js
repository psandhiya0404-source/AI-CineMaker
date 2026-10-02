/**
 * Music & Sound Effects Provider
 * Provides cinematic scores, atmospheric ambient beds, and foley SFX
 */

class MusicProvider {
  getCinematicLibrary() {
    return [
      {
        id: 'bgm-noir-1',
        title: 'Shadows of the City - Detective Theme',
        genre: 'Mystery / Noir',
        type: 'bgm',
        mood: 'Suspenseful & Brooding',
        duration: 90,
        url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=cinematic-atmosphere-score-112177.mp3',
        waveform: [20, 35, 50, 65, 80, 55, 40, 70, 90, 85, 60, 45, 30],
      },
      {
        id: 'bgm-thriller-2',
        title: 'Ticking Clock - Rising Pulse',
        genre: 'Thriller / Action',
        type: 'bgm',
        mood: 'Adrenaline & High Stakes',
        duration: 110,
        url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_c8bbf7b952.mp3?filename=cinematic-epic-emotional-106517.mp3',
        waveform: [10, 20, 40, 60, 80, 100, 95, 75, 50, 85, 95, 40],
      },
      {
        id: 'bgm-drama-3',
        title: 'Echoes of Redemption - Cello Solo',
        genre: 'Drama / Romance',
        type: 'bgm',
        mood: 'Emotional & Poignant',
        duration: 125,
        url: 'https://cdn.pixabay.com/download/audio/2022/10/14/audio_9939f792cb.mp3?filename=sad-cinematic-piano-123498.mp3',
        waveform: [15, 25, 35, 45, 60, 70, 65, 50, 40, 30, 20],
      },
      {
        id: 'amb-rain',
        title: 'Night Rain on Concrete & Distant Thunder',
        genre: 'Atmosphere',
        type: 'ambient',
        mood: 'Rainy Noir',
        duration: 60,
        url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_4d94fe9579.mp3?filename=rain-and-thunder-16705.mp3',
        waveform: [30, 35, 32, 38, 45, 40, 35, 30, 32],
      },
      {
        id: 'sfx-gunshot',
        title: 'Cinematic Sub-Bass Impact & Boom',
        genre: 'SFX',
        type: 'sfx',
        mood: 'Dramatic Climax',
        duration: 4,
        url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_c36bf41bc3.mp3?filename=cinematic-boom-impact-9856.mp3',
        waveform: [100, 80, 50, 30, 10],
      },
      {
        id: 'sfx-car-screech',
        title: 'Tire Screech & Hard Braking',
        genre: 'SFX',
        type: 'sfx',
        mood: 'Chase Sequence',
        duration: 3,
        url: 'https://cdn.pixabay.com/download/audio/2021/08/04/audio_12b0c7443c.mp3?filename=car-skid-10250.mp3',
        waveform: [40, 90, 85, 30],
      }
    ];
  }

  async suggestAudioForScene(scene, genre = 'Thriller') {
    const library = this.getCinematicLibrary();
    const action = (scene.action || '').toLowerCase();
    const location = (scene.location || '').toLowerCase();

    let matchedBgm = library.find(item => item.type === 'bgm' && item.genre.toLowerCase().includes(genre.toLowerCase())) || library[0];
    let matchedAmbient = library.find(item => item.type === 'ambient') || library[3];
    let matchedSfx = (action.includes('car') || action.includes('drive')) ? library[5] : library[4];

    return {
      bgm: matchedBgm,
      ambient: location.includes('rain') || location.includes('exterior') ? matchedAmbient : null,
      sfx: matchedSfx,
    };
  }
}

module.exports = new MusicProvider();
