import React, { useState, useEffect } from 'react';
import { jobApi } from '../../api';
import { useProject } from '../../context/ProjectContext';
import {
  History,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  ExternalLink,
  Film,
  Sparkles,
  RefreshCw,
  Search,
} from 'lucide-react';

export const GenerationHistoryPage = () => {
  const { currentProject } = useProject();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await jobApi.getAll(currentProject?._id);
      setJobs(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [currentProject]);

  const filteredJobs = jobs.filter((j) => {
    return (
      (j.prompt || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.generationType || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.provider || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-2xl bg-cine-900 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cine-gold/20 text-cine-gold border border-cine-gold/30 text-xs font-mono font-medium mb-2">
            <History className="w-3.5 h-3.5" /> AUDIT LOG
          </div>
          <h1 className="font-cinematic text-2xl sm:text-3xl font-extrabold text-white">
            AI Generation Queue & History
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete record of all multi-modal requests, neural models, progress timestamps, and generated assets.
          </p>
        </div>

        <button
          onClick={fetchJobs}
          className="px-4 py-2 rounded-xl bg-cine-950 border border-slate-700 hover:border-cine-gold text-slate-300 hover:text-white text-xs font-mono transition flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Log
        </button>
      </div>

      {/* Search Filter */}
      <div className="p-4 rounded-2xl bg-cine-900 border border-slate-800">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filter jobs by prompt, model, or type..."
            className="w-full bg-cine-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Jobs Table */}
      <div className="rounded-2xl bg-cine-900 border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-12 text-center text-slate-400 flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin text-cine-gold" /> Loading generation history...
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <History className="w-10 h-10 text-slate-600 mx-auto" />
            <h4 className="text-sm font-bold text-white">No Generation Jobs Logged</h4>
            <p className="text-xs text-slate-500">Run tasks in Story, Character, or Scene Studios to generate assets.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-cine-950 text-slate-400 font-mono text-[10px] uppercase">
                  <th className="p-4">Type</th>
                  <th className="p-4">Provider / Engine</th>
                  <th className="p-4">Prompt Description</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Date</th>
                  <th className="p-4 text-right">Asset</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredJobs.map((job) => (
                  <tr key={job._id} className="hover:bg-slate-800/30 transition">
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-cine-950 text-cine-gold font-mono text-[10px] uppercase border border-slate-800">
                        {job.generationType}
                      </span>
                    </td>
                    <td className="p-4 font-mono text-slate-300">{job.provider}</td>
                    <td className="p-4 text-slate-300 max-w-xs truncate">{job.prompt || 'Cinematic generation request'}</td>
                    <td className="p-4">
                      {job.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-mono text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 100% DONE
                        </span>
                      ) : job.status === 'failed' ? (
                        <span className="inline-flex items-center gap-1 text-rose-400 font-mono text-[11px]">
                          <AlertTriangle className="w-3.5 h-3.5" /> FAILED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-mono text-[11px]">
                          <Loader2 className="w-3.5 h-3.5 animate-spin" /> {job.progress}%
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-mono text-slate-400">
                      {new Date(job.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="p-4 text-right">
                      {job.resultUrl ? (
                        <a
                          href={job.resultUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-cine-gold hover:underline font-mono text-[11px]"
                        >
                          View Output <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-slate-600 font-mono">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
