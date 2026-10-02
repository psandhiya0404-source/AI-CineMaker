import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import {
  Film,
  Plus,
  Users,
  Search,
  Filter,
  Trash2,
  FolderOpen,
  Calendar,
  Clock,
} from 'lucide-react';

export const ProjectsListPage = () => {
  const { projects, fetchProjects, selectProject, deleteProject } = useProject();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.genre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || p.status.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpen = async (projectId) => {
    await selectProject(projectId);
    navigate('/studio/story');
  };

  const handleDelete = async (e, projectId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this film project and all its generated scenes and characters?')) {
      await deleteProject(projectId);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cinematic text-2xl sm:text-3xl font-extrabold text-white">
            Film Productions Library
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your screenplay archives, cinematic drafts, and finalized masters.
          </p>
        </div>
        <Link
          to="/projects/new"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 hover:to-cine-gold text-black font-bold text-xs transition shadow-glow-gold flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> New Film Project
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-cine-900 border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by title or genre..."
            className="w-full bg-cine-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-cine-gold/80"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          {['ALL', 'DRAFT', 'PROCESSING', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition ${
                statusFilter === status
                  ? 'bg-cine-gold text-black shadow-glow-gold'
                  : 'bg-cine-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="p-16 rounded-2xl bg-cine-900/40 border border-dashed border-slate-800 text-center space-y-3">
          <Film className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-white">No Matching Film Projects Found</h4>
          <p className="text-xs text-slate-400">Try adjusting your search criteria or create a new screenplay.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project._id}
              onClick={() => handleOpen(project._id)}
              className="group cursor-pointer rounded-2xl bg-cine-900 border border-slate-800 hover:border-cine-gold/50 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-glow-gold flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-black overflow-hidden">
                  <img
                    src={project.thumbnail || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80'}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500 opacity-80"
                  />
                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      project.status === 'Completed' ? 'bg-emerald-500 text-white' :
                      project.status === 'Processing' ? 'bg-amber-500 text-black' :
                      'bg-cine-950/90 text-slate-300 border border-slate-700'
                    }`}>
                      {project.status}
                    </span>
                    <button
                      onClick={(e) => handleDelete(e, project._id)}
                      title="Delete Project"
                      className="p-1.5 rounded-lg bg-black/70 text-slate-400 hover:text-rose-400 hover:bg-rose-950/80 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
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

                <div className="p-5 space-y-2">
                  <h4 className="text-base font-bold text-white group-hover:text-cine-gold transition truncate">
                    {project.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>

                  <div className="pt-3 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-cine-gold" /> {project.characterCount || 0} Characters
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Film className="w-3.5 h-3.5 text-cine-cyan" /> {project.sceneCount || 0} Scenes
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="w-full py-2.5 rounded-xl bg-cine-800 group-hover:bg-cine-gold group-hover:text-black text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2">
                  <FolderOpen className="w-3.5 h-3.5" /> Open Studio
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
