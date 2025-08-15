// tailwind.config.ts
import type { Config } from 'tailwindcss';

export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // твои цвета
      colors: {
        base: { bg: '#f5f5f5', text: '#111111', line: '#d4d4d4' },
      },
      // твои радиусы
      borderRadius: { xl: '1rem' },

      // ВАЖНО: подключаем Manrope из next/font/local (CSS var)
      fontFamily: {
        sans: ['var(--font-manrope)', 'system-ui', 'Segoe UI', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
