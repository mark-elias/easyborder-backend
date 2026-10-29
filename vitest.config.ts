import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  plugins: [
    // SWC is used instead of ts-jest for much faster transpilation
    swc.vite({
      module: { type: 'nodenext' },
    }),
  ],
});
