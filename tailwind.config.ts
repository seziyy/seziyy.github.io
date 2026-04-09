import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        night: {
          50: '#e6eef9',
          100: '#c2d8f0',
          200: '#9ac0e7',
          300: '#72a8dd',
          400: '#4a90d4',
          500: '#2c5f8d',
          600: '#1e4772',
          700: '#162f57',
          800: '#0e1f3d',
          900: '#060f23',
          950: '#030712',
        },
        daisy: {
          50: '#fffef0',
          100: '#fffbd1',
          200: '#fff7a3',
          300: '#ffef75',
          400: '#ffe347',
          500: '#ffd319',
          600: '#f5c000',
          700: '#c79900',
          800: '#997600',
          900: '#6b5200',
        }
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.1)' },
        }
      }
    },
  },
  plugins: [],
}
export default config
