import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Link, useParams } from "react-router";
import { useState } from "react";

const PRODUCTS = gql`
  query Products($category: Category!, $sortBy: String, $order: Order, $limit: Int, $skip: Int) @tool(name: "Browse Products", description: "Shows products in a specific category with sorting and pagination options.") {
    products(category: $category, sortBy: $sortBy, order: $order, limit: $limit, skip: $skip) {
      limit
      skip
      total
      results {
        id
        title
        rating
        price
        thumbnail
      }
    }
    categories {
      name
      slug
    }
  }
`;

type Order = "asc" | "desc";

type Product = {
  id: string;
  title: string;
  rating: number;
  price: number;
  thumbnail: string;
};

type CategoryInfo = {
  name: string;
  slug: string;
};

type ProductsResponse = {
  products: {
    limit: number;
    skip: number;
    total: number;
    results: Product[];
  };
  categories: CategoryInfo[];
};

const ITEMS_PER_PAGE = 10;

function Products() {
  const { category } = useParams<{ category: string }>();
  const [sortBy, setSortBy] = useState<string>("title");
  const [order, setOrder] = useState<Order>("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const skip = (currentPage - 1) * ITEMS_PER_PAGE;

  const { loading, error, data } = useQuery<ProductsResponse>(PRODUCTS, {
    variables: {
      category,
      sortBy,
      order,
      limit: ITEMS_PER_PAGE,
      skip,
    },
  });

  if (!category) {
    return <p>Invalid category</p>;
  }

  const totalPages = Math.ceil((data?.products.total || 0) / ITEMS_PER_PAGE);
  const categoryInfo = data?.categories.find((c) => c.slug === category);
  const displayName = categoryInfo?.name || category;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{displayName}</h1>

      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          {loading ? (
            "Loading..."
          ) : (
            <>Showing {data?.products.results.length || 0} of {data?.products.total || 0} products</>
          )}
        </p>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="border rounded px-3 py-1"
            >
              <option value="title">Title</option>
              <option value="rating">Rating</option>
              <option value="price">Price</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="text-sm font-medium">Order:</span>
            <select
              value={order}
              onChange={(e) => {
                setOrder(e.target.value as Order);
                setCurrentPage(1);
              }}
              className="border rounded px-3 py-1"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-8">
        {loading ? (
          Array.from({ length: ITEMS_PER_PAGE }).map((_, index) => (
            <div key={index} className="border rounded-lg p-4 w-48 shadow-sm animate-pulse">
              <div className="w-full h-32 bg-gray-300 rounded mb-2"></div>
              <div className="h-6 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-20 mb-1"></div>
              <div className="h-5 bg-gray-300 rounded w-16"></div>
            </div>
          ))
        ) : (
          data?.products.results.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`} className="block">
              <div className="border rounded-lg p-4 w-48 shadow-sm hover:shadow-md transition-shadow">
                <img src={product.thumbnail} alt={product.title} className="w-full h-32 object-cover rounded mb-2" />
                <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                <p className="text-gray-600 mb-1">⭐ {product.rating}</p>
                <p className="text-green-600 font-medium">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 border rounded ${
                      page === currentPage
                        ? "bg-purple-600 text-white"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                );
              } else if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page}>...</span>;
              }
              return null;
            })}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Products;
