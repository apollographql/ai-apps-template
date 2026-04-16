import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  globalTeardown: "./e2e/global-teardown.js",
  webServer: [
    {
      command: "npx serve-impostor-host --playwright",
      url: "http://localhost:8080",
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "docker compose up --build",
      cwd: "e2e",
      url: "http://localhost:8000/health",
      reuseExistingServer: !process.env.CI,
    },
  ],
  workers: 1,
  use: {
    browserName: "chromium",
  },
});
