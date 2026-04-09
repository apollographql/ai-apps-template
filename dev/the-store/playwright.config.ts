import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  webServer: [
    {
      command: "npx serve-impostor-host --playwright",
      url: "http://localhost:8080",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "docker compose up --build",
      url: "http://localhost:8000/health",
      reuseExistingServer: !process.env.CI,
    },
  ],
  workers: process.env.CI ? 1 : undefined,
  use: {
    browserName: "chromium",
  },
});
