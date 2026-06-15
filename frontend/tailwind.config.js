/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#0B0F14',
        surface: '#121822',
        surface2: '#1A2230',
        edge: '#243044',
        up: '#22C55E',
        down: '#EF4444',
        brand: '#7C5CFC',
      },
    },
  },
  plugins: [],
}
