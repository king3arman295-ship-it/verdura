/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans 3"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Fraunces', '"Source Sans 3"', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        sage: {
          50: '#f4f8f4', 100: '#e6f0e4', 200: '#cfe0cb', 300: '#adc7a6',
          400: '#84a87b', 500: '#658d5e', 600: '#4e7149', 700: '#3f5a3b',
          800: '#344931', 900: '#2c3d2a', 950: '#16221a',
        },
        clay: {
          50: '#fbf6f0', 100: '#f4e8d8', 200: '#e9d0b3', 300: '#dab285',
          400: '#c8905a', 500: '#b5763f', 600: '#9c5d33', 700: '#7e492b',
          800: '#673c27', 900: '#563322', 950: '#2e1a12',
        },
        cream: {
          50: '#fdfbf6', 100: '#f8f3e9', 200: '#f1e8d4', 300: '#e6d7b8',
          400: '#d6c094', 500: '#c4a873',
        },
        ink: {
          50: '#f6f6f4', 100: '#ececea', 200: '#d5d5d0', 300: '#b1b1a9',
          400: '#86867c', 500: '#64645b', 600: '#4e4e47', 700: '#40403a',
          800: '#373732', 900: '#1f1f1c', 950: '#131310',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(40,50,30,0.04), 0 8px 24px rgba(40,50,30,0.06)',
        pop: '0 10px 40px rgba(40,50,30,0.12)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: { 'fade-up': 'fade-up 0.4s ease-out both' },
    },
  },
  plugins: [],
}
