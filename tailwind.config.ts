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
          dark: '#182F57',
          DEFAULT: '#1B4661',
          light: '#19454B',
        },
        ice: '#1B6156',
        ink: '#18573B',
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
