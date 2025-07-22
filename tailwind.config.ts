import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './pages/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        luxeBlack: '#0a0a0a',
        luxeGold: '#d4af37',
        luxeWhite: '#f8f8f8',
      },
    },
  },
  plugins: [],
};

export default config;
