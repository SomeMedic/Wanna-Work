/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        todo: {
          light: '#0EA5E9',
          dark: '#0369A1',
          glow: 'rgba(14, 165, 233, 0.35)',
        },
        progress: {
          light: '#8B5CF6',
          dark: '#6D28D9',
          glow: 'rgba(139, 92, 246, 0.35)',
        },
        done: {
          light: '#22C55E',
          dark: '#15803D',
          glow: 'rgba(34, 197, 94, 0.35)',
        },
        code: {
          bg: '#1E1E1E',
          syntax: '#D4D4D4',
          comment: '#6A9955',
          string: '#CE9178',
          keyword: '#569CD6',
        },
        accent: {
          primary: '#0EA5E9',
          secondary: '#8B5CF6',
        },
      },
    },
  },
  plugins: [],
};