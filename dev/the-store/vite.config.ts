import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { ApplicationManifestPlugin, AbsoluteAssetImportsPlugin } from "@apollo/client-ai-apps/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import tailwindcss from "@tailwindcss/vite";
import { mcpInspector } from "@mcpjam/inspector/vite";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "../../apps/the-store",
    emptyOutDir: true,
    watch: {
      exclude: [".application-manifest.json"],
    },
  },
  plugins: [
    ApplicationManifestPlugin(),
    react(),
    tailwindcss(),
    AbsoluteAssetImportsPlugin(),
    mcpInspector({
      server: {
        name: "My MCP Server",
        url: "http://localhost:8000/mcp?app=the-store",
      },
      defaultTab: "app-builder",
    }),
    viteSingleFile(),
  ],
});
