/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // toggle via class "dark"
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  safelist: [],
  theme: {
    extend: {
      colors: {
        dark: '#111111',   // buat dark mode background
        primary: '#38bdf8',
        white: '#ffffff',  // tambahin white biar toggle bisa ganti terang
      },
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp'),
    require('@tailwindcss/aspect-ratio'),
  ],
}
