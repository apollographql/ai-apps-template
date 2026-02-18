import { defineConfig } from "@apollo/client-ai-apps/config";

export default defineConfig({
  entry: {
    staging: "https://my-awesome-site.com",
  },
  csp: {
    resourceDomains: ["https://cdn.dummyjson.com"],
  },
});
