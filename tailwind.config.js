
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        'brand-magenta': '#CC0066',
        'brand-red': '#E8003D',
        'brand-orange': '#FF6600',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(to right, #CC0066, #E8003D, #FF6600)',
      },
    },
  },
  plugins: [],
}
