/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      colors: {
        // Warm kitchen palette: toasted clay, honey, and a soft cream ground.
        cream: {
          50: '#FDFaF5',
          100: '#FAF4EA',
          200: '#F2E8D8',
          300: '#E7D7BF',
        },
        clay: {
          50: '#FBF1ED',
          100: '#F5DED4',
          200: '#E9BDAB',
          300: '#DB9781',
          400: '#C97458',
          500: '#B65B3D',
          600: '#9C4830',
          700: '#7E3927',
          800: '#632D1F',
          900: '#4E241A',
        },
        honey: {
          50: '#FDF6E7',
          100: '#F9E9C4',
          200: '#F2D48D',
          300: '#E8BB55',
          400: '#D9A02E',
          500: '#B87F1C',
        },
        sage: {
          100: '#E6EDE4',
          500: '#6B8F68',
          700: '#4A6748',
        },
      },
      fontFamily: {
        display: ['Georgia', 'Iowan Old Style', 'Palatino', 'serif'],
        sans: ['ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(78, 36, 26, 0.05), 0 2px 8px rgba(78, 36, 26, 0.06)',
        lift: '0 10px 28px rgba(78, 36, 26, 0.12)',
      },
    },
  },
  plugins: [],
};
