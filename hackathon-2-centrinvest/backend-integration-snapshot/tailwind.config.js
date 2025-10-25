/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f0',
          100: '#dcf2dc',
          200: '#bce5bc',
          300: '#8dd18d',
          400: '#57b857',
          500: '#39aa34',
          600: '#2d8a2a',
          700: '#256d22',
          800: '#21571f',
          900: '#1f4a1e',
        },
        secondary: {
          50: '#f6f7f1',
          100: '#f0f0e6',
          200: '#e8e9d8',
          300: '#d9dbc4',
          400: '#c8caa8',
          500: '#b8bb8c',
          600: '#a5a874',
          700: '#8f9260',
          800: '#777a52',
          900: '#636545',
        },
        accent: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#14c94d',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        background: '#ffffff',
        surface: '#f6f7f1',
        text: {
          primary: '#1f2937',
          secondary: '#6b7280',
          light: '#ffffff',
        }
      },
      animation: {
        'float': 'float 8s ease-in-out infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 4s infinite',
        'spin-slow': 'spin 10s linear infinite',
        'gradient': 'gradient 20s ease infinite',
        'star-twinkle': 'star-twinkle 3s ease-in-out infinite alternate',
        'slide-in': 'slide-in 0.8s ease-out',
        'fade-in': 'fade-in 1s ease-out',
        'scale-in': 'scale-in 0.6s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) scale(1)' },
          '50%': { transform: 'translateY(-15px) scale(1.05)' },
        },
        gradient: {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          },
        },
        'star-twinkle': {
          '0%': { opacity: '0.4', transform: 'scale(0.9)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
          '100%': { opacity: '0.4', transform: 'scale(0.9)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'hero-gradient': 'linear-gradient(135deg, #FFF001 0%, #3CC730 100%)',
        'card-gradient': 'linear-gradient(145deg, #f6f7f1 0%, #f0f0e6 100%)',
      },
      fontFamily: {
        'sans': ['Inter', 'Inter-Fallback', 'system-ui', 'sans-serif'],
        'display': ['Poppins', 'Poppins-Fallback', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
