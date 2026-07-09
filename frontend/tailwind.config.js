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
        primary: {
          DEFAULT: '#2563EB',
          dark: '#3B82F6',
        },
        secondary: {
          DEFAULT: '#14B8A6',
          dark: '#2DD4BF',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        darkbg: '#0F172A',
        darkcard: '#1E293B'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
