import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import vike from 'vike/plugin';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), vike({
    prerender: true
  })],
  base: "/", // because we are deploying to https://nathanredblur.dev/
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
    },
  },
});
