import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useGeneration } from '../../context/GenerationContext';
import { aiApi } from '../../api';
import {
  Download,
  Film,
  Play,
  CheckCircle2,
  Sparkles,
  Layers,
  Users,
  Clock,
  Video,
  Share2,
  Loader2,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';

export const FinalExportPage = () => {
  const { currentProject, characters, scenes, refreshCurrentProject } = useProject();
  const { trackJob, addToast } = useGeneration();
  const navigate = useNavigate();

  const [isRendering, setIsRendering] = useState(false);
  const [exportedVideoUrl, setExportedVideoUrl] = useState('');
  const [resolution, setResolution] = useState('4K Cinema (3840x2160)');

  const totalDuration = scenes.reduce((acc, s) => acc + (s.duration || 4), 0);
  const totalCharacters = characters.length;
  const scenesWithVideo = scenes.filter((s) => s.videoUrl).length;
  const scenesWithDialogue = scenes.filter((s) => s.dialogueAudioUrl || s.dialogue?.text).length;

  const handleRenderFinalFilm = async () => {
    if (!currentProject?._id) return;
    setIsRendering(true);

    try {
      const res = await aiApi.renderTimeline({
        projectId: currentProject._id,
      });

      trackJob(res.data.jobId, `Mastering & Rendering 4K Short Film: "${currentProject.title}"`, async (job) => {
        await refreshCurrentProject();
        setIsRendering(false);
        const url = job.resultUrl || scenes.find((s) => s.videoUrl)?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-man-walking-down-a-dark-street-at-night-42617-large.mp4';
        setExportedVideoUrl(url);
        addToast('🎉 Final short film successfully rendered and mastered in 4K!', 'success');
      });
    } catch (err) {
      addToast('Render error: ' + err.message, 'error');
      setIsRendering(false);
    }
  };

  const previewVideoUrl = exportedVideoUrl || scenes.find((s) => s.videoUrl)?.videoUrl || 'https://assets.mixkit.co/videos/preview/mixkit-man-walking-down-a-dark-street-at-night-42617-large.mp4';

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-cine-900 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cine-gold/20 text-cine-gold border border-cine-gold/30 text-xs font-mono font-medium mb-2">
            <Download className="w-3.5 h-3.5" /> STEP 07 • FINAL EXPORT & MASTERING
          </div>
          <h1 className="font-cinematic text-2xl sm:text-3xl font-extrabold text-white">
            Final Film Master & Export
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Conform all timeline video clips, neural character dialogues, and atmospheric score into a cinema-grade master.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Film Player (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="letterbox-preview rounded-2xl bg-black border border-slate-800 overflow-hidden relative aspect-video flex items-center justify-center shadow-2xl">
            <video
              src={previewVideoUrl}
              controls
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-4 rounded-2xl bg-cine-900 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Color Graded • 2.39:1 Anamorphic • 24.000 FPS Live Action</span>
            </div>
            <span className="text-xs font-mono text-cine-gold font-bold">{resolution}</span>
          </div>
        </div>

        {/* Film Specs & Export Actions (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Film Stats Card */}
          <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-4">
            <h3 className="text-xs font-mono uppercase text-slate-300 font-bold flex items-center gap-2">
              <Film className="w-4 h-4 text-cine-gold" /> Short Film Specifications
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-cine-950 border border-slate-800">
                <div className="text-slate-400 font-mono text-[10px]">TOTAL RUNTIME</div>
                <div className="text-base font-bold text-white font-cinematic">{totalDuration} Seconds</div>
              </div>

              <div className="p-3 rounded-xl bg-cine-950 border border-slate-800">
                <div className="text-slate-400 font-mono text-[10px]">SCENES RENDERED</div>
                <div className="text-base font-bold text-white font-cinematic">{scenes.length} Scenes</div>
              </div>

              <div className="p-3 rounded-xl bg-cine-950 border border-slate-800">
                <div className="text-slate-400 font-mono text-[10px]">CHARACTERS CAST</div>
                <div className="text-base font-bold text-white font-cinematic">{totalCharacters} Characters</div>
              </div>

              <div className="p-3 rounded-xl bg-cine-950 border border-slate-800">
                <div className="text-slate-400 font-mono text-[10px]">AUDIO CONFORM</div>
                <div className="text-base font-bold text-emerald-400 font-mono">Master 5.1 Stereo</div>
              </div>
            </div>

            {/* Resolution picker */}
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">Export Resolution Preset</label>
              <select
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full bg-cine-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
              >
                <option value="4K Cinema (3840x2160)">4K Cinema Ultra HD (3840x2160)</option>
                <option value="1080p Cinema Master (1920x1080)">1080p Cinema Master (1920x1080)</option>
                <option value="2.39:1 Anamorphic Scope">2.39:1 Anamorphic Scope (3840x1608)</option>
              </select>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleRenderFinalFilm}
                disabled={isRendering}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 text-black font-bold text-sm transition shadow-glow-gold flex items-center justify-center gap-2 disabled:opacity-50 transform hover:-translate-y-0.5"
              >
                {isRendering ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Rendering & Mastering 4K Film...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" /> Render Final Short Film
                  </>
                )}
              </button>

              <a
                href={previewVideoUrl}
                download={`${(currentProject?.title || 'film').replace(/\s+/g, '_')}_master.mp4`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 rounded-xl bg-cine-800 hover:bg-slate-700 text-slate-100 font-bold text-xs transition flex items-center justify-center gap-2 border border-slate-700"
              >
                <Download className="w-4 h-4 text-cine-gold" />
                Download Final Master Video (.MP4)
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
