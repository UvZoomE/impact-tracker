import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { configDefaults } from 'vitest/config';

export default defineConfig({
  plugins: [react()],

  preview: {
    host: true,
    port: 8080,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [...configDefaults.coverage.exclude, 'vite.config.js'],
    },
  },
});
