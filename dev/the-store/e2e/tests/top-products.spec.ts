import { test } from "@apollo/mcp-impostor-host/playwright";
import { expect } from "@playwright/test";

const URL = "http://localhost:8000/mcp?app=the-store&appTarget=mcp";

test("displays top products and categories", async ({ mcpHost }) => {
  const connection = await mcpHost.connect({ url: URL });
  const { appFrame } = await connection.callTool("TopProducts");

  await expect(appFrame.locator("h1")).toHaveText("Apollo MCP Store");
  await expect(appFrame.getByText("Top Products")).toBeVisible();
  await expect(appFrame.getByText("Shop by Category")).toBeVisible();
});

test("inspire me sends a message", async ({ mcpHost }) => {
  const connection = await mcpHost.connect({ url: URL });
  const { appFrame } = await connection.callTool("TopProducts");

  await appFrame.getByRole("button", { name: "Inspire me" }).click();
  const message = await connection.waitForMessageRequest();

  expect(message).toEqual({
    role: "user",
    content: [
      {
        type: "text",
        text: expect.stringContaining("Based on what you know about me"),
      },
    ],
  });
});
