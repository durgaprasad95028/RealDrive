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
        background: '#07090D',
        'background-secondary': '#0D1117',
        surface: '#111827',
        'surface-elevated': '#161D29',
        'surface-card': '#131A26',
        'primary-blue': '#2563EB',
        'primary-hover': '#1D4ED8',
        accent: '#38BDF8',
        'accent-glow': '#0284C7',
        'primary-text': '#F8FAFC',
        'secondary-text': '#94A3B8',
        'muted-text': '#64748B',
        'app-border': '#1F2937',
        'app-border-light': '#334155',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        display: ['Orbitron', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 20px -5px rgba(37, 99, 235, 0.5)',
        'glow-cyan': '0 0 20px -5px rgba(56, 189, 248, 0.5)',
        'glow-danger': '0 0 20px -5px rgba(239, 68, 68, 0.5)',
        'glow-success': '0 0 20px -5px rgba(34, 197, 94, 0.5)',
        'card-elevated': '0 10px 30px -10px rgba(0, 0, 0, 0.7)',
      },
    },
  },
  plugins: [],
}
