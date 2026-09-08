/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        company: {
          DEFAULT: '#E10600',
          50: '#FFEAEA',
          100: '#FFD5D5',
          200: '#FFAAAA',
          300: '#FF7F7F',
          400: '#FF5555',
          600: '#C10B00',
          700: '#940800',
          800: '#620500',
          900: '#3A0200',
        },
      },
      ringColor: {
        company: '#E10600',
      },
      boxShadow: {
        'company-md': '0 6px 18px rgba(225,16,0,0.12)',
      },
    },
  },
  plugins: [],
};
