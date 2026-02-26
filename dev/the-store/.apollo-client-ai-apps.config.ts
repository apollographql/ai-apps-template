import { defineConfig } from "@apollo/client-ai-apps/config";

export default defineConfig({
  csp: {
    resourceDomains: [
      "https://cdn.dummyjson.com",
      "https://fonts.googleapis.com",
      "https://fonts.gstatic.com",
    ],
  },
});
