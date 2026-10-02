import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import {
  LayoutDashboard,
  FolderKanban,
  PlusCircle,
  FileText,
  Users,
  Film,
  Sparkles,
  Mic2,
  SlidersHorizontal,
  Download,
  History,
  Settings,
} from 'lucide-react';

export const Sidebar = () => {
  const { currentProject } = useProject();
  const location = useLocation();

  const mainNav = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Create Film', path: '/projects/new', icon: PlusCircle },
  ];

  const productionWorkflowNav = [
    { name: 'Story Studio', path: '/studio/story', icon: FileText, step: '1' },
    { name: 'Characters', path: '/studio/characters', icon: Users, step: '2' },
    { name: 'Scene Studio', path: '/studio/scenes', icon: Film, step: '3' },
    { name: 'AI Studio', path: '/studio/ai', icon: Sparkles, step: '4' },
    { name: 'Voice Studio', path: '/studio/voice', icon: Mic2, step: '5' },
    { name: 'Video Editor', path: '/studio/editor', icon: SlidersHorizontal, step: '6' },
    { name: 'Final Export', path: '/studio/export', icon: Download, step: '7' },
  ];

  const systemNav = [
    { name: 'Generation History', path: '/history', icon: History },
    { name: 'Settings & APIs', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 flex-shrink-0 bg-cine-900 border-r border-slate-800/80 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* Active Project Card */}
        {currentProject && (
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-cine-800/90 to-cine-900 border border-slate-700/60 shadow-lg">
            <div className="text-[10px] uppercase font-mono tracking-wider text-cine-gold font-bold mb-1 flex items-center justify-between">
              <span>Active Film Project</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <h4 className="text-sm font-bold text-white truncate">{currentProject.title}</h4>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              <span className="px-1.5 py-0.5 rounded bg-cine-950 text-slate-300 font-mono">{currentProject.genre}</span>
              <span>•</span>
              <span className="truncate">{currentProject.visualStyle}</span>
            </div>
          </div>
        )}

        {/* Main Nav */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-2">
            Overview
          </div>
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-cine-gold text-black shadow-glow-gold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-black' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Production Pipeline Nav */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-mono uppercase tracking-wider text-cine-gold/90 font-bold mb-2 flex items-center justify-between">
            <span>Film Pipeline</span>
            <span className="text-[9px] text-slate-400">7 STEPS</span>
          </div>
          {productionWorkflowNav.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-cine-gold/20 to-amber-500/10 text-cine-gold border border-cine-gold/40 shadow-glow-gold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-cine-gold' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isActive ? 'bg-cine-gold text-black font-bold' : 'bg-cine-950 text-slate-400'
                }`}>
                  0{item.step}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* System Nav */}
      <div className="pt-4 border-t border-slate-800/80 space-y-1">
        {systemNav.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-slate-800 text-white border border-slate-700'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4 text-slate-400" />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </aside>
  );
};
