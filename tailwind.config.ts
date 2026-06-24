import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './data/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#293681',
          DEFAULT: '#4274d9',
          light: '#95ccdd',
        },
        ice: '#d0e7e6',
        ink: '#1E2430',
      },
      fontFamily: {
        // Inter, layout.tsx içinde next/font/google ile yüklenip
        // --font-inter CSS değişkeni olarak veriliyor.
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
