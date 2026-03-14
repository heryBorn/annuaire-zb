/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        soil:       '#2C1A0E',
        terracotta: '#C1440E',
        sand:       '#F5E6C8',
        wheat:      '#E8C97A',
        sage:       '#6B8F71',
        cream:      '#FAF5EC',
        ink:        '#1A1108',
        muted:      '#8A7A6A',
      },
      fontFamily: {
        sans:  ['"DM Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      keyframes: {
        fadeSlideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-slide-up': 'fadeSlideUp 300ms ease-out both',
      },
    },
  },
  plugins: [],
}
