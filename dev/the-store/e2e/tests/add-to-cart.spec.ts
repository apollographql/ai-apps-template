import { test } from "@apollo/mcp-impostor-host/playwright";
import { expect } from "@playwright/test";

const URL = "http://localhost:8000/mcp?app=the-store&appTarget=mcp";

test("adds a product to the cart and shows cart page", async ({ mcpHost }) => {
  const connection = await mcpHost.connect({ url: URL });
  const { appFrame } = await connection.callTool("AddToCart", {
    productId: "1",
    quantity: 1,
  });

  await expect(
    appFrame.getByRole("heading", { level: 1, name: "Your Cart" })
  ).toBeVisible();
});
