import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import type { Config } from 'tailwindcss';

export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],

  theme: {
    extend: {
      colors: {
        custom: {
          dark: '#001514',  // Very dark green-black
          red: '#B82132',   // Deep red
          coral: '#D2665A', // Coral
          peach: '#F2B28C', // Peach
          blush: '#F6DED8', // Soft blush
        },
      },
    },
  },

  plugins: [typography, forms, containerQueries]
} satisfies Config;