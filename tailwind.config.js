/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [
    'aspect-[21/7]',
    'keen-slider',
    'keen-slider__slide',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#111111',
        primary: '#38bdf8',
      },
      aspectRatio: {
        '21/7': [21, 7],
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
}
