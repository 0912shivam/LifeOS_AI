import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf7',
          100: '#d8f6ea',
          200: '#b3eed7',
          300: '#79dfbe',
          400: '#37c8a0',
          500: '#13ad86',
          600: '#0e8a6b',
          700: '#0d6e57',
          800: '#0d5846',
          900: '#0b493b'
        }
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(19,173,134,0.18), 0 20px 45px rgba(2,8,23,0.25)'
      },
      backgroundImage: {
        'mesh-gradient': 'radial-gradient(circle at top left, rgba(19,173,134,0.20), transparent 35%), radial-gradient(circle at top right, rgba(56,189,248,0.15), transparent 30%), linear-gradient(180deg, rgba(15,23,42,0.96), rgba(2,6,23,1))'
      }
    }
  },
  plugins: []
};

export default config;