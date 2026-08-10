export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF7F2',
        sand: '#E8DED0',
        graphite: '#1C1C1C',
        forest: '#2D3A2E',
        terra: '#B85A3C',
        muted: '#8B8B8B',
        night: '#0E0D0B',
        coal: '#14120F',
        amber: '#C2A076',
        royal: '#5B6C8E',
        paper: '#F5F7FA',
      },
      fontFamily: {
        // Apple-стек: на устройствах Apple — SF Pro, иначе Inter
        sans: ['-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', 'Inter', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        // serif остаётся только для внутренних сайтов ресторанов
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
};