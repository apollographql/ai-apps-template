import { Link } from "react-router";
import { Logo } from "./Logo";
import { Platform } from "@apollo/client-ai-apps";
import { ShoppingCart } from "lucide-react";

export function MainHeader() {
  return (
    <div className="flex items-center justify-between gap-2 mb-4">
      <Link to="/home" className="flex gap-2 items-center">
        <Logo className="size-10 text-primary dark:text-white" />
        <h1 className="text-2xl font-bold">
          {Platform.select({
            mcp: "Apollo MCP Store",
            openai: "Apollo ChatGPT Store",
          })}
        </h1>
      </Link>
      <Link to="/cart" className="font-medium flex items-center gap-1">
        <ShoppingCart size={20} />
        Cart
      </Link>
    </div>
  );
}
