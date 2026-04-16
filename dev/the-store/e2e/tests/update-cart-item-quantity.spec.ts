import { test } from "@apollo/mcp-impostor-host/playwright";
import { expect } from "@playwright/test";

const URL = "http://localhost:8000/mcp?app=the-store&appTarget=mcp";

test("shows cart after updating item quantity", async ({ mcpHost }) => {
  const connection = await mcpHost.connect({ url: URL });

  // First add an item to the cart
  await connection.callTool("AddToCart", { productId: "1", quantity: 2 });

  // Then update its quantity
  const { appFrame } = await connection.callTool("UpdateCartItemQuantity", {
    cartItemId: "1",
    quantity: 5,
  });

  await expect(
    appFrame.getByRole("heading", { level: 1, name: "Your Cart" })
  ).toBeVisible();
});
