/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#0b0c10', // background gelap premium
        primary: '#38bdf8', // biru langit
        secondary: '#3b82f6', // biru neon
        accent: '#6366f1', // ungu biru
        highlight: '#f472b6', // pink futuristik
        glow: '#60a5fa', // biru muda untuk efek glow
      },

      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at center, var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at center, var(--tw-gradient-stops))',
        'gradient-glow': 'linear-gradient(90deg, #38bdf8, #3b82f6, #6366f1)',
      },

      boxShadow: {
        glow: '0 0 10px rgba(56, 189, 248, 0.6), 0 0 20px rgba(59, 130, 246, 0.4)',
        neon: '0 0 6px #3b82f6, 0 0 12px #38bdf8',
      },

      keyframes: {
        flashPulse: {
          '0%': { opacity: '0' },
          '20%': { opacity: '1' },
          '50%': { opacity: '0.6' },
          '100%': { opacity: '0' },
        },
        ripple: {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },

      animation: {
        flash: 'flashPulse 0.4s ease-out forwards',
        ripple: 'ripple 0.6s ease-out',
        fadeDown: 'fadeDown 0.3s ease-out',
        fadeIn: 'fadeIn 0.5s ease-in',
      },

      transitionTimingFunction: {
        'soft': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
}
