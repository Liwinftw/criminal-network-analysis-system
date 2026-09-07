/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary:   '#0B0F14',
          secondary: '#111827',
          card:      '#151B26',
        },
        border: {
          DEFAULT: '#263244',
        },
        accent: {
          cyan:  '#22D3EE',
          blue:  '#3B82F6',
        },
        level: {
          low:    '#22C55E',
          medium: '#F59E0B',
          high:   '#EF4444',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
