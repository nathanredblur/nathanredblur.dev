import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/", // because we are deploying to https://nathanredblur.dev/
  resolve: {
    alias: {
      "@": "/src",
      "@components": "/src/components",
    },
  },
});
