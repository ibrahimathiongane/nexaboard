/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        brand: {
          dark: '#0B0F19',
          card: '#111827',
          surface: '#F8FAFC',
          border: '#E2E8F0',
        },
      },
      boxShadow: {
        'glow-primary': '0 0 50px -10px rgba(79, 70, 229, 0.3)',
      },
    },
  },
  plugins: [],
};
