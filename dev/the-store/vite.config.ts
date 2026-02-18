import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { apolloClientAiApps, devTarget } from "@apollo/client-ai-apps/vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import tailwindcss from "@tailwindcss/vite";
import { mcpInspector } from "@mcpjam/inspector/vite";

const target = devTarget(process.env.TARGET);

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: "../../apps/the-store",
    emptyOutDir: true,
    watch:
      process.argv.includes("--watch") ?
        { exclude: [".application-manifest.json"] }
      : undefined,
  },
  resolve: {
    alias: {
      "@/gql/types": fileURLToPath(
        new URL("./src/gql/__generated__/types.ts", import.meta.url)
      ),
    },
  },
  plugins: [
    apolloClientAiApps({
      targets: ["mcp", "openai"],
      devTarget: target,
    }),
    react(),
    tailwindcss(),
    mcpInspector({
      server: {
        name: "My MCP Server",
        url: `http://localhost:8000/mcp?app=the-store&appTarget=${target}`,
      },
      defaultTab: "app-builder",
    }),
    viteSingleFile(),
  ],
});
