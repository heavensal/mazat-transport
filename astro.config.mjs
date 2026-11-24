import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  trailingSlash: 'always',
  redirects: {
    '/export-maritime': '/international-maritime/',
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
