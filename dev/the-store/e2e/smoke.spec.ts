import { test } from "@apollo/mcp-impostor-host/playwright";
import { expect } from "@playwright/test";

test("Smoke", async ({ mcpHost }) => {
  const connection = await mcpHost.connect({
    url: "http://localhost:8000/mcp?app=the-store&appTarget=mcp",
  });
  const { appFrame } = await connection.callTool("TopProducts");

  await expect(appFrame.locator("h1")).toHaveText("Apollo MCP Store");

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
