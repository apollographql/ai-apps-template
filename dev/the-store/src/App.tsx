import Home from "./Components/Home";
import ProductDetail from "./Components/ProductDetail";
import Products from "./Components/Products";
import Cart from "./Components/Cart";
import SearchBar from "./Components/SearchBar";
import SearchResults from "./Components/SearchResults";
import { Link, MemoryRouter, Route, Routes } from "react-router";
import { useToolInput, useToolName } from "@apollo/client-ai-apps/react";
import { useState } from "react";
import { Logo } from "./Components/Logo";

function App() {
  const toolName = useToolName();
  const toolInput = useToolInput();
  const [initialRoute] = useState(getInitialRoute);

  function getInitialRoute() {
    switch (toolName) {
      case "Top-Products":
        return "/home";
      case "Get-Product":
        return `/product/${toolInput?.id}`;
      case "View-Cart":
      case "Update-cart-item-quantity":
      case "Add-to-Cart":
        return "/cart";
      case "Search-Products":
        return `/search?q=${encodeURIComponent(toolInput?.query as string)}`;
      case "Browse-Products":
        return `/products/${toolInput?.category}`;
      default: {
        console.warn(`Unable to match route for tool '${toolName}`);
        return "/";
      }
    }
  }

  return (
    <MemoryRouter initialEntries={[initialRoute]}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between gap-2 mb-4">
          <Link to="/home" className="flex gap-2 items-center">
            <Logo className="size-10 text-primary dark:text-white" />
            <h1 className="text-2xl font-bold">Apollo Store</h1>
          </Link>
          <Link to="/cart" className="underline underline-offset-4 font-medium">
            Cart
          </Link>
        </div>

        <SearchBar />
        <Routes>
          <Route index element={<div>Loading...</div>} />
          <Route path="/home" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/products/:category" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/search" element={<SearchResults />} />
        </Routes>
      </div>
    </MemoryRouter>
  );
}

export default App;
