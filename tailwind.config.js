/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primaire: '#146cd1',
        fond: {
          DEFAULT: '#f0f0f0',
          sombre: '#0b1220',
        },
        carte: {
          DEFAULT: '#ffffff',
          sombre: '#1a2233',
        },
        texte: {
          DEFAULT: '#111827',
          sombre: '#f3f4f6',
        },
        secondaire: {
          DEFAULT: '#6b7280',
          sombre: '#9ca3af',
        },
        bordure: {
          DEFAULT: '#e5e7eb',
          sombre: '#2a3448',
        },
      },
    },
  },
  plugins: [],
};
