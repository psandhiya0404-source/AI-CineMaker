import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useGeneration } from '../../context/GenerationContext';
import { aiApi } from '../../api';
import {
  Film,
  Plus,
  Sparkles,
  Video,
  Camera,
  Edit,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Clock,
  MapPin,
  Users,
  MessageSquare,
  Play,
  ArrowRight,
  Layers,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

export const SceneStudioPage = () => {
  const { currentProject, characters, scenes, addScene, updateScene, deleteScene, reorderScenes, refreshCurrentProject } = useProject();
  const { trackJob, addToast } = useGeneration();
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingScene, setEditingScene] = useState(null);
  const [generatingSceneId, setGeneratingSceneId] = useState(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formLocation, setFormLocation] = useState('Interior Detective Office');
  const [formTimeOfDay, setFormTimeOfDay] = useState('Night');
  const [formCharacterIds, setFormCharacterIds] = useState([]);
  const [formAction, setFormAction] = useState('Vikram examines an old photograph while rain lashes against the glass.');
  const [formDialogueSpeaker, setFormDialogueSpeaker] = useState('');
  const [formDialogueText, setFormDialogueText] = useState('This timeline doesn’t make sense.');
  const [formEmotion, setFormEmotion] = useState('Suspenseful Intrigue');
  const [formCameraShot, setFormCameraShot] = useState('Medium Close-Up');
  const [formCameraMovement, setFormCameraMovement] = useState('Slow Push-In');
  const [formLighting, setFormLighting] = useState('Low-key warm desk light with blue rain reflections');
  const [formDuration, setFormDuration] = useState(4);

  const openCreateModal = () => {
    setEditingScene(null);
    setFormTitle(`Scene ${scenes.length + 1 < 10 ? '0' + (scenes.length + 1) : scenes.length + 1}`);
    setFormLocation('Interior Detective Office');
    setFormTimeOfDay('Night');
    setFormCharacterIds(characters.length > 0 ? [characters[0]._id] : []);
    setFormAction('Vikram reviews surveillance footage under a flickering desk lamp.');
    setFormDialogueSpeaker(characters[0]?.name || 'Vikram');
    setFormDialogueText('Someone altered the logs before the fire.');
    setFormEmotion('Suspenseful');
    setFormCameraShot('Medium Close-Up');
    setFormCameraMovement('Slow Push-In');
    setFormLighting('Low-key moody tungsten lighting');
    setFormDuration(4);
    setIsModalOpen(true);
  };

  const openEditModal = (scene) => {
    setEditingScene(scene);
    setFormTitle(scene.title || `Scene ${scene.sceneNumber}`);
    setFormLocation(scene.location || '');
    setFormTimeOfDay(scene.timeOfDay || 'Night');
    setFormCharacterIds(scene.characterIds || []);
    setFormAction(scene.action || '');
    setFormDialogueSpeaker(scene.dialogue?.speaker || '');
    setFormDialogueText(scene.dialogue?.text || '');
    setFormEmotion(scene.emotion || 'Suspenseful');
    setFormCameraShot(scene.camera?.shot || 'Medium Close-Up');
    setFormCameraMovement(scene.camera?.movement || 'Slow Push-In');
    setFormLighting(scene.lighting || '');
    setFormDuration(scene.duration || 4);
    setIsModalOpen(true);
  };

  const handleSaveScene = async (e) => {
    e.preventDefault();
    const payload = {
      title: formTitle,
      location: formLocation,
      timeOfDay: formTimeOfDay,
      characterIds: formCharacterIds,
      action: formAction,
      dialogue: {
        speaker: formDialogueSpeaker,
        text: formDialogueText,
      },
      emotion: formEmotion,
      camera: {
        shot: formCameraShot,
        movement: formCameraMovement,
      },
      lighting: formLighting,
      duration: Number(formDuration),
    };

    if (editingScene) {
      await updateScene(editingScene._id, payload);
      addToast('Scene updated successfully', 'success');
    } else {
      await addScene(payload);
      addToast('New scene added to screenplay', 'success');
    }
    setIsModalOpen(false);
  };

  // Move scene order
  const handleMove = async (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= scenes.length) return;

    const newScenes = [...scenes];
    const temp = newScenes[index];
    newScenes[index] = newScenes[targetIndex];
    newScenes[targetIndex] = temp;

    const ids = newScenes.map((s) => s._id);
    await reorderScenes(ids);
  };

  // Generate Scene Image with Character Consistency
  const handleGenerateImage = async (scene) => {
    setGeneratingSceneId(scene._id);
    try {
      const res = await aiApi.generateSceneImage({
        sceneId: scene._id,
        projectId: currentProject._id,
      });

      trackJob(res.data.jobId, `Rendering Scene ${scene.sceneNumber} 35mm Frame`, async () => {
        await refreshCurrentProject();
        setGeneratingSceneId(null);
        addToast(`Scene ${scene.sceneNumber} frame rendered!`, 'success');
      });
    } catch (err) {
      addToast('Failed to generate frame: ' + err.message, 'error');
      setGeneratingSceneId(null);
    }
  };

  // Generate Video Clip for Scene
  const handleGenerateVideo = async (scene) => {
    setGeneratingSceneId(scene._id);
    try {
      const res = await aiApi.generateVideo({
        sceneId: scene._id,
        duration: scene.duration || 4,
      });

      trackJob(res.data.jobId, `Generating Scene ${scene.sceneNumber} Video Clip`, async () => {
        await refreshCurrentProject();
        setGeneratingSceneId(null);
        addToast(`Scene ${scene.sceneNumber} video clip ready!`, 'success');
      });
    } catch (err) {
      addToast('Failed to generate video: ' + err.message, 'error');
      setGeneratingSceneId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-cine-900 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cine-gold/20 text-cine-gold border border-cine-gold/30 text-xs font-mono font-medium mb-2">
            <Film className="w-3.5 h-3.5" /> STEP 03 • SCENE STUDIO
          </div>
          <h1 className="font-cinematic text-2xl sm:text-3xl font-extrabold text-white">
            Cinematic Scene Breakdown & Shots
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure camera shots, lighting conditions, action cues, and character assignments for every scene.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 hover:to-cine-gold text-black font-bold text-xs transition shadow-glow-gold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Scene
          </button>
        </div>
      </div>

      {/* Scenes List */}
      {scenes.length === 0 ? (
        <div className="p-16 rounded-2xl bg-cine-900/50 border border-dashed border-slate-800 text-center space-y-4">
          <Film className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Scenes In This Screenplay</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Analyze your story in Story Studio to generate scenes automatically, or add custom scenes manually.
          </p>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-cine-gold text-black font-bold text-xs shadow-glow-gold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add First Scene
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {scenes.map((scene, index) => {
            const isGenerating = generatingSceneId === scene._id;
            const sceneCharacters = characters.filter((c) =>
              (scene.characterIds || []).some((id) => id.toString() === c._id.toString())
            );

            return (
              <div
                key={scene._id}
                className="rounded-2xl bg-cine-900 border border-slate-800 hover:border-cine-gold/40 transition-all duration-300 overflow-hidden shadow-xl"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                  {/* Visual Frame / Media Area (4 cols) */}
                  <div className="lg:col-span-4 bg-black relative min-h-[220px] flex items-center justify-center overflow-hidden group">
                    {scene.videoUrl ? (
                      <video
                        src={scene.videoUrl}
                        controls
                        className="w-full h-full object-cover max-h-72"
                      />
                    ) : scene.imageUrl ? (
                      <img
                        src={scene.imageUrl}
                        alt={scene.title}
                        className="w-full h-full object-cover max-h-72 group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="p-8 text-center space-y-2">
                        <Camera className="w-10 h-10 text-slate-600 mx-auto" />
                        <span className="text-[11px] font-mono text-slate-500 block">No Frame Rendered Yet</span>
                      </div>
                    )}

                    {/* Scene Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg bg-black/80 text-cine-gold text-xs font-mono font-bold border border-cine-gold/40 shadow-md">
                        SCENE {scene.sceneNumber < 10 ? '0' + scene.sceneNumber : scene.sceneNumber}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/80 text-slate-300 text-[10px] font-mono flex items-center gap-1">
                        <Clock className="w-3 h-3 text-cine-gold" /> {scene.duration || 4}s
                      </span>
                    </div>

                    {/* Status badge */}
                    <div className="absolute bottom-3 right-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-bold ${
                        scene.videoUrl ? 'bg-emerald-950/90 text-emerald-400 border border-emerald-500/50' :
                        scene.imageUrl ? 'bg-cyan-950/90 text-cyan-400 border border-cyan-500/50' :
                        'bg-cine-950/90 text-slate-400 border border-slate-700'
                      }`}>
                        {scene.status}
                      </span>
                    </div>
                  </div>

                  {/* Scene Details & Controls (8 cols) */}
                  <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      {/* Header Row */}
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-base font-bold text-white tracking-wide">
                            {scene.title || `Scene ${scene.sceneNumber}`}
                          </h3>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1 text-slate-300">
                              <MapPin className="w-3.5 h-3.5 text-cine-gold" /> {scene.location}
                            </span>
                            <span>•</span>
                            <span className="text-cine-cyan font-mono font-semibold">{scene.timeOfDay}</span>
                            <span>•</span>
                            <span className="text-indigo-300">{scene.emotion}</span>
                          </div>
                        </div>

                        {/* Order & Edit buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleMove(index, -1)}
                            disabled={index === 0}
                            title="Move Up"
                            className="p-1.5 rounded-lg bg-cine-950 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMove(index, 1)}
                            disabled={index === scenes.length - 1}
                            title="Move Down"
                            className="p-1.5 rounded-lg bg-cine-950 hover:bg-slate-800 text-slate-400 hover:text-white disabled:opacity-30"
                          >
                            <ChevronDown className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => openEditModal(scene)}
                            title="Edit Scene"
                            className="p-1.5 rounded-lg bg-cine-950 hover:bg-slate-800 text-slate-400 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`Delete Scene ${scene.sceneNumber}?`)) {
                                deleteScene(scene._id);
                              }
                            }}
                            title="Delete Scene"
                            className="p-1.5 rounded-lg bg-cine-950 hover:bg-rose-950 text-slate-400 hover:text-rose-400"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Characters in Scene */}
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono text-slate-500 uppercase">Cast:</span>
                        {sceneCharacters.length > 0 ? (
                          <div className="flex items-center gap-2">
                            {sceneCharacters.map((c) => (
                              <span
                                key={c._id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-cine-950 border border-slate-700 text-slate-300 text-xs"
                              >
                                {c.referenceImage ? (
                                  <img src={c.referenceImage} alt={c.name} className="w-3.5 h-3.5 rounded-full object-cover" />
                                ) : (
                                  <Users className="w-3 h-3 text-cine-gold" />
                                )}
                                <strong className="text-white">{c.name}</strong>
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500 italic">No characters assigned</span>
                        )}
                      </div>

                      {/* Action description */}
                      <div className="p-3 rounded-xl bg-cine-950/80 border border-slate-800/80 text-xs text-slate-200 leading-relaxed">
                        <strong className="text-slate-400 font-mono text-[10px] uppercase block mb-1">Action Cue</strong>
                        {scene.action}
                      </div>

                      {/* Dialogue if present */}
                      {scene.dialogue?.text && (
                        <div className="p-3 rounded-xl bg-cine-950/80 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
                          <MessageSquare className="w-4 h-4 text-cine-gold flex-shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-cine-gold uppercase font-mono text-[11px]">
                              {scene.dialogue.speaker || 'Character'}:
                            </span>{' '}
                            <span className="italic">"{scene.dialogue.text}"</span>
                          </div>
                        </div>
                      )}

                      {/* Camera & Lighting Specs */}
                      <div className="grid grid-cols-2 gap-3 text-[11px] text-slate-400 pt-1">
                        <div>
                          <strong className="text-slate-500 font-mono">Camera: </strong>
                          {scene.camera?.shot || 'Medium Shot'}, {scene.camera?.movement || 'Static'}
                        </div>
                        <div>
                          <strong className="text-slate-500 font-mono">Lighting: </strong>
                          <span className="truncate">{scene.lighting || 'Cinematic Lighting'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Scene Generation Actions */}
                    <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-[11px] text-slate-400 font-mono">
                        Prompt Character Consistency: <span className="text-emerald-400 font-bold">ACTIVE</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleGenerateImage(scene)}
                          disabled={isGenerating}
                          className="px-4 py-2 rounded-xl bg-cine-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition flex items-center gap-1.5 border border-slate-700 disabled:opacity-50"
                        >
                          <Camera className="w-3.5 h-3.5 text-cine-gold" />
                          {scene.imageUrl ? 'Regenerate Frame' : 'Generate 35mm Frame'}
                        </button>
                        <button
                          onClick={() => handleGenerateVideo(scene)}
                          disabled={isGenerating}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 text-black font-bold text-xs transition shadow-glow-gold flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <Video className="w-3.5 h-3.5" />
                          {scene.videoUrl ? 'Regenerate Video' : 'Generate 24fps Video'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Next Step CTA */}
      {scenes.length > 0 && (
        <div className="pt-6 flex justify-end gap-3">
          <button
            onClick={() => navigate('/studio/ai')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 text-black font-bold text-xs shadow-glow-gold flex items-center gap-2"
          >
            Go to AI Generation Studio <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Scene Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-cine-900 border border-slate-700 rounded-2xl shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="font-cinematic text-xl font-bold text-white mb-1">
              {editingScene ? `Edit Scene ${editingScene.sceneNumber}` : 'Create New Screenplay Scene'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Configure camera direction, characters, lighting, action, and dialogue.
            </p>

            <form onSubmit={handleSaveScene} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Scene Title</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Scene 01: The Investigation"
                    className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cine-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Duration (Seconds)</label>
                  <input
                    type="number"
                    min={2}
                    max={30}
                    value={formDuration}
                    onChange={(e) => setFormDuration(e.target.value)}
                    className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Interior Detective Office"
                    className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Time of Day</label>
                  <select
                    value={formTimeOfDay}
                    onChange={(e) => setFormTimeOfDay(e.target.value)}
                    className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  >
                    <option value="Dawn">Dawn</option>
                    <option value="Morning">Morning</option>
                    <option value="Noon">Noon</option>
                    <option value="Golden Hour">Golden Hour</option>
                    <option value="Dusk">Dusk</option>
                    <option value="Night">Night</option>
                    <option value="Midnight">Midnight</option>
                  </select>
                </div>
              </div>

              {/* Characters Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Cast Characters in this Scene
                </label>
                <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-cine-950 border border-slate-800">
                  {characters.map((char) => {
                    const isSelected = formCharacterIds.includes(char._id);
                    return (
                      <button
                        key={char._id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setFormCharacterIds(formCharacterIds.filter((id) => id !== char._id));
                          } else {
                            setFormCharacterIds([...formCharacterIds, char._id]);
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-cine-gold text-black shadow-glow-gold'
                            : 'bg-cine-900 text-slate-400 hover:text-white border border-slate-700'
                        }`}
                      >
                        <Users className="w-3 h-3" />
                        {char.name} ({char.role})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Action Description</label>
                <textarea
                  rows={2}
                  value={formAction}
                  onChange={(e) => setFormAction(e.target.value)}
                  placeholder="Detailed cinematic action unfolding in the scene..."
                  className="w-full bg-cine-950 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none resize-none"
                />
              </div>

              {/* Dialogue */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Speaker</label>
                  <input
                    type="text"
                    value={formDialogueSpeaker}
                    onChange={(e) => setFormDialogueSpeaker(e.target.value)}
                    placeholder="Vikram"
                    className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Dialogue Text</label>
                  <input
                    type="text"
                    value={formDialogueText}
                    onChange={(e) => setFormDialogueText(e.target.value)}
                    placeholder="This timeline doesn't make sense..."
                    className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Camera & Lighting */}
              <div className="p-4 rounded-xl bg-cine-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono uppercase text-cine-gold font-bold">
                  Camera Setup & Cinematography
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Camera Shot</label>
                    <select
                      value={formCameraShot}
                      onChange={(e) => setFormCameraShot(e.target.value)}
                      className="w-full bg-cine-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Extreme Wide Shot">Extreme Wide Shot</option>
                      <option value="Wide Establishing Shot">Wide Establishing Shot</option>
                      <option value="Medium Shot">Medium Shot</option>
                      <option value="Medium Close-Up">Medium Close-Up</option>
                      <option value="Close-Up">Close-Up</option>
                      <option value="Extreme Close-Up">Extreme Close-Up</option>
                      <option value="Over-The-Shoulder">Over-The-Shoulder</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Camera Movement</label>
                    <select
                      value={formCameraMovement}
                      onChange={(e) => setFormCameraMovement(e.target.value)}
                      className="w-full bg-cine-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    >
                      <option value="Static Tripod">Static Tripod</option>
                      <option value="Slow Push-In">Slow Push-In</option>
                      <option value="Slow Dolly Back">Slow Dolly Back</option>
                      <option value="Pan Left / Right">Pan Left / Right</option>
                      <option value="Steadicam Tracking">Steadicam Tracking</option>
                      <option value="Subtle Handheld Drift">Subtle Handheld Drift</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-slate-400 mb-1">Lighting Design</label>
                    <input
                      type="text"
                      value={formLighting}
                      onChange={(e) => setFormLighting(e.target.value)}
                      placeholder="Low-key warm tungsten desk light with blue rain reflections"
                      className="w-full bg-cine-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cine-gold hover:bg-amber-400 text-black font-bold text-xs shadow-glow-gold"
                >
                  Save Scene
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
