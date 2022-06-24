/// <reference types="vitest" />
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: "./src/index.ts",
      name: "ReactSlots",
      formats: ["es", "cjs"],
      fileName: (format) => `react-slots.${format}.js`,
    },
    rollupOptions: {
      external: ["react"],
    },
  },
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
  },
});
