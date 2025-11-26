import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Link, useSearchParams } from "react-router";

const SEARCH_QUERY = gql`
  query SearchQuery($query: String!) @tool(name: "Search Products", description: "Searches for products based on a search query.") {
    search(query: $query) {
      id
      title
      rating
      price
      thumbnail
    }
  }
`;

type Product = {
  id: string;
  title: string;
  rating: number;
  price: number;
  thumbnail: string;
};

function SearchResults() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";

  const { loading, error, data } = useQuery<{ search: Product[] }>(SEARCH_QUERY, {
    variables: { query },
    skip: !query,
  });

  if (!query) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Search Results</h1>
        <p className="text-gray-600">Please enter a search query.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 w-48 shadow-sm animate-pulse">
              <div className="w-full h-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
              <div className="h-5 bg-gray-300 rounded w-16"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
      {data?.search && data.search.length > 0 ? (
        <div className="flex flex-wrap gap-4">
          {data.search.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="block">
              <div className="border rounded-lg p-4 w-48 shadow-sm hover:shadow-md transition-shadow">
                <img src={product.thumbnail} alt={product.title} className="w-full h-32 object-cover rounded mb-2" />
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <p className="text-gray-600 mb-1">⭐ {product.rating}</p>
                <p className="text-green-600 font-medium">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No products found matching your search.</p>
      )}
    </div>
  );
}

export default SearchResults;
