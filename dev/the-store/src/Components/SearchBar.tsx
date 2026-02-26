import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "./Button";

function SearchBar() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full mb-8">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for products..."
          className="flex-1 px-4 py-2 h-12 rounded-lg border border-primary hover:border-primary-hover focus:outline-none focus:border-2 focus:border-focused bg-input transition-colors"
        />
        <Button type="submit" size="lg" variant="primary">
          Search
        </Button>
      </div>
    </form>
  );
}

export default SearchBar;
