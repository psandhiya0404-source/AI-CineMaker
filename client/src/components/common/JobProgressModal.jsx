import React from 'react';
import { useGeneration } from '../../context/GenerationContext';
import { Film, Loader2, CheckCircle2, AlertTriangle, X, Sparkles, ExternalLink } from 'lucide-react';

export const JobProgressModal = () => {
  const { currentModalJob, closeJobModal } = useGeneration();

  if (!currentModalJob) return null;

  const isCompleted = currentModalJob.status === 'completed';
  const isFailed = currentModalJob.status === 'failed';
  const isRunning = !isCompleted && !isFailed;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-cine-900 border border-slate-700/60 rounded-2xl shadow-2xl p-6 overflow-hidden">
        {/* Glow Header */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cine-gold via-cine-cyan to-indigo-500" />

        {/* Close Button */}
        <button
          onClick={closeJobModal}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className={`p-3 rounded-xl ${
            isCompleted ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
            isFailed ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' :
            'bg-cine-gold/10 text-cine-gold border border-cine-gold/20'
          }`}>
            {isRunning && <Loader2 className="w-6 h-6 animate-spin" />}
            {isCompleted && <CheckCircle2 className="w-6 h-6" />}
            {isFailed && <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white tracking-wide flex items-center gap-2">
              {currentModalJob.title}
              {isRunning && <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-cine-gold/20 text-cine-gold animate-pulse">GENERATING</span>}
            </h3>
            <p className="text-xs text-slate-400">{currentModalJob.provider || 'Cinematic AI Pipeline'}</p>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-300">{currentModalJob.statusMessage || 'Processing cinematic frames...'}</span>
            <span className="font-mono text-cine-gold">{currentModalJob.progress || 0}%</span>
          </div>
          
          {/* Animated Progress Bar */}
          <div className="w-full h-2.5 bg-cine-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isCompleted ? 'bg-emerald-500' :
                isFailed ? 'bg-rose-500' :
                'bg-gradient-to-r from-cine-gold to-amber-500 shadow-glow-gold'
              }`}
              style={{ width: `${Math.max(5, currentModalJob.progress || 0)}%` }}
            />
          </div>
        </div>

        {/* Result Preview if available */}
        {currentModalJob.resultUrl && (
          <div className="mb-6 rounded-xl overflow-hidden border border-slate-800 bg-cine-950/80">
            {currentModalJob.resultUrl.endsWith('.mp4') ? (
              <video
                src={currentModalJob.resultUrl}
                controls
                autoPlay
                loop
                className="w-full max-h-48 object-cover"
              />
            ) : (
              <img
                src={currentModalJob.resultUrl}
                alt="Generated cinematic asset"
                className="w-full max-h-48 object-cover"
              />
            )}
            <div className="p-3 bg-cine-900/90 flex items-center justify-between">
              <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                <Sparkles className="w-3.5 h-3.5" /> Output Ready
              </span>
              <a
                href={currentModalJob.resultUrl}
                target="_blank"
                rel="noreferrer"
                className="text-xs text-cine-gold hover:underline flex items-center gap-1"
              >
                Open Full Asset <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        )}

        {/* Error notice if failed */}
        {isFailed && (
          <div className="mb-6 p-3 rounded-xl bg-rose-950/30 border border-rose-800/40 text-rose-300 text-xs">
            {currentModalJob.error || 'Generation pipeline encountered an unexpected error.'}
          </div>
        )}

        {/* Footer Buttons */}
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={closeJobModal}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium transition"
          >
            {isRunning ? 'Run in Background' : 'Dismiss'}
          </button>
        </div>
      </div>
    </div>
  );
};
