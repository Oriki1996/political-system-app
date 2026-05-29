import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Split heavy third-party libs out of the app/content chunks so they
        // cache independently and don't bloat the initial download.
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("framer-motion")) return "vendor-motion";
          if (id.includes("lucide-react")) return "vendor-icons";
          if (id.includes("react") || id.includes("scheduler")) return "vendor-react";
          return "vendor";
        },
      },
    },
  },
});
