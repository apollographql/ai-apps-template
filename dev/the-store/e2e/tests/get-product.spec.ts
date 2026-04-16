import { test } from "@apollo/mcp-impostor-host/playwright";
import { expect } from "@playwright/test";

const URL = "http://localhost:8000/mcp?app=the-store&appTarget=mcp";

test("displays product details", async ({ mcpHost }) => {
  const connection = await mcpHost.connect({ url: URL });
  const { appFrame } = await connection.callTool("GetProduct", { id: "1" });

  await expect(
    appFrame.getByRole("heading", {
      level: 1,
      name: "Essence Mascara Lash Princess",
    })
  ).toBeVisible();
  await expect(
    appFrame.getByRole("button", { name: "Add to Cart" })
  ).toBeVisible();
});
