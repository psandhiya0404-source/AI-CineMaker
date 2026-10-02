import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { useGeneration } from '../../context/GenerationContext';
import {
  Film,
  Plus,
  Users,
  Video,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle2,
  FolderOpen,
  PlayCircle,
  Activity,
  Layers,
} from 'lucide-react';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { projects, fetchProjects, selectProject } = useProject();
  const { activeJobs } = useGeneration();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const totalCharacters = projects.reduce((acc, p) => acc + (p.characterCount || 0), 0);
  const totalScenes = projects.reduce((acc, p) => acc + (p.sceneCount || 0), 0);
  const draftProjects = projects.filter((p) => p.status === 'Draft' || p.status === 'Processing');
  const completedProjects = projects.filter((p) => p.status === 'Completed' || p.status === 'Ready');

  const handleOpenProject = async (projectId) => {
    await selectProject(projectId);
    navigate('/studio/story');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative rounded-3xl p-8 bg-gradient-to-r from-cine-900 via-cine-850 to-cine-800 border border-slate-700/80 overflow-hidden shadow-2xl">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cine-gold/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cine-gold/20 text-cine-gold border border-cine-gold/30 text-xs font-mono font-medium mb-3">
              <Sparkles className="w-3.5 h-3.5" /> DIRECTOR CONTROL DECK
            </div>
            <h1 className="font-cinematic text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
              Welcome back, <span className="text-cine-gold">{user?.name || 'Filmmaker'}</span>
            </h1>
            <p className="text-sm text-slate-300 mt-2 max-w-xl leading-relaxed">
              Transform written stories into realistic live-action cinematic short films with locked character consistency and neural audio.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/projects/new"
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 hover:to-cine-gold text-black font-bold text-sm transition shadow-glow-gold flex items-center gap-2 transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" /> Create New Film
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-cine-900/90 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cine-gold/10 text-cine-gold border border-cine-gold/20 flex items-center justify-center flex-shrink-0">
            <Film className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-cinematic font-bold text-white">{projects.length}</div>
            <div className="text-xs text-slate-400">Total Film Projects</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-cine-900/90 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cine-cyan border border-cyan-500/20 flex items-center justify-center flex-shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-cinematic font-bold text-white">{totalCharacters}</div>
            <div className="text-xs text-slate-400">Characters Created</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-cine-900/90 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-cinematic font-bold text-white">{totalScenes}</div>
            <div className="text-xs text-slate-400">Scenes Deconstructed</div>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-cine-900/90 border border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-cinematic font-bold text-white">{completedProjects.length}</div>
            <div className="text-xs text-slate-400">Completed Masters</div>
          </div>
        </div>
      </div>

      {/* Active Background Jobs (if any) */}
      {activeJobs.length > 0 && (
        <div className="p-5 rounded-2xl bg-cine-900 border border-cine-gold/30 shadow-glow-gold space-y-3">
          <div className="flex items-center justify-between text-xs font-mono uppercase text-cine-gold font-bold">
            <span className="flex items-center gap-2">
              <Activity className="w-4 h-4 animate-spin" /> Live Cinematic Pipeline Tasks
            </span>
            <span>{activeJobs.filter((j) => j.status === 'processing').length} Running</span>
          </div>
          <div className="space-y-2">
            {activeJobs.map((job) => (
              <div key={job.jobId} className="flex items-center justify-between p-3 rounded-xl bg-cine-950 border border-slate-800 text-xs">
                <span className="font-semibold text-white truncate">{job.title}</span>
                <span className="text-slate-400">{job.statusMessage}</span>
                <span className="font-mono text-cine-gold">{job.progress}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-cinematic text-lg font-bold text-white tracking-wide">
              Recent Film Productions
            </h3>
            <p className="text-xs text-slate-400">Select a film to enter the creation pipeline</p>
          </div>
          <Link
            to="/projects"
            className="text-xs font-semibold text-cine-gold hover:underline flex items-center gap-1"
          >
            View All ({projects.length}) <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {projects.length === 0 ? (
          <div className="p-12 rounded-3xl bg-cine-900/60 border border-dashed border-slate-700/80 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-cine-gold/10 text-cine-gold border border-cine-gold/20 flex items-center justify-center mx-auto">
              <Film className="w-8 h-8" />
            </div>
            <h4 className="text-base font-bold text-white">No Film Projects Created Yet</h4>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Start by typing or pasting your screenplay. AI CineMaker will extract characters, construct scene setups, and render realistic live action footage.
            </p>
            <Link
              to="/projects/new"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 text-black font-bold text-xs shadow-glow-gold"
            >
              <Plus className="w-4 h-4" /> Start First Film
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 6).map((project) => (
              <div
                key={project._id}
                className="group rounded-2xl bg-cine-900 border border-slate-800 hover:border-cine-gold/50 transition-all duration-300 overflow-hidden shadow-xl hover:shadow-glow-gold flex flex-col justify-between"
              >
                <div>
                  {/* Thumbnail / Aspect Banner */}
                  <div className="relative h-44 w-full overflow-hidden bg-black">
                    <img
                      src={project.thumbnail || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-85"
                    />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                        project.status === 'Completed' ? 'bg-emerald-500/80 text-white' :
                        project.status === 'Processing' ? 'bg-amber-500/80 text-black animate-pulse' :
                        'bg-cine-950/80 text-slate-300 border border-slate-700'
                      }`}>
                        {project.status}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-black/70 text-cine-gold text-[10px] font-mono font-semibold border border-cine-gold/30">
                        {project.genre}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/70 text-slate-300 text-[10px] font-mono">
                        {project.visualStyle}
                      </span>
                    </div>
                  </div>

                  {/* Project Info */}
                  <div className="p-5 space-y-2">
                    <h4 className="text-base font-bold text-white group-hover:text-cine-gold transition truncate">
                      {project.title}
                    </h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {project.description || 'A realistic cinematic short film story.'}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-cine-gold" /> {project.characterCount || 0} Characters
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Film className="w-3.5 h-3.5 text-cine-cyan" /> {project.sceneCount || 0} Scenes
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleOpenProject(project._id)}
                    className="w-full py-2.5 rounded-xl bg-cine-800 hover:bg-cine-gold hover:text-black text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2"
                  >
                    <FolderOpen className="w-3.5 h-3.5" /> Open Production Studio
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
