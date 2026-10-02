/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cine: {
          950: '#05070B',
          900: '#0B0F17',
          850: '#101622',
          800: '#161D2D',
          700: '#232D42',
          600: '#34425F',
          500: '#4F638B',
          gold: '#D4AF37',
          'gold-light': '#F3E5AB',
          amber: '#F59E0B',
          cyan: '#06B6D4',
          crimson: '#E11D48',
          accent: '#6366F1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        cinematic: ['Cinzel', 'Playfair Display', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-gold': '0 0 25px rgba(212, 175, 55, 0.25)',
        'glow-cyan': '0 0 25px rgba(6, 182, 212, 0.25)',
        'glow-accent': '0 0 25px rgba(99, 102, 241, 0.3)',
      },
      backgroundImage: {
        'cinematic-gradient': 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(11, 15, 23, 0) 70%)',
        'card-gradient': 'linear-gradient(180deg, rgba(22, 29, 45, 0.7) 0%, rgba(11, 15, 23, 0.85) 100%)',
      }
    },
  },
  plugins: [],
}
