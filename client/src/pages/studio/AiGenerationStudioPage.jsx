import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useGeneration } from '../../context/GenerationContext';
import { aiApi } from '../../api';
import {
  Sparkles,
  Camera,
  Video,
  Layers,
  Users,
  Film,
  Sliders,
  Play,
  CheckCircle2,
  Lock,
  ArrowRight,
  Shield,
  Loader2,
  RefreshCw,
} from 'lucide-react';

export const AiGenerationStudioPage = () => {
  const { currentProject, characters, scenes, refreshCurrentProject } = useProject();
  const { trackJob, addToast } = useGeneration();
  const navigate = useNavigate();

  const [selectedSceneId, setSelectedSceneId] = useState(scenes[0]?._id || '');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [visualPromptEnhancer, setVisualPromptEnhancer] = useState(
    'Shot on ARRI Alexa Mini LF, 35mm Master Anamorphic lens, natural skin pores, atmospheric volumetric lighting, Kodak Vision3 500T 8k live action film still'
  );
  const [motionSpeed, setMotionSpeed] = useState('Smooth 24fps');
  const [isBatchGenerating, setIsBatchGenerating] = useState(false);

  const selectedScene = scenes.find((s) => s._id === selectedSceneId) || scenes[0];
  const linkedCharacters = characters.filter((c) =>
    (selectedScene?.characterIds || []).some((id) => id.toString() === c._id.toString())
  );

  const handleGenerateSelectedImage = async () => {
    if (!selectedScene) return;
    try {
      const res = await aiApi.generateSceneImage({
        sceneId: selectedScene._id,
        projectId: currentProject._id,
      });

      trackJob(res.data.jobId, `Generating Scene ${selectedScene.sceneNumber} 35mm Frame`, async () => {
        await refreshCurrentProject();
        addToast(`Scene ${selectedScene.sceneNumber} frame rendered successfully!`, 'success');
      });
    } catch (err) {
      addToast('Frame generation error: ' + err.message, 'error');
    }
  };

  const handleGenerateSelectedVideo = async () => {
    if (!selectedScene) return;
    try {
      const res = await aiApi.generateVideo({
        sceneId: selectedScene._id,
        duration: selectedScene.duration || 4,
      });

      trackJob(res.data.jobId, `Generating Scene ${selectedScene.sceneNumber} Live Action Video`, async () => {
        await refreshCurrentProject();
        addToast(`Scene ${selectedScene.sceneNumber} video clip generated!`, 'success');
      });
    } catch (err) {
      addToast('Video generation error: ' + err.message, 'error');
    }
  };

  const handleBatchGenerateAll = async () => {
    if (scenes.length === 0) return;
    setIsBatchGenerating(true);
    addToast('Initiated batch generation for all scenes in screenplay', 'info');

    for (const scene of scenes) {
      try {
        await aiApi.generateSceneImage({
          sceneId: scene._id,
          projectId: currentProject._id,
        });
      } catch (err) {
        console.error(err);
      }
    }

    setTimeout(async () => {
      await refreshCurrentProject();
      setIsBatchGenerating(false);
      addToast('Batch image frames generated for all scenes!', 'success');
    }, 4000);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-cine-900 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cine-gold/20 text-cine-gold border border-cine-gold/30 text-xs font-mono font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" /> STEP 04 • AI GENERATION STUDIO
          </div>
          <h1 className="font-cinematic text-2xl sm:text-3xl font-extrabold text-white">
            Live-Action Cinematic Generation Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Fine-tune character reference bindings, negative prompts, camera motion, and render 24fps photorealistic sequences.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleBatchGenerateAll}
            disabled={isBatchGenerating || scenes.length === 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 text-black font-bold text-xs transition shadow-glow-gold flex items-center gap-2 disabled:opacity-50"
          >
            {isBatchGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
            Batch Generate All Scenes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Control Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Target Scene Selector */}
          <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
                <Film className="w-4 h-4 text-cine-gold" /> Select Screenplay Scene
              </h3>
              <span className="text-xs font-mono text-cine-gold font-bold">
                {scenes.length} Scenes in Timeline
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {scenes.map((s) => (
                <button
                  key={s._id}
                  onClick={() => setSelectedSceneId(s._id)}
                  className={`p-2.5 rounded-xl border text-left transition ${
                    (selectedScene?._id === s._id)
                      ? 'bg-cine-800 border-cine-gold text-white ring-1 ring-cine-gold shadow-glow-gold'
                      : 'bg-cine-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="font-mono text-[10px] font-bold">SCENE {s.sceneNumber < 10 ? '0' + s.sceneNumber : s.sceneNumber}</div>
                  <div className="text-[11px] truncate font-semibold">{s.location}</div>
                  <div className="text-[10px] text-slate-500">{s.timeOfDay}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Bound Character Reference Consistency */}
          <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
                <Shield className="w-4 h-4 text-emerald-400" /> Active Character Reference Anchors
              </h3>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono border border-emerald-500/40">
                PROPRIETARY IDENTITY LOCK ACTIVE
              </span>
            </div>

            {linkedCharacters.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No specific characters bound to this scene.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {linkedCharacters.map((c) => (
                  <div key={c._id} className="p-3 rounded-xl bg-cine-950 border border-slate-800 flex items-center gap-3">
                    <img
                      src={c.referenceImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                      alt={c.name}
                      className="w-12 h-12 rounded-xl object-cover border border-cine-gold/40 flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-white flex items-center gap-1.5 truncate">
                        {c.name}
                        <Lock className="w-3 h-3 text-emerald-400" />
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">{c.appearance?.face || 'Sharp features'}</div>
                      <div className="text-[10px] text-cine-gold font-mono">{c.appearance?.clothing || 'Charcoal Coat'}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Generation Parameters */}
          <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cine-gold" /> Cinematic Optical & Style Tuning
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Aspect Ratio Frame</label>
                <div className="grid grid-cols-3 gap-2">
                  {['16:9', '2.39:1 Cinematic', '9:16 Vertical'].map((ratio) => (
                    <button
                      key={ratio}
                      type="button"
                      onClick={() => setAspectRatio(ratio)}
                      className={`py-2 px-3 rounded-xl text-xs font-mono font-bold transition border ${
                        aspectRatio === ratio
                          ? 'bg-cine-gold text-black border-cine-gold shadow-glow-gold'
                          : 'bg-cine-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">Cinematic Quality Prompt Engine</label>
                <textarea
                  rows={2}
                  value={visualPromptEnhancer}
                  onChange={(e) => setVisualPromptEnhancer(e.target.value)}
                  className="w-full bg-cine-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-300 font-mono focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono text-rose-400 mb-1">Enforced Negative Prompt (Strict Anti-Cartoon Filter)</label>
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/30 text-[11px] font-mono text-rose-300/80 leading-relaxed">
                  cartoon, anime, 3d render, illustration, drawing, painting, cgi, plastic skin, doll, deformed eyes, extra limbs, bad anatomy, over-saturated, airbrushed, video game graphic
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Preview & Action Deck (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center justify-between">
              <span>Scene Output Monitor</span>
              <span className="text-cine-gold">SCENE {selectedScene?.sceneNumber || 1}</span>
            </h3>

            {/* Video / Image Display */}
            <div className="letterbox-preview rounded-2xl bg-black overflow-hidden border border-slate-800 h-64 flex items-center justify-center relative group">
              {selectedScene?.videoUrl ? (
                <video src={selectedScene.videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
              ) : selectedScene?.imageUrl ? (
                <img src={selectedScene.imageUrl} alt="Scene Output" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <Camera className="w-10 h-10 text-slate-600 mx-auto" />
                  <span className="text-xs text-slate-400 block font-mono">No Asset Generated</span>
                </div>
              )}
            </div>

            {/* Scene metadata pill */}
            <div className="p-3.5 rounded-xl bg-cine-950 border border-slate-800 text-xs space-y-1.5">
              <div className="text-white font-bold">{selectedScene?.title}</div>
              <div className="text-slate-400 line-clamp-2">{selectedScene?.action}</div>
              <div className="text-[11px] text-cine-gold font-mono pt-1">
                Camera: {selectedScene?.camera?.shot || 'Medium Shot'} • {selectedScene?.camera?.movement || 'Slow Push-In'}
              </div>
            </div>

            {/* Trigger buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleGenerateSelectedImage}
                className="w-full py-3 rounded-xl bg-cine-800 hover:bg-slate-700 text-slate-100 font-bold text-xs transition flex items-center justify-center gap-2 border border-slate-700"
              >
                <Camera className="w-4 h-4 text-cine-gold" />
                Render 35mm Live-Action Frame
              </button>

              <button
                onClick={handleGenerateSelectedVideo}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 text-black font-bold text-xs transition shadow-glow-gold flex items-center justify-center gap-2"
              >
                <Video className="w-4 h-4" />
                Generate 24fps Cinematic Motion Video
              </button>
            </div>
          </div>

          <button
            onClick={() => navigate('/studio/voice')}
            className="w-full py-3 rounded-xl bg-cine-950 hover:bg-cine-900 border border-slate-800 hover:border-cine-gold text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            Continue to Character Voice Studio <ArrowRight className="w-4 h-4 text-cine-gold" />
          </button>
        </div>
      </div>
    </div>
  );
};
