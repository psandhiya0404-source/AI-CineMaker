import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useGeneration } from '../../context/GenerationContext';
import { aiApi } from '../../api';
import { SAMPLE_STORIES } from '../../utils/sampleStories';
import {
  FileText,
  Sparkles,
  Save,
  Users,
  Film,
  ArrowRight,
  Layers,
  MapPin,
  Clock,
  Heart,
  Loader2,
  CheckCircle2,
  BookOpen,
} from 'lucide-react';

export const StoryStudioPage = () => {
  const { currentProject, projects, selectProject, updateProject, refreshCurrentProject } = useProject();
  const { trackJob, addToast } = useGeneration();
  const navigate = useNavigate();

  const [storyTitle, setStoryTitle] = useState('');
  const [storyContent, setStoryContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // If no current project, auto-select first project or navigate to new project
    if (!currentProject) {
      if (projects.length > 0) {
        selectProject(projects[0]._id);
      }
    } else {
      setStoryTitle(currentProject.story?.title || currentProject.title || '');
      setStoryContent(currentProject.story?.content || SAMPLE_STORIES[0].content);
    }
  }, [currentProject, projects, selectProject]);

  const handleSaveStory = async () => {
    if (!currentProject?._id) return;
    setIsSaving(true);
    try {
      await updateProject(currentProject._id, {
        story: {
          ...currentProject.story,
          title: storyTitle,
          content: storyContent,
        },
      });
      addToast('Story screenplay saved successfully', 'success');
    } catch (err) {
      addToast('Failed to save story: ' + err.message, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnalyzeStory = async (autoEntities = true) => {
    if (!currentProject?._id) return;
    if (!storyContent.trim()) {
      addToast('Please type or paste your story text first', 'error');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await aiApi.analyzeStory({
        projectId: currentProject._id,
        storyTitle: storyTitle || currentProject.title,
        storyContent: storyContent,
        autoGenerateEntities: autoEntities,
      });

      const jobId = res.data.jobId;
      trackJob(jobId, 'AI Story & Character Breakdown', async () => {
        await refreshCurrentProject();
        addToast('Story analyzed! Characters and scenes generated.', 'success');
        setIsAnalyzing(false);
      });
    } catch (err) {
      addToast('Story analysis failed: ' + err.message, 'error');
      setIsAnalyzing(false);
    }
  };

  const handleLoadSample = (sample) => {
    setStoryTitle(sample.title);
    setStoryContent(sample.content);
    addToast(`Loaded screenplay: "${sample.title}"`, 'info');
  };

  const analysisData = currentProject?.story?.analysisData;

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-cine-900 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cine-gold/20 text-cine-gold border border-cine-gold/30 text-xs font-mono font-medium mb-2">
            <FileText className="w-3.5 h-3.5" /> STEP 01 • STORY STUDIO
          </div>
          <h1 className="font-cinematic text-2xl sm:text-3xl font-extrabold text-white">
            Screenplay & Narrative Studio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Write or paste your story. The AI engine will parse characters, scene setups, dialogues, and camera directions.
          </p>
        </div>

        {/* Quick Sample Loaders */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400">Load Script:</span>
          {SAMPLE_STORIES.map((sample) => (
            <button
              key={sample.title}
              onClick={() => handleLoadSample(sample)}
              className="px-3 py-1.5 rounded-xl bg-cine-950 border border-slate-700 hover:border-cine-gold/60 text-slate-300 hover:text-white text-xs font-mono transition"
            >
              📜 {sample.title} ({sample.genre})
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor Section (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-4">
            {/* Story Title & Meta */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Story / Screenplay Title
                </label>
                <input
                  type="text"
                  value={storyTitle}
                  onChange={(e) => setStoryTitle(e.target.value)}
                  placeholder="The Midnight Cipher"
                  className="w-full bg-cine-950 border border-slate-700 focus:border-cine-gold/80 rounded-xl px-4 py-2.5 text-sm text-white font-semibold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase text-slate-400 mb-1">
                  Genre & Style
                </label>
                <div className="px-3.5 py-2.5 rounded-xl bg-cine-950 border border-slate-800 text-xs font-mono text-cine-gold truncate">
                  {currentProject?.genre || 'Thriller'} • {currentProject?.visualStyle || 'Photorealistic'}
                </div>
              </div>
            </div>

            {/* Story Textarea */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-[11px] font-mono uppercase text-slate-400">
                  Full Screenplay Content (Scene headers, action, dialogue)
                </label>
                <span className="text-[11px] font-mono text-slate-500">
                  {storyContent.length} characters • ~{Math.ceil(storyContent.split(' ').length / 150)} min read
                </span>
              </div>
              <textarea
                rows={16}
                value={storyContent}
                onChange={(e) => setStoryContent(e.target.value)}
                placeholder="Paste or write your story script here...

SCENE 1 - INTERIOR DETECTIVE OFFICE - NIGHT
Rain lashes against the tall glass pane. Detective Vikram sits under the amber desk lamp..."
                className="w-full bg-cine-950 border border-slate-700 focus:border-cine-gold/80 rounded-xl p-4 text-xs sm:text-sm text-slate-200 font-mono focus:outline-none leading-relaxed resize-y"
              />
            </div>

            {/* Action Bar */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
              <button
                type="button"
                onClick={handleSaveStory}
                disabled={isSaving}
                className="px-4 py-2.5 rounded-xl bg-cine-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-cine-gold" />}
                Save Story
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAnalyzeStory(true)}
                  disabled={isAnalyzing}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 hover:to-cine-gold text-black font-bold text-xs transition shadow-glow-gold flex items-center gap-2 disabled:opacity-50 transform hover:-translate-y-0.5"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Analyzing Story...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Analyze Story & Build Characters
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Story Analysis & Breakdown Sidebar (1 col) */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-cine-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cine-gold" /> AI Screenplay Breakdown
            </h3>

            {analysisData ? (
              <div className="space-y-4 animate-fade-in text-xs">
                {/* Cinematic Logline */}
                <div className="p-3.5 rounded-xl bg-cine-950 border border-slate-800 space-y-1">
                  <div className="font-mono text-[10px] text-cine-gold uppercase font-bold">Logline / Premise</div>
                  <p className="text-slate-300 leading-relaxed">{analysisData.summary}</p>
                </div>

                {/* Identified Characters */}
                <div className="space-y-2">
                  <div className="font-mono text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-cine-gold" /> Identified Characters</span>
                    <span className="text-cine-gold font-mono">{analysisData.characters?.length || 0}</span>
                  </div>
                  <div className="space-y-1.5">
                    {analysisData.characters?.map((c, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-cine-950 border border-slate-800 flex items-center justify-between">
                        <div>
                          <span className="font-bold text-white">{c.name}</span>
                          <span className="text-[11px] text-slate-400 ml-2">({c.age}yo • {c.role})</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-cine-900 text-cine-gold text-[10px] font-mono">
                          {c.gender}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deconstructed Scenes */}
                <div className="space-y-2">
                  <div className="font-mono text-[10px] text-slate-400 uppercase font-bold flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><Film className="w-3.5 h-3.5 text-cine-cyan" /> Scene Sequence</span>
                    <span className="text-cine-cyan font-mono">{analysisData.scenes?.length || 0} Scenes</span>
                  </div>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {analysisData.scenes?.map((s, i) => (
                      <div key={i} className="p-2 rounded-xl bg-cine-950 border border-slate-800 text-[11px]">
                        <div className="font-bold text-white truncate">{s.title || `Scene ${s.sceneNumber}`}</div>
                        <div className="text-slate-400 flex items-center gap-2 mt-0.5 text-[10px]">
                          <span>{s.location}</span>
                          <span>•</span>
                          <span className="text-cine-gold font-mono">{s.timeOfDay}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Next Step CTA */}
                <button
                  type="button"
                  onClick={() => navigate('/studio/characters')}
                  className="w-full py-2.5 rounded-xl bg-cine-gold text-black font-bold text-xs transition shadow-glow-gold flex items-center justify-center gap-2"
                >
                  Review Character System <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="p-8 rounded-xl bg-cine-950/60 border border-dashed border-slate-800 text-center space-y-3">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-xs text-slate-400 leading-relaxed">
                  Click <strong className="text-cine-gold">"Analyze Story"</strong> to extract characters, emotional arcs, and scene breakdowns automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
