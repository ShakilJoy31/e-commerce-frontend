// vite.config.ts
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Better solution for global polyfill
      global: path.resolve(__dirname, "./src/globals.js"),
    },
  },
  define: {
    // Ensure global is defined for browser environment
    global: "window",
    // If you need process.env support
    "process.env": process.env,
  },
  optimizeDeps: {
    include: [
      "jwt-decode",
      "buffer",
      "process",
      "draft-js",
      "react-draft-wysiwyg",
    ],
    esbuildOptions: {
      // Additional global definitions
      define: {
        global: "window",
      },
    },
  },
});