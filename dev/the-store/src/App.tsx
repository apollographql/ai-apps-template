import { MemoryRouter, Route, Routes } from "react-router";
import { useToolInfo } from "@apollo/client-ai-apps/react";
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
  const toolInfo = useToolInfo();
  const [initialRoute] = useState(getInitialRoute);

  function getInitialRoute() {
    switch (toolInfo?.toolName) {
      case "TopProducts":
        return "/home";
      case "GetProduct":
        return `/products/${toolInfo.toolInput.id}`;
      case "ViewCart":
      case "UpdateCartItemQuantity":
      case "AddToCart":
        return "/cart";
      case "SearchProducts":
        return `/search?q=${encodeURIComponent(toolInfo.toolInput.query)}`;
      case "BrowseProducts":
        return `/categories/${toolInfo.toolInput.category}`;
      default: {
        // @ts-expect-error Fallthrough case for `toolInfo` which should be
        // `never`. If expect-error is reported as unused, it means there is a
        // missing case above.
        console.warn(`Unable to match route for tool '${toolInfo?.toolName}`);
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
