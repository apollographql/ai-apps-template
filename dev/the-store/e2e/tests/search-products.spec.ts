import { test } from "@apollo/mcp-impostor-host/playwright";
import { expect } from "@playwright/test";

const URL = "http://localhost:8000/mcp?app=the-store&appTarget=mcp";

test("displays search results for a query", async ({ mcpHost }) => {
  const connection = await mcpHost.connect({ url: URL });
  const { appFrame } = await connection.callTool("SearchProducts", {
    query: "phone",
  });

  await expect(
    appFrame.getByRole("heading", {
      level: 1,
      name: 'Search Results for "phone"',
    })
  ).toBeVisible();
});

test("displays no results message for unknown query", async ({ mcpHost }) => {
  const connection = await mcpHost.connect({ url: URL });
  const { appFrame } = await connection.callTool("SearchProducts", {
    query: "xyznonexistent123",
  });

  await expect(
    appFrame.getByText("No products found matching your search.")
  ).toBeVisible();
});
