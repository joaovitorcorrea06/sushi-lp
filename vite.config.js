import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@react-three") || id.includes("/three/")) {
            return "three-vendor";
          }

          if (id.includes("/gsap/")) {
            return "gsap-vendor";
          }

          if (id.includes("/motion/")) {
            return "motion-vendor";
          }

          return undefined;
        },
      },
    },
  },
});
