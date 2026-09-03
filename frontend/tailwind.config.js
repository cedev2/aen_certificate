/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#f0f1f5',
          100: '#d9dce8',
          200: '#b3b9d1',
          300: '#8d96ba',
          400: '#6773a3',
          500: '#41508c',
          600: '#344070',
          700: '#273054',
          800: '#1a2038',
          900: '#1a2340',
          950: '#0d1220',
        },
        aen: {
          orange: '#E8792B',
          gold: '#C9963B',
          'light-blue': '#5BA3D9',
          cream: '#FFFEF8',
          ivory: '#FFF9F0',
        },
      },
      fontFamily: {
        serif: ['Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        script: ['Great Vibes', 'cursive'],
      },
    },
  },
  plugins: [],
}
