import { test } from "@apollo/mcp-impostor-host/playwright";
import { expect } from "@playwright/test";

test("Smoke", async ({ mcpHost }) => {
  const connection = await mcpHost.connect({
    url: "http://localhost:8000/mcp?app=the-store&appTarget=mcp",
  });
  const { appFrame } = await connection.callTool("TopProducts");

  await expect(appFrame.locator("body")).toHaveText("MCP Apps");
});
