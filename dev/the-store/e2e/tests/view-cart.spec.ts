import { test } from "@apollo/mcp-impostor-host/playwright";
import { expect } from "@playwright/test";

const URL = "http://localhost:8000/mcp?app=the-store&appTarget=mcp";

test("displays the cart page", async ({ mcpHost }) => {
  const connection = await mcpHost.connect({ url: URL });
  const { appFrame } = await connection.callTool("ViewCart");

  await expect(
    appFrame.getByRole("heading", { level: 1, name: "Your Cart" })
  ).toBeVisible();
});
