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
        background: '#0A1220',
        surface1: '#101B2D',
        surface2: '#16243A',
        polarBorder: '#24344D',
        polarText: '#EDE8DF',
        polarMuted: '#9FB0C6',
        accent: '#7CC4F0',
        success: '#5FB48A',
        warning: '#D9A441',
        danger: '#D2695F',
        paper: '#F4F1EA',
        paperText: '#1B2433',
        mark: '#FFE9A8',
      },
      fontFamily: {
        serif: ['Newsreader', 'Georgia', 'serif'],
        sans: ['IBM Plex Sans', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['IBM Plex Mono', 'Menlo', 'monospace'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif']
      }
    },
  },
  plugins: [],
}
