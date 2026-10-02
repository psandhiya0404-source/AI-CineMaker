import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProject } from '../../context/ProjectContext';
import { Film, Clapperboard, Plus, ChevronDown, User, LogOut, Settings, Sparkles } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const { projects, currentProject, selectProject } = useProject();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-cine-900/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 flex items-center justify-between">
      {/* Brand Logo */}
      <div className="flex items-center gap-6">
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cine-gold to-amber-600 flex items-center justify-center text-black font-black shadow-glow-gold transition-transform group-hover:scale-105">
            <Film className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="font-cinematic text-lg font-bold tracking-wider text-white flex items-center gap-1.5">
              AI CINEMAKER
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-cine-gold/20 text-cine-gold border border-cine-gold/30">PRO</span>
            </span>
          </div>
        </Link>

        {/* Project Selector Dropdown */}
        {projects.length > 0 && (
          <div className="hidden md:flex items-center">
            <div className="relative group">
              <select
                value={currentProject?._id || ''}
                onChange={(e) => {
                  if (e.target.value === 'new') {
                    navigate('/projects/new');
                  } else if (e.target.value) {
                    selectProject(e.target.value);
                  }
                }}
                className="appearance-none bg-cine-950 border border-slate-700/80 hover:border-cine-gold/50 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-medium text-slate-200 focus:outline-none cursor-pointer transition"
              >
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    🎬 {p.title} ({p.genre})
                  </option>
                ))}
                <option value="new">+ Create New Film...</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        )}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <Link
          to="/projects/new"
          className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 hover:to-cine-gold text-black font-semibold text-xs transition shadow-glow-gold"
        >
          <Plus className="w-4 h-4" /> New Film
        </Link>

        {/* User Profile dropdown */}
        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="flex items-center gap-2.5">
            <img
              src={user?.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user?.name || 'User'}`}
              alt={user?.name}
              className="w-8 h-8 rounded-full border border-cine-gold/40 object-cover bg-cine-800"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-semibold text-slate-200">{user?.name || 'Filmmaker'}</div>
              <div className="text-[10px] text-slate-400 font-mono">Director</div>
            </div>
          </div>

          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            title="Sign Out"
            className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
