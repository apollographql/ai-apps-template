import { gql, type TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { useParams } from "react-router";
import { useState } from "react";
import type {
  Category,
  ProductsQuery,
  ProductsQueryVariables,
} from "@/gql/types";
import { createHydrationUtils, reactive } from "@apollo/client-ai-apps/react";
import { ProductTile } from "./ProductTile";
import { SkeletonTile } from "./SkeletonTile";
import { Button } from "./Button";

const PRODUCTS: TypedDocumentNode<ProductsQuery, ProductsQueryVariables> = gql`
  query Products(
    $category: Category!
    $sortBy: String
    $order: Order
    $limit: Int
    $skip: Int
  )
  @tool(
    name: "Browse-Products"
    description: "Shows products in a specific category with sorting and pagination options."
  ) {
    products(
      category: $category
      sortBy: $sortBy
      order: $order
      limit: $limit
      skip: $skip
    ) {
      limit
      skip
      total
      results {
        id
        ...ProductTile_product
      }
    }
    categories {
      name
      slug
    }
  }
`;

const { useHydratedVariables } = createHydrationUtils(PRODUCTS);

type Order = "asc" | "desc";

const ITEMS_PER_PAGE = 10;

function Products() {
  const params = useParams() as { category: Category };
  const [currentPage, setCurrentPage] = useState(1);

  const [variables, setVariables] = useHydratedVariables({
    category: reactive(params.category),
    sortBy: "title",
    order: "asc",
    limit: ITEMS_PER_PAGE,
    skip: reactive((currentPage - 1) * ITEMS_PER_PAGE),
  });

  const { category, sortBy, order } = variables;

  const { loading, error, data } = useQuery(PRODUCTS, { variables });

  if (!category) {
    return <p>Invalid category</p>;
  }

  const totalPages = Math.ceil((data?.products.total || 0) / ITEMS_PER_PAGE);
  const categoryInfo = data?.categories.find((c) => c.slug === category);
  const displayName = categoryInfo?.name || category;

  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-2">{displayName}</h1>

      <div className="flex items-center justify-between mb-6">
        <p className="text-secondary">
          Showing {loading ? "?" : data?.products.results.length || 0} of{" "}
          {loading ? "?" : data?.products.total || 0} products
        </p>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium text-heading">Sort by:</span>
            <select
              value={sortBy ?? undefined}
              onChange={(e) => {
                setVariables({ sortBy: e.target.value });
                setCurrentPage(1);
              }}
              className="border border-primary hover:border-primary-hover bg-input rounded px-2 py-1 transition-colors"
            >
              <option value="title">Title</option>
              <option value="rating">Rating</option>
              <option value="price">Price</option>
            </select>
          </label>

          <label className="flex items-center gap-2">
            <span className="text-sm font-medium text-heading">Order:</span>
            <select
              value={order ?? undefined}
              onChange={(e) => {
                setVariables({ order: e.target.value as Order });
                setCurrentPage(1);
              }}
              className="border border-primary hover:border-primary-hover bg-input rounded px-2 py-1 transition-colors"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(192px,1fr))] gap-4">
        {loading ?
          Array.from({ length: 9 }).map((_, index) => (
            <SkeletonTile key={index} />
          ))
        : data?.products.results.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))
        }
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            variant="hidden"
            size="sm"
          >
            Previous
          </Button>

          <div className="flex items-center gap-1">
            {Array.from({ length: 5 /* totalPages */ }, (_, i) => i + 1).map(
              (page) => {
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={
                        page === currentPage ? "bg-selected text-white" : ""
                      }
                      variant="secondary"
                      size="sm"
                    >
                      {page}
                    </Button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return (
                    <span key={page} className="px-2">
                      &hellip;
                    </span>
                  );
                }
                return null;
              }
            )}
          </div>

          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            variant="hidden"
            size="sm"
          >
            Next
          </Button>
        </div>
      )}
    </>
  );
}

export default Products;
