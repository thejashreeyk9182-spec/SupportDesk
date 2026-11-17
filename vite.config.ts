
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],

  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "react-vendor",
              test: /node_modules\/react\//,
            },
            {
              name: "react-dom-vendor",
              test: /node_modules\/react-dom\//,
            },
            {
              name: "router-vendor",
              test: /node_modules\/react-router-dom\//,
            },
            {
              name: "redux-vendor",
              test: /node_modules\/(@reduxjs\/toolkit|react-redux)\//,
            },
          ],
        },
      },
    },
  },

  test: {
    environment: "jsdom",
    setupFiles: "./src/setupTests.ts",
    globals: true,
    css: true,

    coverage: {
      provider: "istanbul",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/setupTests.ts",
      ],
    },
  },
});
