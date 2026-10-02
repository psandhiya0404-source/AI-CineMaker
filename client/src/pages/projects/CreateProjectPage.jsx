import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { SAMPLE_STORIES } from '../../utils/sampleStories';
import {
  Film,
  Sparkles,
  ArrowRight,
  Palette,
  Globe,
  Clock,
  BookOpen,
  Loader2,
} from 'lucide-react';

export const CreateProjectPage = () => {
  const { createProject } = useProject();
  const navigate = useNavigate();

  const [title, setTitle] = useState('The Silent Cipher');
  const [genre, setGenre] = useState('Thriller');
  const [language, setLanguage] = useState('English');
  const [duration, setDuration] = useState('2-3 Minutes');
  const [visualStyle, setVisualStyle] = useState('Photorealistic');
  const [description, setDescription] = useState(
    'A hardboiled detective investigates an altered photograph in a rain-soaked metropolis.'
  );
  const [loadSample, setLoadSample] = useState(true);
  const [loading, setLoading] = useState(false);

  const genres = [
    { name: 'Thriller', color: 'from-amber-700/60 to-black', img: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=300&auto=format&fit=crop&q=80' },
    { name: 'Mystery', color: 'from-blue-900/60 to-black', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80' },
    { name: 'Action', color: 'from-red-900/60 to-black', img: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80' },
    { name: 'Drama', color: 'from-purple-900/60 to-black', img: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&auto=format&fit=crop&q=80' },
    { name: 'Romance', color: 'from-pink-900/60 to-black', img: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=300&auto=format&fit=crop&q=80' },
    { name: 'Horror', color: 'from-slate-900 to-black', img: 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=300&auto=format&fit=crop&q=80' },
    { name: 'Sci-Fi', color: 'from-cyan-900/60 to-black', img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80' },
    { name: 'Crime', color: 'from-yellow-900/60 to-black', img: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=300&auto=format&fit=crop&q=80' },
    { name: 'Comedy', color: 'from-emerald-900/60 to-black', img: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?w=300&auto=format&fit=crop&q=80' },
  ];

  const visualStyles = [
    { name: 'Photorealistic', desc: 'Authentic 35mm film stock, true-to-life lighting & skin pores.' },
    { name: 'Cinematic', desc: 'Anamorphic widescreen lens flares, shallow depth of field.' },
    { name: 'Dark Cinematic', desc: 'Neo-noir mood, deep shadows, high-contrast atmospheric grading.' },
    { name: 'Warm Cinematic', desc: 'Golden hour amber diffusion, rich film warmth.' },
    { name: 'Natural', desc: 'Documentary-grade naturalistic daylight cinematography.' },
    { name: 'Night', desc: 'Rain-soaked asphalt, neon practical lights, high dynamic range.' },
    { name: 'Noir', desc: 'Dramatic shadows, Venetian blinds, vintage black and white contrast.' },
    { name: 'Vintage 35mm', desc: '1970s Panavision film aesthetic with organic grain.' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newProject = await createProject({
        title,
        genre,
        language,
        duration,
        visualStyle,
        description,
      });

      // If sample story checked, attach story content
      if (loadSample && SAMPLE_STORIES[0]) {
        // Will be picked up in Story Studio
      }

      navigate('/studio/story');
    } catch (err) {
      console.error('Failed to create project:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cine-gold/20 text-cine-gold border border-cine-gold/30 text-xs font-mono font-medium mb-2">
          <Film className="w-3.5 h-3.5" /> PRODUCTION GREENLIGHT
        </div>
        <h1 className="font-cinematic text-3xl font-extrabold text-white">
          Create New Film Project
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure project genre, visual styling, language, and cinematic parameters.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Metadata */}
        <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-5">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-cine-gold" /> Film Information
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Film Project Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Midnight Cipher"
                className="w-full bg-cine-950 border border-slate-700 focus:border-cine-gold/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-cine-gold" /> Story Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-cine-950 border border-slate-700 focus:border-cine-gold/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                  <option value="Japanese">Japanese</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Korean">Korean</option>
                  <option value="Italian">Italian</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-cine-gold" /> Target Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-cine-950 border border-slate-700 focus:border-cine-gold/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                >
                  <option value="1-2 Minutes">1-2 Minutes (Short Teaser)</option>
                  <option value="2-3 Minutes">2-3 Minutes (Standard Short Film)</option>
                  <option value="3-5 Minutes">3-5 Minutes (Extended Scene)</option>
                  <option value="5-10 Minutes">5-10 Minutes (Full Cinematic Sequence)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Film Logline / Brief Description
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief 1-2 sentence synopsis of the film premise..."
                className="w-full bg-cine-950 border border-slate-700 focus:border-cine-gold/80 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition resize-none"
              />
            </div>
          </div>
        </div>

        {/* Genre Selection */}
        <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <Film className="w-4 h-4 text-cine-gold" /> Genre Selection
            </h3>
            <span className="text-xs text-cine-gold font-mono font-bold">Selected: {genre}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-3">
            {genres.map((g) => (
              <button
                key={g.name}
                type="button"
                onClick={() => setGenre(g.name)}
                className={`relative rounded-xl overflow-hidden h-20 border text-left p-3 transition flex flex-col justify-end group ${
                  genre === g.name
                    ? 'border-cine-gold ring-2 ring-cine-gold/50 shadow-glow-gold'
                    : 'border-slate-800 hover:border-slate-600'
                }`}
              >
                <img
                  src={g.img}
                  alt={g.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-30 group-hover:scale-105 transition"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                <span className="relative z-10 text-xs font-bold text-white tracking-wide">
                  {g.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Visual Style Selection */}
        <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <Palette className="w-4 h-4 text-cine-gold" /> Visual Style & Cinematography
            </h3>
            <span className="text-xs text-cine-gold font-mono font-bold">Selected: {visualStyle}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {visualStyles.map((style) => (
              <button
                key={style.name}
                type="button"
                onClick={() => setVisualStyle(style.name)}
                className={`p-4 rounded-xl border text-left transition ${
                  visualStyle === style.name
                    ? 'bg-cine-800 border-cine-gold ring-1 ring-cine-gold shadow-glow-gold'
                    : 'bg-cine-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-bold text-white mb-1 flex items-center justify-between">
                  <span>{style.name}</span>
                  {style.name === 'Photorealistic' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-cine-gold/20 text-cine-gold font-mono">RECOMMENDED</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400">{style.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 hover:to-cine-gold text-black font-bold text-sm transition shadow-glow-gold flex items-center gap-2 disabled:opacity-50 transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Launching Project...
              </>
            ) : (
              <>
                Create Project & Enter Story Studio <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
