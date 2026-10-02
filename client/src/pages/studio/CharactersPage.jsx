import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProject } from '../../context/ProjectContext';
import { useGeneration } from '../../context/GenerationContext';
import { aiApi } from '../../api';
import {
  Users,
  Plus,
  Sparkles,
  Camera,
  Edit,
  Trash2,
  Lock,
  Mic2,
  CheckCircle2,
  ArrowRight,
  Upload,
  UserCheck,
  Shield,
  Layers,
  Loader2,
} from 'lucide-react';

export const CharactersPage = () => {
  const { currentProject, characters, addCharacter, updateCharacter, deleteCharacter, refreshCurrentProject } = useProject();
  const { trackJob, addToast } = useGeneration();
  const navigate = useNavigate();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState(null);
  const [generatingId, setGeneratingId] = useState(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formAge, setFormAge] = useState(30);
  const [formGender, setFormGender] = useState('Male');
  const [formRole, setFormRole] = useState('Protagonist');
  const [formPersonality, setFormPersonality] = useState('Sharp, observant, resolute');
  const [formFace, setFormFace] = useState('Sharp chiseled jawline, focused dark eyes, slight stubble');
  const [formHair, setFormHair] = useState('Short textured dark brown hair');
  const [formSkinTone, setFormSkinTone] = useState('Warm olive');
  const [formBodyType, setFormBodyType] = useState('Athletic, lean build');
  const [formClothing, setFormClothing] = useState('Charcoal tailored trench coat over dark linen shirt');
  const [formAccessories, setFormAccessories] = useState('Vintage silver wristwatch, leather notepad');
  const [formIdentifyingFeatures, setFormIdentifyingFeatures] = useState('Faint scar over left eyebrow');
  const [formDescription, setFormDescription] = useState('Lead investigator on the case.');
  const [formRefImage, setFormRefImage] = useState('');

  const openCreateModal = () => {
    setEditingCharacter(null);
    setFormName('');
    setFormAge(30);
    setFormGender('Male');
    setFormRole('Protagonist');
    setFormPersonality('Observant, intense, calm under pressure');
    setFormFace('Sharp jawline, piercing dark eyes, light stubble');
    setFormHair('Short textured dark hair');
    setFormSkinTone('Warm olive');
    setFormBodyType('Athletic');
    setFormClothing('Charcoal trench coat');
    setFormAccessories('Silver vintage wristwatch');
    setFormIdentifyingFeatures('Small eyebrow scar');
    setFormDescription('Lead investigator.');
    setFormRefImage('');
    setIsCreateOpen(true);
  };

  const openEditModal = (char) => {
    setEditingCharacter(char);
    setFormName(char.name);
    setFormAge(char.age || 30);
    setFormGender(char.gender || 'Male');
    setFormRole(char.role || 'Protagonist');
    setFormPersonality(char.personality || '');
    setFormFace(char.appearance?.face || '');
    setFormHair(char.appearance?.hair || '');
    setFormSkinTone(char.appearance?.skinTone || '');
    setFormBodyType(char.appearance?.bodyType || '');
    setFormClothing(char.appearance?.clothing || '');
    setFormAccessories(char.appearance?.accessories || '');
    setFormIdentifyingFeatures(char.appearance?.identifyingFeatures || '');
    setFormDescription(char.description || '');
    setFormRefImage(char.referenceImage || '');
    setIsCreateOpen(true);
  };

  const handleSaveCharacter = async (e) => {
    e.preventDefault();
    const payload = {
      name: formName,
      age: Number(formAge),
      gender: formGender,
      role: formRole,
      personality: formPersonality,
      appearance: {
        face: formFace,
        hair: formHair,
        skinTone: formSkinTone,
        bodyType: formBodyType,
        clothing: formClothing,
        accessories: formAccessories,
        identifyingFeatures: formIdentifyingFeatures,
      },
      description: formDescription,
      referenceImage: formRefImage,
    };

    if (editingCharacter) {
      await updateCharacter(editingCharacter._id, payload);
      addToast(`Updated character "${formName}"`, 'success');
    } else {
      await addCharacter(payload);
      addToast(`Created character "${formName}"`, 'success');
    }
    setIsCreateOpen(false);
  };

  // Generate Reference Image with AI
  const handleGenerateReference = async (char) => {
    setGeneratingId(char._id);
    try {
      const res = await aiApi.generateCharacter({
        characterId: char._id,
        projectId: currentProject._id,
      });

      trackJob(res.data.jobId, `Generating Reference for ${char.name}`, async (completedJob) => {
        await refreshCurrentProject();
        setGeneratingId(null);
        addToast(`Reference portrait locked for ${char.name}`, 'success');
      });
    } catch (err) {
      addToast('Failed to generate portrait: ' + err.message, 'error');
      setGeneratingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6 rounded-2xl bg-cine-900 border border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cine-gold/20 text-cine-gold border border-cine-gold/30 text-xs font-mono font-medium mb-2">
            <Users className="w-3.5 h-3.5" /> STEP 02 • CHARACTER CONSISTENCY SYSTEM
          </div>
          <h1 className="font-cinematic text-2xl sm:text-3xl font-extrabold text-white">
            Character Casting & Reference Library
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build and lock realistic live-action character portraits. These reference images are persistently injected across all scenes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 hover:to-cine-gold text-black font-bold text-xs transition shadow-glow-gold flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Character
          </button>
        </div>
      </div>

      {/* Character Grid */}
      {characters.length === 0 ? (
        <div className="p-16 rounded-2xl bg-cine-900/50 border border-dashed border-slate-800 text-center space-y-4">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Characters in this Project</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Analyze your screenplay in Story Studio to generate characters automatically, or manually add your first character.
          </p>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 rounded-xl bg-cine-gold text-black font-bold text-xs shadow-glow-gold inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add First Character
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => {
            const hasRef = !!char.referenceImage;
            const isGenerating = generatingId === char._id;

            return (
              <div
                key={char._id}
                className="rounded-2xl bg-cine-900 border border-slate-800 hover:border-cine-gold/50 transition-all duration-300 overflow-hidden shadow-xl flex flex-col justify-between group"
              >
                <div>
                  {/* Portrait Reference Area */}
                  <div className="relative h-64 bg-black overflow-hidden flex items-center justify-center">
                    {hasRef ? (
                      <img
                        src={char.referenceImage}
                        alt={char.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                      />
                    ) : (
                      <div className="text-center p-6 space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-cine-800 border border-slate-700 flex items-center justify-center mx-auto text-slate-500">
                          <Camera className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-slate-400 block font-mono">No Reference Image Locked</span>
                      </div>
                    )}

                    {/* Consistency Badge */}
                    <div className="absolute top-3 left-3">
                      {hasRef ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-400 text-[10px] font-mono font-bold shadow-lg">
                          <Shield className="w-3 h-3" /> IDENTITY LOCKED
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-950/90 border border-amber-500/50 text-amber-400 text-[10px] font-mono font-bold">
                          PENDING REF
                        </span>
                      )}
                    </div>

                    {/* Quick Edit / Delete */}
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition">
                      <button
                        onClick={() => openEditModal(char)}
                        title="Edit Character"
                        className="p-1.5 rounded-lg bg-black/70 hover:bg-black text-slate-300 hover:text-white transition"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete character "${char.name}"?`)) {
                            deleteCharacter(char._id);
                          }
                        }}
                        title="Delete"
                        className="p-1.5 rounded-lg bg-black/70 hover:bg-rose-950 text-slate-300 hover:text-rose-400 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Bottom overlay badge */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span className="px-2.5 py-1 rounded-lg bg-black/80 text-cine-gold text-xs font-mono font-bold border border-cine-gold/30">
                        {char.role}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-black/80 text-slate-300 text-[10px] font-mono">
                        {char.age}yo • {char.gender}
                      </span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-lg font-bold text-white group-hover:text-cine-gold transition">
                        {char.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                        {char.personality || 'No personality notes.'}
                      </p>
                    </div>

                    {/* Appearance Details List */}
                    <div className="space-y-1.5 p-3 rounded-xl bg-cine-950 border border-slate-800 text-[11px]">
                      <div className="text-slate-300">
                        <strong className="text-slate-500 font-mono">Face: </strong>
                        {char.appearance?.face || 'Sharp cinematic features'}
                      </div>
                      <div className="text-slate-300">
                        <strong className="text-slate-500 font-mono">Wardrobe: </strong>
                        {char.appearance?.clothing || 'Cinematic costume'}
                      </div>
                      {char.appearance?.identifyingFeatures && (
                        <div className="text-cine-gold">
                          <strong className="text-slate-500 font-mono">Distinct: </strong>
                          {char.appearance.identifyingFeatures}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0 space-y-2">
                  <button
                    onClick={() => handleGenerateReference(char)}
                    disabled={isGenerating}
                    className="w-full py-2.5 rounded-xl bg-cine-800 hover:bg-gradient-to-r hover:from-cine-gold hover:to-amber-500 hover:text-black text-slate-200 font-semibold text-xs transition flex items-center justify-center gap-2 border border-slate-700/60 hover:border-transparent disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-cine-gold" /> Generating 35mm Reference...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-cine-gold" /> {hasRef ? 'Regenerate Portrait Ref' : 'Generate AI Reference Portrait'}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Navigation to next step */}
      {characters.length > 0 && (
        <div className="pt-6 flex justify-end">
          <button
            onClick={() => navigate('/studio/scenes')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 text-black font-bold text-xs shadow-glow-gold flex items-center gap-2"
          >
            Proceed to Scene Studio <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Character Modal (Create/Edit) */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-cine-900 border border-slate-700 rounded-2xl shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto">
            <h2 className="font-cinematic text-xl font-bold text-white mb-1">
              {editingCharacter ? `Edit Character: ${editingCharacter.name}` : 'Create Character Profile'}
            </h2>
            <p className="text-xs text-slate-400 mb-6">
              Define appearance, clothing, and traits to maintain visual identity across all generated scenes.
            </p>

            <form onSubmit={handleSaveCharacter} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Character Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Vikram"
                    className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cine-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Age</label>
                  <input
                    type="number"
                    value={formAge}
                    onChange={(e) => setFormAge(e.target.value)}
                    className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cine-gold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Gender</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value)}
                    className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cine-gold"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Role in Story</label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="Protagonist / Detective"
                    className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Personality</label>
                  <input
                    type="text"
                    value={formPersonality}
                    onChange={(e) => setFormPersonality(e.target.value)}
                    placeholder="Sharp, observant, stoic"
                    className="w-full bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Appearance Details */}
              <div className="p-4 rounded-xl bg-cine-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono uppercase text-cine-gold font-bold">
                  Visual Appearance & Wardrobe
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Face & Facial Features</label>
                    <input
                      type="text"
                      value={formFace}
                      onChange={(e) => setFormFace(e.target.value)}
                      placeholder="Chiseled jawline, focused eyes, slight stubble"
                      className="w-full bg-cine-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Hair Style & Color</label>
                    <input
                      type="text"
                      value={formHair}
                      onChange={(e) => setFormHair(e.target.value)}
                      placeholder="Short textured dark brown hair"
                      className="w-full bg-cine-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Clothing / Outfit</label>
                    <input
                      type="text"
                      value={formClothing}
                      onChange={(e) => setFormClothing(e.target.value)}
                      placeholder="Charcoal trench coat, dark linen shirt"
                      className="w-full bg-cine-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Identifying Features / Scars</label>
                    <input
                      type="text"
                      value={formIdentifyingFeatures}
                      onChange={(e) => setFormIdentifyingFeatures(e.target.value)}
                      placeholder="Scar over left eyebrow"
                      className="w-full bg-cine-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Reference Image URL or Custom Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Reference Image URL (or upload custom portrait)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formRefImage}
                    onChange={(e) => setFormRefImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or generate with AI"
                    className="flex-1 bg-cine-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const sample = formGender === 'Female'
                        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80'
                        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop&q=80';
                      setFormRefImage(sample);
                    }}
                    className="px-3 py-2 rounded-xl bg-cine-800 hover:bg-slate-700 text-xs text-slate-300"
                  >
                    Use Sample HD Ref
                  </button>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-cine-gold hover:bg-amber-400 text-black font-bold text-xs shadow-glow-gold"
                >
                  Save Character
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
