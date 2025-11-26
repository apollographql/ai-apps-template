import "./App.css";
import Home from "./Components/Home";
import ProductDetail from "./Components/ProductDetail";
import Products from "./Components/Products";
import Cart from "./Components/Cart";
import SearchBar from "./Components/SearchBar";
import SearchResults from "./Components/SearchResults";
import { Route, Routes, useNavigate } from "react-router";
import { useToolEffect } from "@apollo/client-ai-apps";

function App() {
  const navigate = useNavigate();

  useToolEffect("Top Products", () => navigate("/home"), [navigate]);
  useToolEffect("Get Product", (toolInput) => navigate(`/product/${toolInput.id}`), [navigate]);
  useToolEffect(["View Cart", "Update cart item quantity", "Add to Cart"], () => navigate("/cart"), [navigate]);
  useToolEffect("Search Products", (toolInput) => navigate(`/search?q=${encodeURIComponent(toolInput.query)}`), [
    navigate,
  ]);
  useToolEffect("Browse Products", (toolInput) => navigate(`/products/${toolInput.category}`), [navigate]);

  return (
    <div className="container mx-auto px-4 py-6">
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
  );
}

export default App;
