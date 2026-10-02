import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useGeneration } from '../../context/GenerationContext';
import { aiApi } from '../../api';
import {
  Mic2,
  Volume2,
  Play,
  Pause,
  Sparkles,
  Users,
  Film,
  ArrowRight,
  Music,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

export const VoiceStudioPage = () => {
  const { currentProject, characters, scenes, updateCharacter, refreshCurrentProject } = useProject();
  const { trackJob, addToast } = useGeneration();
  const navigate = useNavigate();

  const [selectedCharacterId, setSelectedCharacterId] = useState(characters[0]?._id || '');
  const [selectedSceneId, setSelectedSceneId] = useState(scenes[0]?._id || '');
  const [dialogueInput, setDialogueInput] = useState('This timeline doesn’t make sense. Someone altered the logs.');
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);

  const voiceLibrary = [
    { voiceId: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', gender: 'Male', style: 'Natural & Deep Protagonist', sample: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3' },
    { voiceId: 'ErXwobaYiN019PkySvjV', name: 'Antoni', gender: 'Male', style: 'Gritty Noir Detective', sample: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3' },
    { voiceId: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', gender: 'Male', style: 'Resonant & Authoritative', sample: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3' },
    { voiceId: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel', gender: 'Female', style: 'Intense & Clear Mystery', sample: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3' },
    { voiceId: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi', gender: 'Female', style: 'Resolute & Confident', sample: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3' },
    { voiceId: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', gender: 'Female', style: 'Soft & Emotional', sample: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3' },
  ];

  const selectedCharacter = characters.find((c) => c._id === selectedCharacterId) || characters[0];
  const selectedScene = scenes.find((s) => s._id === selectedSceneId) || scenes[0];

  const handleAssignVoice = async (voice) => {
    if (!selectedCharacter) return;
    try {
      await updateCharacter(selectedCharacter._id, {
        voiceProfile: {
          ...selectedCharacter.voiceProfile,
          name: voice.name,
          voiceId: voice.voiceId,
          gender: voice.gender,
          style: voice.style,
        },
      });
      addToast(`Assigned voice "${voice.name}" to character ${selectedCharacter.name}`, 'success');
    } catch (err) {
      addToast('Failed to assign voice: ' + err.message, 'error');
    }
  };

  const handleSynthesizeDialogue = async () => {
    if (!dialogueInput.trim()) return;
    setIsSynthesizing(true);
    try {
      const res = await aiApi.generateVoice({
        sceneId: selectedScene?._id,
        characterId: selectedCharacter?._id,
        dialogueText: dialogueInput,
        voiceId: selectedCharacter?.voiceProfile?.voiceId || 'pNInz6obpgDQGcFmaJgB',
      });

      trackJob(res.data.jobId, `Voice Synthesis for ${selectedCharacter?.name || 'Character'}`, async () => {
        await refreshCurrentProject();
        setIsSynthesizing(false);
        addToast('Character voice track synthesized & attached to scene!', 'success');
      });
    } catch (err) {
      addToast('Voice synthesis failed: ' + err.message, 'error');
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-cine-900 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cine-gold/20 text-cine-gold border border-cine-gold/30 text-xs font-mono font-medium mb-2">
            <Mic2 className="w-3.5 h-3.5" /> STEP 05 • VOICE STUDIO
          </div>
          <h1 className="font-cinematic text-2xl sm:text-3xl font-extrabold text-white">
            Character Voice Casting & Dialogue Synthesis
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Assign unique neural voice profiles to characters and automatically synthesize screenplay dialogue lines.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Voice Casting Palette (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Character Selector */}
          <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-cine-gold" /> Select Character for Casting
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {characters.map((c) => (
                <button
                  key={c._id}
                  onClick={() => setSelectedCharacterId(c._id)}
                  className={`p-3 rounded-xl border text-left transition flex items-center gap-3 ${
                    selectedCharacter?._id === c._id
                      ? 'bg-cine-800 border-cine-gold ring-1 ring-cine-gold shadow-glow-gold'
                      : 'bg-cine-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <img
                    src={c.referenceImage || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                    alt={c.name}
                    className="w-9 h-9 rounded-full object-cover border border-cine-gold/30"
                  />
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-white truncate">{c.name}</div>
                    <div className="text-[10px] text-cine-gold font-mono truncate">{c.role}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Neural Voice Library */}
          <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
              <Mic2 className="w-4 h-4 text-cine-gold" /> Neural Voice Talent Library
            </h3>

            <div className="space-y-3">
              {voiceLibrary.map((voice) => {
                const isCurrentAssigned = selectedCharacter?.voiceProfile?.name === voice.name || selectedCharacter?.voiceProfile?.voiceId === voice.voiceId;

                return (
                  <div
                    key={voice.voiceId}
                    className={`p-4 rounded-xl border transition flex items-center justify-between gap-4 ${
                      isCurrentAssigned
                        ? 'bg-cine-800/90 border-cine-gold shadow-glow-gold'
                        : 'bg-cine-950 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cine-900 border border-slate-700 flex items-center justify-center text-cine-gold">
                        <Volume2 className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-2">
                          {voice.name}
                          <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-cine-900 text-slate-400 border border-slate-800">
                            {voice.gender}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400">{voice.style}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAssignVoice(voice)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
                          isCurrentAssigned
                            ? 'bg-emerald-500 text-black'
                            : 'bg-cine-gold hover:bg-amber-400 text-black'
                        }`}
                      >
                        {isCurrentAssigned ? 'Assigned' : 'Cast Voice'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Synthesis Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cine-gold" /> Scene Dialogue Synthesis
            </h3>

            {/* Target scene picker */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Target Scene</label>
              <select
                value={selectedScene?._id || ''}
                onChange={(e) => {
                  const s = scenes.find((sc) => sc._id === e.target.value);
                  setSelectedSceneId(e.target.value);
                  if (s?.dialogue?.text) {
                    setDialogueInput(s.dialogue.text);
                  }
                }}
                className="w-full bg-cine-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              >
                {scenes.map((s) => (
                  <option key={s._id} value={s._id}>
                    Scene {s.sceneNumber}: {s.location}
                  </option>
                ))}
              </select>
            </div>

            {/* Dialogue text */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Character Dialogue Line
              </label>
              <textarea
                rows={4}
                value={dialogueInput}
                onChange={(e) => setDialogueInput(e.target.value)}
                placeholder="Type the dialogue to be spoken by the character..."
                className="w-full bg-cine-950 border border-slate-800 rounded-xl p-3 text-xs text-white font-mono focus:outline-none resize-none"
              />
            </div>

            {/* Existing Audio Player if available */}
            {selectedScene?.dialogueAudioUrl && (
              <div className="p-3.5 rounded-xl bg-cine-950 border border-emerald-500/30 space-y-2">
                <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Dialogue Audio Synthesized
                </div>
                <audio src={selectedScene.dialogueAudioUrl} controls className="w-full h-8" />
              </div>
            )}

            <button
              onClick={handleSynthesizeDialogue}
              disabled={isSynthesizing}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 text-black font-bold text-xs transition shadow-glow-gold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSynthesizing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Synthesizing Speech Audio...
                </>
              ) : (
                <>
                  <Mic2 className="w-4 h-4" /> Synthesize Dialogue Audio Track
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => navigate('/studio/editor')}
            className="w-full py-3 rounded-xl bg-cine-950 hover:bg-cine-900 border border-slate-800 hover:border-cine-gold text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2"
          >
            Open Multi-Track Video Timeline Editor <ArrowRight className="w-4 h-4 text-cine-gold" />
          </button>
        </div>
      </div>
    </div>
  );
};
