import { MemoryRouter, Route, Routes } from "react-router";
import { useToolInput, useToolName } from "@apollo/client-ai-apps/react";
import { useState } from "react";
import HomeRoute from "./routes/home";
import ProductDetailRoute from "./routes/products.$id";
import CategoryDetailRoute from "./routes/categories.$slug";
import CartRoute from "./routes/cart";
import SearchRoute from "./routes/search";
import SearchBar from "./components/SearchBar";
import NotFound from "./routes/$";
import { MainHeader } from "./components/MainHeader";

function App() {
  const toolName = useToolName();
  const toolInput = useToolInput();
  const [initialRoute] = useState(getInitialRoute);

  function getInitialRoute() {
    switch (toolName) {
      case "Top-Products":
        return "/hom";
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
        <MainHeader />
        <SearchBar />
        <Routes>
          <Route path="/home" element={<HomeRoute />} />
          <Route path="/products/:id" element={<ProductDetailRoute />} />
          <Route
            path="/categories/:category"
            element={<CategoryDetailRoute />}
          />
          <Route path="/cart" element={<CartRoute />} />
          <Route path="/search" element={<SearchRoute />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </MemoryRouter>
  );
}

export default App;
