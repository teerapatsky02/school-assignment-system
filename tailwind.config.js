module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0C7C82',
        secondary: '#35B4B0',
        mint: '#AED581',
        yellow: '#FFCA28',
        orange: '#FF8A65',
        red: '#EF5350',
        purple: '#4A2C6D',
        deepRed: '#D32F2F',
        amber: '#F57C00',
        gold: '#FBC02D',
        blue: '#0288D1',
      },
      boxShadow: {
        soft: '0 10px 30px rgba(12, 124, 130, 0.12)',
      },
      fontFamily: {
        sans: ['Sarabun', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
