/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        noto: ['Noto Sans TC', 'sans-serif'],
        kawaii: ['"M PLUS Rounded 1c"', '"Noto Sans TC"', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#FFF5F7',
          100: '#FFE8EF',
          200: '#FFD1DF',
          300: '#FFABC7',
          400: '#FF85AF',
          500: '#FF5E97',
          600: '#FF3A7C',
          700: '#FF1563',
          800: '#E60052',
          900: '#BD0044',
        },
        accent: {
          50: '#F1FBFF',
          100: '#DEF7FF',
          200: '#BEEFFF',
          300: '#9DE6FF',
          400: '#7DDDFF',
          500: '#5CD4FF',
          600: '#3BCBFF',
          700: '#1BC1FF',
          800: '#00B7F9',
          900: '#0097CF',
        },
        kawaii: {
          pink: '#FF88B3',
          peach: '#FFBCB5',
          mint: '#A2E4B8',
          lavender: '#D9B8FF',
          sky: '#B8E3FF',
          yellow: '#FFEEA2',
          blush: '#FF9F9F',
        },
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
      borderRadius: {
        'kawaii': '16px',
        'blob': '50% 50% 50% 50% / 60% 60% 40% 40%',
      },
      boxShadow: {
        'kawaii': '0 4px 8px rgba(0, 0, 0, 0.05), 0 8px 16px rgba(255, 94, 151, 0.07)',
        'kawaii-hover': '0 6px 12px rgba(0, 0, 0, 0.08), 0 10px 20px rgba(255, 94, 151, 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-out': 'fadeOut 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-small': 'bounceSmall 1s infinite',
        'pulse-subtle': 'pulseSubtle 2s infinite',
        'border-glow': 'borderGlow 0.3s ease-out forwards',
        'menu-slide': 'menuSlide 0.2s ease-out',
        'shimmer': 'shimmer 1.5s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'pop': 'pop 0.3s ease-out',
        'jelly': 'jelly 0.6s ease-out',
        'cherry-blossom': 'cherryBlossom 0.8s ease-out',
        'fall': 'fall 15s linear forwards',
        'sway': 'sway 5s ease-in-out infinite',
        'burst': 'burst 0.5s ease-out forwards',
        'heart-beat': 'heartBeat 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        bounceSmall: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-3px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        borderGlow: {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 94, 151, 0)' },
          '100%': { boxShadow: '0 0 0 4px rgba(255, 94, 151, 0.2)' },
        },
        menuSlide: {
          '0%': { width: '0%' },
          '100%': { width: '100%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        jelly: {
          '0%': { transform: 'scale(1, 1)' },
          '30%': { transform: 'scale(1.15, 0.9)' },
          '40%': { transform: 'scale(0.9, 1.1)' },
          '60%': { transform: 'scale(1.05, 0.95)' },
          '100%': { transform: 'scale(1, 1)' },
        },
        cherryBlossom: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(15deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        fall: {
          '0%': { 
            transform: 'translateY(0) rotate(0deg)', 
            opacity: '0' 
          },
          '10%': { 
            opacity: '1' 
          },
          '90%': { 
            opacity: '1' 
          },
          '100%': { 
            transform: 'translateY(100vh) rotate(360deg)', 
            opacity: '0' 
          }
        },
        sway: {
          '0%': { transform: 'translateX(0) rotate(0deg)' },
          '25%': { transform: 'translateX(15px) rotate(15deg)' },
          '50%': { transform: 'translateX(0) rotate(0deg)' },
          '75%': { transform: 'translateX(-15px) rotate(-15deg)' },
          '100%': { transform: 'translateX(0) rotate(0deg)' },
        },
        burst: {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)', opacity: '0.5' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        heartBeat: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.4)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}