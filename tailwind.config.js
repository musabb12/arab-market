/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#dce7fd',
          200: '#c0d5fc',
          300: '#95b9f9',
          400: '#6393f4',
          500: '#3f6eee',
          600: '#2a50e2',
          700: '#223dcf',
          800: '#2133a8',
          900: '#203185',
          950: '#182052'
        },
        midnight: {
          50: '#f5f6fa',
          100: '#e9ecf5',
          200: '#d0d7e8',
          300: '#a7b4d2',
          400: '#778bb8',
          500: '#556ca1',
          600: '#435586',
          700: '#38466d',
          800: '#313c5b',
          900: '#232a41'
        }
      },
      fontFamily: {
        sans: ['Manrope', 'IBM Plex Sans Arabic', 'Segoe UI', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'Amiri', 'Georgia', 'serif'],
        arabic: ['IBM Plex Sans Arabic', 'Manrope', 'Segoe UI', 'sans-serif'],
        'arabic-display': ['Amiri', 'Cormorant Garamond', 'Georgia', 'serif']
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(35,42,65,0.18)',
        lift: '0 20px 60px -15px rgba(35,42,65,0.25)',
        glow: '0 0 0 1px rgba(63,110,238,0.12), 0 8px 30px -8px rgba(63,110,238,0.35)'
      },
      backgroundImage: {
        'hero-mesh': 'radial-gradient(1200px 600px at 20% -10%, rgba(63,110,238,0.25), transparent 60%), radial-gradient(900px 500px at 85% 10%, rgba(168,85,247,0.18), transparent 55%)'
      }
    }
  },
  plugins: []
}
