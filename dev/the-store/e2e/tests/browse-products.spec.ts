import { test } from "@apollo/mcp-impostor-host/playwright";
import { expect } from "@playwright/test";

const URL = "http://localhost:8000/mcp?app=the-store&appTarget=mcp";

test("displays products for a category", async ({ mcpHost }) => {
  const connection = await mcpHost.connect({ url: URL });
  const { appFrame } = await connection.callTool("BrowseProducts", {
    category: "smartphones",
  });

  await expect(
    appFrame.getByRole("heading", { level: 1, name: "Smartphones" })
  ).toBeVisible();
  await expect(
    appFrame.getByText(/Showing \d+-\d+ of \d+ products/)
  ).toBeVisible();
});

test("displays sort and order controls", async ({ mcpHost }) => {
  const connection = await mcpHost.connect({ url: URL });
  const { appFrame } = await connection.callTool("BrowseProducts", {
    category: "smartphones",
  });

  await expect(appFrame.getByLabel("Sort by:")).toBeVisible();
  await expect(appFrame.getByLabel("Order:")).toBeVisible();
});
