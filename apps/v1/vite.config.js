import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  base: '/3d-map/',
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      include: "**/*.svg",
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@plug/v1': path.resolve(__dirname, './src')
    },
  },
  assetsInclude: ['**/*.glb'],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['app.pluxity.com'],
    proxy: {
      '/api': {
        target: 'http://api.pluxity.com:8080',
        rewrite: (path) => path.replace(/api/, ''),
      },
    },
  },
});
