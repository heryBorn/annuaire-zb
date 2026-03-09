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
    },
  },
  plugins: [],
}
