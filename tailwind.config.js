/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#eef4ff',
          100: '#dbe6fe',
          200: '#bfd3fe',
          300: '#93b4fd',
          400: '#608dfa',
          500: '#3b66f6',
          600: '#2547eb',
          700: '#1d36d8',
          800: '#1e2fae',
          900: '#1e2b8a',
          950: '#0a1430'
        },
        royal: '#2547eb',
        cyansoft: '#22d3ee',
        emergency: {
          50: '#fef2f2',
          100: '#fee2e2',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c'
        },
        ink: '#0a1430'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Sora', 'Inter', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        soft: '0 8px 30px rgba(37, 71, 235, 0.08)',
        card: '0 4px 20px rgba(15, 23, 42, 0.06)',
        glow: '0 0 0 1px rgba(34,211,238,.35), 0 0 24px rgba(34,211,238,.35)',
        glowred: '0 0 0 1px rgba(239,68,68,.4), 0 8px 32px rgba(239,68,68,.45)',
        pop: '0 20px 60px -12px rgba(10,20,48,.35)'
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        'float-slow': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        shimmer: { '0%': { backgroundPosition: '-400px 0' }, '100%': { backgroundPosition: '400px 0' } },
        'pulse-ring': { '0%': { transform: 'scale(.7)', opacity: '.9' }, '100%': { transform: 'scale(1.6)', opacity: '0' } },
        gradient: { '0%,100%': { backgroundPosition: '0% 50%' }, '50%': { backgroundPosition: '100% 50%' } },
        ticker: { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } }
      },
      animation: {
        float: 'float 5s ease-in-out infinite',
        'float-slow': 'float-slow 6s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        'pulse-ring': 'pulse-ring 1.8s ease-out infinite',
        gradient: 'gradient 8s ease infinite'
      }
    }
  },
  plugins: []
};
