/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff5f1',
          100: '#ffe8df',
          200: '#ffd0bc',
          300: '#ffb08f',
          400: '#ff8255',
          500: '#f25c2a',
          600: '#e04418',
          700: '#bc3412',
          800: '#9a2e15',
          900: '#7d2916',
          950: '#431208'
        },
        midnight: {
          50: '#f0f4f9',
          100: '#dce5f0',
          200: '#b8c9de',
          300: '#8ba6c4',
          400: '#5d82a8',
          500: '#3d6589',
          600: '#2e4f6e',
          700: '#253f58',
          800: '#1c3045',
          900: '#0f2137',
          950: '#0a1628'
        }
      },
      fontFamily: {
        sans: ['Manrope', 'Alexandria', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Reem Kufi', 'Georgia', 'serif'],
        arabic: ['Alexandria', 'Manrope', 'Segoe UI', 'sans-serif'],
        'arabic-display': ['Reem Kufi', 'Alexandria', 'sans-serif']
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(15,33,55,0.18)',
        lift: '0 20px 60px -15px rgba(15,33,55,0.25)',
        glow: '0 8px 24px -8px rgba(224,68,24,0.28)'
      },
      backgroundImage: {}
    }
  },
  plugins: []
}
