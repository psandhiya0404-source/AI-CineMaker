import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Film,
  Sparkles,
  Users,
  Video,
  Mic2,
  SlidersHorizontal,
  Download,
  ArrowRight,
  Play,
  CheckCircle,
  ShieldCheck,
  Zap,
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  const workflowSteps = [
    { number: '01', title: 'Story', desc: 'Write or paste your screenplay with natural dialogue & scene cues.', icon: Sparkles },
    { number: '02', title: 'Characters', desc: 'Auto-extract characters & lock their photorealistic visual identity.', icon: Users },
    { number: '03', title: 'Scenes', desc: 'Deconstruct script into cinematic shots, lighting, and camera angles.', icon: Film },
    { number: '04', title: 'AI Generation', desc: 'Render 35mm photorealistic live-action frames & 24fps motion clips.', icon: Video },
    { number: '05', title: 'Voice & SFX', desc: 'Cast neural character voices & layer atmospheric BGM scores.', icon: Mic2 },
    { number: '06', title: 'Timeline Editing', desc: 'Fine-tune multi-track timeline clips, dialogue audio, and pacing.', icon: SlidersHorizontal },
    { number: '07', title: 'Final Film', desc: 'Master and export 4K widescreen cinematic short films.', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-cine-950 text-slate-100 selection:bg-cine-gold selection:text-black">
      {/* Cinematic Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-cine-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 lg:px-16 h-20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cine-gold to-amber-600 flex items-center justify-center text-black font-black shadow-glow-gold">
            <Film className="w-5 h-5 text-black" />
          </div>
          <span className="font-cinematic text-xl font-bold tracking-wider text-white">
            AI CINEMAKER
          </span>
        </div>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 hover:to-cine-gold text-black font-semibold text-sm transition shadow-glow-gold flex items-center gap-2"
            >
              Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 hover:to-cine-gold text-black font-semibold text-sm transition shadow-glow-gold flex items-center gap-2"
              >
                Start Creating <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-36 pb-24 px-6 lg:px-16 overflow-hidden">
        {/* Background ambient lighting effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-cine-gold/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[300px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cine-900 border border-cine-gold/30 text-cine-gold text-xs font-mono font-medium mb-8 shadow-glow-gold animate-fade-in">
            <Sparkles className="w-3.5 h-3.5" /> NEXT-GENERATION AI CINEMA PLATFORM
          </div>

          <h1 className="font-cinematic text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight tracking-tight mb-8">
            Turn Your Story Into a{' '}
            <span className="bg-gradient-to-r from-cine-gold via-amber-200 to-amber-500 bg-clip-text text-transparent">
              Realistic Film
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
            Write your story. Build your characters. Generate cinematic scenes. Create your own AI short film with <strong className="text-white">live-action photorealism</strong> and locked character consistency.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={isAuthenticated ? "/studio/story" : "/register"}
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-cine-gold to-amber-500 hover:from-amber-400 hover:to-cine-gold text-black font-bold text-base transition shadow-glow-gold flex items-center justify-center gap-3 transform hover:-translate-y-0.5"
            >
              <Film className="w-5 h-5" /> Start Creating Film
            </Link>
            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-cine-900/90 hover:bg-cine-800 border border-slate-700/80 text-slate-200 font-semibold text-base transition flex items-center justify-center gap-2"
            >
              Explore Projects
            </Link>
          </div>

          {/* Value Badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cine-gold" />
              <span>100% Photorealistic Live Action (No Cartoons)</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cine-gold" />
              <span>Character Face & Identity Consistency</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cine-gold" />
              <span>Multi-Track Timeline Video Editor</span>
            </div>
          </div>
        </div>

        {/* Hero Cinematic Mockup Card */}
        <div className="max-w-5xl mx-auto mt-16 relative">
          <div className="letterbox-preview rounded-2xl overflow-hidden border border-slate-700/80 shadow-2xl bg-black group">
            <img
              src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1600&auto=format&fit=crop&q=90"
              alt="Cinematic Movie Still"
              className="w-full h-[380px] sm:h-[480px] object-cover opacity-90 group-hover:scale-102 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono uppercase text-cine-gold tracking-widest mb-1">
                    SCENE 01 • DETECTIVE OFFICE • 35MM LIVE ACTION
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    "Vikram investigates the encrypted ledger as rain strikes the glass."
                  </h3>
                </div>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/60 border border-slate-700 text-xs font-mono text-slate-300">
                  <Video className="w-3.5 h-3.5 text-cine-gold" /> ARRI ALEXA LF 24FPS
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Production Workflow Section */}
      <section className="py-24 px-6 lg:px-16 bg-cine-900/60 border-t border-b border-slate-800/80">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="text-xs font-mono uppercase tracking-widest text-cine-gold font-bold mb-2">
              SEAMLESS FILMMAKING WORKFLOW
            </div>
            <h2 className="font-cinematic text-3xl sm:text-4xl font-extrabold text-white">
              From Written Story to Final Master Film
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.number}
                  className="p-6 rounded-2xl bg-cine-950 border border-slate-800 hover:border-cine-gold/40 transition group hover:shadow-glow-gold relative overflow-hidden"
                >
                  <div className="text-3xl font-cinematic font-black text-slate-800 group-hover:text-cine-gold/20 transition mb-3">
                    {step.number}
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-cine-900 border border-slate-700 flex items-center justify-center text-cine-gold mb-4 group-hover:scale-110 transition">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Character Consistency Highlight */}
      <section className="py-24 px-6 lg:px-16">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-cine-gold font-bold mb-2">
              PROPRIETARY IDENTITY LOCK
            </div>
            <h2 className="font-cinematic text-3xl sm:text-4xl font-extrabold text-white mb-6">
              True Character Consistency Across Every Scene
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed mb-6">
              In standard AI video tools, characters morph and look completely different in every scene. AI CineMaker generates and locks a <strong className="text-white">character reference identity profile</strong> (facial morphology, age, skin tone, hair, and wardrobe) and propagates it into all subsequent scene prompts and multi-modal models.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-cine-gold/20 text-cine-gold mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Scene 1: Office Desk</h4>
                  <p className="text-xs text-slate-400">Vikram examining clues under tungsten desk lamp.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-cine-gold/20 text-cine-gold mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Scene 2: Rain-Soaked Street</h4>
                  <p className="text-xs text-slate-400">Same face, same scar, same trench coat in rain fog.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="p-1 rounded bg-cine-gold/20 text-cine-gold mt-0.5">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Scene 3: Dialogue Confrontation</h4>
                  <p className="text-xs text-slate-400">Close-up tracking shot with locked character morphology.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden border border-slate-700 bg-cine-900 p-2">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80"
                alt="Character Reference Vikram"
                className="w-full h-44 object-cover rounded-xl"
              />
              <div className="p-2">
                <div className="text-[10px] font-mono text-cine-gold">CHARACTER REFERENCE</div>
                <div className="text-xs font-bold text-white">Vikram (Detective)</div>
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-700 bg-cine-900 p-2">
              <img
                src="https://images.unsplash.com/photo-1485846234645-a62644f84728?w=600&auto=format&fit=crop&q=80"
                alt="Scene Output Vikram"
                className="w-full h-44 object-cover rounded-xl"
              />
              <div className="p-2">
                <div className="text-[10px] font-mono text-emerald-400">SCENE 02 OUTPUT</div>
                <div className="text-xs font-bold text-white">Wet Alleyway Scene</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-16 bg-cine-950 border-t border-slate-800 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Film className="w-4 h-4 text-cine-gold" />
            <span className="font-cinematic text-sm font-bold text-white">AI CINEMAKER</span>
          </div>
          <div>© {new Date().getFullYear()} AI CineMaker. Professional Live-Action Short Film Platform.</div>
          <div className="flex items-center gap-4 text-slate-400">
            <Link to="/login" className="hover:text-white">Sign In</Link>
            <Link to="/register" className="hover:text-white">Get Started</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
