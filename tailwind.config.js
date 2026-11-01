/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        typewriter: ['"Courier Prime"', 'Courier', 'monospace'],
        handwritten: ['"Caveat"', 'cursive'],
      },
      colors: {
        parchment: {
          50: '#fdfbf7',
          100: '#f7f2e7',
          200: '#ede1cf',
          300: '#e0cbb0',
          400: '#cfae8b',
          500: '#ba9067',
          600: '#9d744f',
          700: '#7e5a3e',
          800: '#5c402c',
          900: '#3d291b',
        },
        ink: {
          50: '#f5f5f6',
          100: '#e5e6e8',
          200: '#cccfd3',
          300: '#9fa4ab',
          400: '#696f79',
          500: '#464b54',
          600: '#34383f',
          700: '#282b30',
          800: '#1c1e22',
          900: '#121316',
        },
        wax: {
          50: '#fdf2f2',
          100: '#fde4e4',
          500: '#a32424',
          600: '#8e1b1b',
          700: '#751313',
          800: '#5d0e0e',
        },
        sepia: {
          warm: '#f3ead8',
          card: '#faebd7',
          dark: '#3f2e1e',
        }
      },
      boxShadow: {
        'letter': '0 8px 30px rgba(61, 41, 27, 0.15), 0 2px 6px rgba(61, 41, 27, 0.1)',
        'wax-seal': 'inset 0 2px 4px rgba(255, 255, 255, 0.3), 0 4px 10px rgba(117, 19, 19, 0.4)',
      }
    },
  },
  plugins: [],
}
