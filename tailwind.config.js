/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F4F8FC',
          100: '#E8EFF9',
          200: '#C9DCF0',
          300: '#9CC0E4',
          400: '#6BA0D6',
          500: '#3381C3',
          600: '#2A5CA8',
          700: '#1E468E',
          800: '#193A76',
          900: '#142E5E',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      keyframes: {
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s infinite',
      },
    },
  },
  plugins: [],
};
