import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ApplicationManifestPlugin } from "@apollo/client-ai-apps/vite";
import path from "path";
import { viteSingleFile } from "vite-plugin-singlefile";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "../../apps/the-store",
    emptyOutDir: true,
    watch: {
      exclude: [".application-manifest.json"],
    },
  },
  resolve: {
    alias: {
      react: path.resolve(__dirname, "node_modules/react"),
      "react-dom": path.resolve(__dirname, "node_modules/react-dom"),
    },
  },
  plugins: [ApplicationManifestPlugin(), react(), tailwindcss(), viteSingleFile()],
});
