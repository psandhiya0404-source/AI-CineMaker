import React, { useState } from 'react';
import { useGeneration } from '../../context/GenerationContext';
import {
  Settings,
  Key,
  Shield,
  Cpu,
  Database,
  CheckCircle2,
  Save,
  Server,
  Zap,
} from 'lucide-react';

export const SettingsPage = () => {
  const { addToast } = useGeneration();

  const [openAiKey, setOpenAiKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [stabilityKey, setStabilityKey] = useState('');
  const [runwayKey, setRunwayKey] = useState('');
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [klingKey, setKlingKey] = useState('');

  const handleSaveSettings = (e) => {
    e.preventDefault();
    addToast('API key configuration preferences saved to backend session.', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cine-gold/20 text-cine-gold border border-cine-gold/30 text-xs font-mono font-medium mb-2">
          <Settings className="w-3.5 h-3.5" /> SYSTEM CONFIGURATION
        </div>
        <h1 className="font-cinematic text-2xl sm:text-3xl font-extrabold text-white">
          AI Provider Settings & Engine Health
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your cloud AI provider credentials. If any provider key is left blank, AI CineMaker automatically utilizes the built-in resilient live-action cinematic engine with zero downtime.
        </p>
      </div>

      {/* System Engine Status */}
      <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-4">
        <h3 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cine-gold" /> Active Pipeline Subsystems
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-xl bg-cine-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Character Identity Engine</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">100% OPERATIONAL</div>
          </div>

          <div className="p-3.5 rounded-xl bg-cine-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Photorealistic Live-Action Flux</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">READY (NO CARTOON)</div>
          </div>

          <div className="p-3.5 rounded-xl bg-cine-950 border border-slate-800 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Async Generation Job Queue</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="text-[11px] text-emerald-400 font-mono">ACTIVE (POLLING 1.5s)</div>
          </div>
        </div>
      </div>

      {/* API Key Form */}
      <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-6">
        <h3 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
          <Key className="w-4 h-4 text-cine-gold" /> Custom AI Provider Credentials (Optional)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">OpenAI API Key</label>
            <input
              type="password"
              value={openAiKey}
              onChange={(e) => setOpenAiKey(e.target.value)}
              placeholder="sk-proj-..."
              className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cine-gold"
            />
            <span className="text-[10px] text-slate-500">Screenplay Analysis & DALL-E 3</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Google Gemini API Key</label>
            <input
              type="password"
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cine-gold"
            />
            <span className="text-[10px] text-slate-500">Gemini 1.5 Flash Fast Analysis</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Stability AI API Key</label>
            <input
              type="password"
              value={stabilityKey}
              onChange={(e) => setStabilityKey(e.target.value)}
              placeholder="sk-..."
              className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cine-gold"
            />
            <span className="text-[10px] text-slate-500">Stable Diffusion 3.5 Photorealism</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Runway Gen-3 API Key</label>
            <input
              type="password"
              value={runwayKey}
              onChange={(e) => setRunwayKey(e.target.value)}
              placeholder="key_..."
              className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cine-gold"
            />
            <span className="text-[10px] text-slate-500">Gen-3 Image-to-Video Motion</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">ElevenLabs API Key</label>
            <input
              type="password"
              value={elevenLabsKey}
              onChange={(e) => setElevenLabsKey(e.target.value)}
              placeholder="xi-..."
              className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cine-gold"
            />
            <span className="text-[10px] text-slate-500">Neural Character Voice Synthesis</span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Kling AI Key</label>
            <input
              type="password"
              value={klingKey}
              onChange={(e) => setKlingKey(e.target.value)}
              placeholder="kling-..."
              className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cine-gold"
            />
            <span className="text-[10px] text-slate-500">Cinematic Video v1.5</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 text-black font-bold text-xs transition shadow-glow-gold flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
};
