import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useGeneration } from '../../context/GenerationContext';
import {
  SlidersHorizontal,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Film,
  Mic2,
  Music,
  Clock,
  Plus,
  Trash2,
  ArrowRight,
  Maximize2,
  Scissors,
  Layers,
  ChevronRight,
} from 'lucide-react';

export const VideoEditorPage = () => {
  const { currentProject, scenes, updateScene, reorderScenes } = useProject();
  const { addToast } = useGeneration();
  const navigate = useNavigate();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPlayIndex, setCurrentPlayIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [bgmVolume, setBgmVolume] = useState(0.7);
  const [activeTrack, setActiveTrack] = useState('video');
  const videoRef = useRef(null);

  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration || 4), 0);
  const activeScene = scenes[currentPlayIndex] || scenes[0];

  // Playback timer ticker
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            return 0;
          }
          const nextTime = prev + 0.5;
          // Calculate which scene corresponds to this time
          let accumulated = 0;
          for (let i = 0; i < scenes.length; i++) {
            accumulated += (scenes[i].duration || 4);
            if (nextTime <= accumulated) {
              setCurrentPlayIndex(i);
              break;
            }
          }
          return nextTime;
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalDuration, scenes]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleDurationChange = async (sceneId, newDuration) => {
    const dur = Math.max(2, Math.min(30, Number(newDuration)));
    await updateScene(sceneId, { duration: dur });
    addToast(`Updated scene duration to ${dur}s`, 'info');
  };

  const formatTimecode = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const frames = Math.floor((seconds % 1) * 24);
    return `${mins < 10 ? '0' + mins : mins}:${secs < 10 ? '0' + secs : secs}:${frames < 10 ? '0' + frames : frames}`;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-2xl bg-cine-900 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cine-gold/20 text-cine-gold border border-cine-gold/30 text-xs font-mono font-medium mb-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" /> STEP 06 • TIMELINE EDITOR
          </div>
          <h1 className="font-cinematic text-2xl font-extrabold text-white">
            Cinematic Multi-Track Timeline Editor
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/studio/export')}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 text-black font-bold text-xs transition shadow-glow-gold flex items-center gap-2"
          >
            Export & Master Film <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Main Canvas (Top Player + Right Inspector) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Central Live Video Canvas Player (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="letterbox-preview rounded-2xl bg-black border border-slate-800 overflow-hidden relative group aspect-video flex items-center justify-center shadow-2xl">
            {activeScene?.videoUrl ? (
              <video
                ref={videoRef}
                src={activeScene.videoUrl}
                autoPlay={isPlaying}
                loop
                muted={isMuted}
                className="w-full h-full object-cover"
              />
            ) : activeScene?.imageUrl ? (
              <img
                src={activeScene.imageUrl}
                alt="Scene frame"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center p-8 space-y-2">
                <Film className="w-12 h-12 text-slate-700 mx-auto" />
                <span className="text-xs text-slate-500 font-mono">No video clip generated for this scene yet</span>
              </div>
            )}

            {/* In-Player Overlays */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-black/80 text-cine-gold font-mono font-bold text-xs border border-cine-gold/40">
                SCENE {activeScene?.sceneNumber < 10 ? '0' + activeScene?.sceneNumber : activeScene?.sceneNumber}
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-black/80 text-white font-mono text-xs">
                {activeScene?.location || 'Interior Office'}
              </span>
            </div>

            <div className="absolute top-4 right-4 z-20 font-mono text-xs text-cine-gold bg-black/80 px-3 py-1 rounded-lg border border-slate-700">
              {formatTimecode(currentTime)} / 24 FPS
            </div>

            {/* In-Player Subtitle / Dialogue Overlay */}
            {activeScene?.dialogue?.text && (
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 max-w-xl text-center px-4 py-2 rounded-xl bg-black/80 border border-slate-700 backdrop-blur-md">
                <span className="text-xs font-mono font-bold text-cine-gold uppercase">
                  {activeScene.dialogue.speaker || 'Voice'}:
                </span>{' '}
                <span className="text-xs text-white italic">"{activeScene.dialogue.text}"</span>
              </div>
            )}
          </div>

          {/* Player Transport Controls */}
          <div className="p-4 rounded-2xl bg-cine-900 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setCurrentTime(0);
                  setCurrentPlayIndex(0);
                }}
                className="p-2 rounded-xl bg-cine-950 text-slate-400 hover:text-white transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={togglePlay}
                className="px-5 py-2 rounded-xl bg-cine-gold hover:bg-amber-400 text-black font-bold text-xs transition shadow-glow-gold flex items-center gap-2"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? 'Pause' : 'Play Timeline'}
              </button>
            </div>

            {/* Timecode & scrubber */}
            <div className="flex-1 max-w-md flex items-center gap-3">
              <span className="text-xs font-mono text-cine-gold">{formatTimecode(currentTime)}</span>
              <input
                type="range"
                min={0}
                max={Math.max(1, totalDuration)}
                step={0.1}
                value={currentTime}
                onChange={(e) => setCurrentTime(Number(e.target.value))}
                className="w-full h-1.5 bg-cine-950 rounded-lg appearance-none cursor-pointer accent-cine-gold"
              />
              <span className="text-xs font-mono text-slate-400">{formatTimecode(totalDuration)}</span>
            </div>

            {/* Volume controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-xl bg-cine-950 text-slate-400 hover:text-white"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-cine-gold" />}
              </button>
            </div>
          </div>
        </div>

        {/* Right Inspector & Scene Clip Metadata (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-cine-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
              <Film className="w-4 h-4 text-cine-gold" /> Active Clip Inspector
            </h3>

            {activeScene ? (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Scene Title</label>
                  <div className="font-bold text-white p-2.5 rounded-xl bg-cine-950 border border-slate-800">
                    {activeScene.title}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Trim Duration (Seconds)</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min={2}
                      max={30}
                      value={activeScene.duration || 4}
                      onChange={(e) => handleDurationChange(activeScene._id, e.target.value)}
                      className="w-24 bg-cine-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                    <span className="text-xs text-slate-400">Seconds (Current: {activeScene.duration || 4}s)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Action Cue</label>
                  <p className="p-2.5 rounded-xl bg-cine-950 border border-slate-800 text-slate-300 leading-relaxed">
                    {activeScene.action}
                  </p>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Optical Motion</label>
                  <div className="p-2.5 rounded-xl bg-cine-950 border border-slate-800 text-cine-gold font-mono text-[11px]">
                    {activeScene.camera?.shot} • {activeScene.camera?.movement}
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No clip selected.</p>
            )}
          </div>
        </div>
      </div>

      {/* Multi-Track Timeline (Bottom Section) */}
      <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="text-xs font-mono uppercase text-slate-200 font-bold tracking-wider">
              MULTI-TRACK NON-LINEAR TIMELINE
            </h3>
            <span className="px-2 py-0.5 rounded bg-cine-950 text-cine-gold font-mono text-[10px] border border-slate-800">
              {scenes.length} Video Clips • {totalDuration}s Runtime
            </span>
          </div>
        </div>

        {/* Timeline Tracks Container */}
        <div className="space-y-2 pt-2 overflow-x-auto pb-4">
          {/* TRACK 1: VIDEO CLIPS */}
          <div className="flex items-center gap-3 min-w-[700px]">
            <div className="w-28 flex-shrink-0 flex items-center gap-2 text-xs font-mono text-slate-400">
              <Film className="w-3.5 h-3.5 text-cine-gold" /> Video (V1)
            </div>
            <div className="flex-1 flex gap-2 p-2 rounded-xl bg-cine-950 border border-slate-800 min-h-[72px]">
              {scenes.map((scene, idx) => {
                const isCurrent = currentPlayIndex === idx;
                return (
                  <div
                    key={scene._id}
                    onClick={() => setCurrentPlayIndex(idx)}
                    className={`cursor-pointer flex-shrink-0 rounded-lg p-2 border transition flex items-center gap-3 ${
                      isCurrent
                        ? 'bg-cine-800 border-cine-gold ring-1 ring-cine-gold shadow-glow-gold'
                        : 'bg-cine-900 border-slate-800 hover:border-slate-700'
                    }`}
                    style={{ width: `${Math.max(140, (scene.duration || 4) * 35)}px` }}
                  >
                    <img
                      src={scene.imageUrl || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=120&auto=format&fit=crop&q=80'}
                      alt={scene.title}
                      className="w-12 h-10 rounded object-cover flex-shrink-0"
                    />
                    <div className="overflow-hidden">
                      <div className="text-[11px] font-bold text-white truncate">
                        S{scene.sceneNumber < 10 ? '0' + scene.sceneNumber : scene.sceneNumber}
                      </div>
                      <div className="text-[10px] text-cine-gold font-mono">{scene.duration || 4}s</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRACK 2: DIALOGUE AUDIO */}
          <div className="flex items-center gap-3 min-w-[700px]">
            <div className="w-28 flex-shrink-0 flex items-center gap-2 text-xs font-mono text-slate-400">
              <Mic2 className="w-3.5 h-3.5 text-cine-cyan" /> Dialogue (A1)
            </div>
            <div className="flex-1 flex gap-2 p-2 rounded-xl bg-cine-950 border border-slate-800 min-h-[48px]">
              {scenes.map((scene) => (
                <div
                  key={scene._id}
                  className="rounded-lg px-3 py-1.5 bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-2 text-[11px] text-cyan-300 font-mono truncate"
                  style={{ width: `${Math.max(140, (scene.duration || 4) * 35)}px` }}
                >
                  <Mic2 className="w-3 h-3 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">{scene.dialogue?.text || 'No dialogue'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* TRACK 3: BGM & SFX */}
          <div className="flex items-center gap-3 min-w-[700px]">
            <div className="w-28 flex-shrink-0 flex items-center gap-2 text-xs font-mono text-slate-400">
              <Music className="w-3.5 h-3.5 text-indigo-400" /> BGM / SFX (A2)
            </div>
            <div className="flex-1 p-2 rounded-xl bg-cine-950 border border-slate-800 min-h-[48px] flex items-center">
              <div className="w-full h-8 rounded-lg bg-indigo-950/40 border border-indigo-500/30 flex items-center justify-between px-4 text-xs font-mono text-indigo-300">
                <span>🎵 Cinematic Noir Suspense Score (Master Stereo 48kHz)</span>
                <span>Volume: 70%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
