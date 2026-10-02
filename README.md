# 🎬 AI CineMaker

> **Turn Your Written Story into a Realistic Cinematic Live-Action Short Film**

AI CineMaker is an end-to-end full-stack filmmaking platform that enables creators, screenwriters, and directors to transform raw narrative scripts into realistic live-action short films.

---

## 🌟 The 7-Step Production Workflow

```
STORY ➔ STORY ANALYSIS ➔ CHARACTERS ➔ CHARACTER REFERENCES ➔ SCENES ➔ SCENE IMAGES ➔ AI VIDEO ➔ CHARACTER VOICES ➔ BGM/SFX ➔ TIMELINE EDITOR ➔ FINAL MASTER FILM
```

1. **Story Studio**: Write or paste full screenplays with automatic scene cues & character dialogues.
2. **Character Casting**: Auto-extracts protagonists, antagonists, and supporting characters with facial morphology, skin tone, wardrobe, and distinct identifying features.
3. **Character Consistency Engine**: Generates 35mm photographic reference portraits and persistently injects character appearance tokens across all subsequent scene generations to maintain visual identity across shots.
4. **Scene Studio**: Deconstructs screenplays into sequenced shots with camera lens directions (e.g. 50mm Anamorphic, Slow Push-In, Eye Level), dynamic lighting, and action descriptions.
5. **AI Generation Studio**: Renders 8K photorealistic live-action frames (strictly live-action, no cartoons/anime/3D renders) and 24fps motion video clips.
6. **Voice Studio**: Synthesizes character dialogue audio using neural voice talent profiles.
7. **Multi-Track Video Timeline Editor**: Non-linear timeline editor supporting Video (V1), Dialogue (A1), and BGM/SFX (A2) audio tracks with real-time player preview, clip trimming, and timecode readouts.
8. **Final 4K Master Export**: Master color-graded 2.39:1 anamorphic widescreen short film with MP4 download.

---

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework**: React 18 + Vite
- **Styling**: Tailwind CSS with custom dark cinematic theme, glassmorphism, glowing gold accents
- **Routing**: React Router v7
- **Icons**: Lucide React
- **State & Context**: AuthContext, ProjectContext, GenerationContext
- **HTTP Client**: Axios with automatic JWT interceptors

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB & Mongoose (with automated resilient fallback in-memory store for 0-setup execution)
- **Security**: JWT Authentication, bcryptjs password hashing, protected routes, CORS
- **Modular AI Engine**:
  - `storyProvider.js`: GPT-4o / Gemini 1.5 / Intelligent Screenplay NLP Parser
  - `characterConsistencyEngine.js`: Character identity vector preservation
  - `imageProvider.js`: Stability AI / DALL-E 3 / Flux Photorealistic Live-Action engine
  - `videoProvider.js`: Runway Gen-3 Alpha / Kling AI / Cinematic Motion Engine
  - `voiceProvider.js`: ElevenLabs / Neural TTS Voice Engine
  - `musicProvider.js`: Cinematic score & foley SFX library
  - `jobQueueService.js`: Asynchronous job worker with live milestone progress polling

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- *(Optional)* Local or Atlas **MongoDB** instance
- *(Optional)* Provider API keys (OpenAI, Gemini, Stability, Runway, ElevenLabs)

### 2. Installation

Install server dependencies:
```bash
cd server
npm install
```

Install client dependencies:
```bash
cd ../client
npm install
```

### 3. Environment Configuration

Server configuration (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/ai_cinemaker
JWT_SECRET=super_secret_cinematic_jwt_token_key_999888777
JWT_EXPIRES_IN=7d

# Optional Cloud AI API Keys (Built-in engine works immediately without keys)
OPENAI_API_KEY=
GEMINI_API_KEY=
STABILITY_API_KEY=
RUNWAY_API_KEY=
ELEVENLABS_API_KEY=
KLING_API_KEY=
```

### 4. Running the Application

**Start the Backend Server (Port 5000):**
```bash
cd server
npm start
```

**Start the Frontend Client (Port 5173):**
```bash
cd client
npm run dev
```

Open your browser at `http://localhost:5173`.

---

## 🔒 Security & Best Practices
- Passwords are never stored in plain text (hashed using `bcryptjs` with salt rounds).
- JWT tokens are verified on all protected `/api/*` routes.
- API keys and secrets are strictly retained in the backend `.env` and never exposed to client-side code.
- Resilient error handling prevents server crashes when an external AI provider fails or times out.

---

## 🎬 License
MIT License. Built for cinematic storytellers and creators.
