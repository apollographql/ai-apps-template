import { gql, type TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Link, useParams } from "react-router";
import type {
  Category,
  ProductsQuery,
  ProductsQueryVariables,
} from "@/gql/types";
import { createHydrationUtils, reactive } from "@apollo/client-ai-apps/react";
import { ProductTile } from "@/components/ProductTile";
import { SkeletonTile } from "@/components/SkeletonTile";
import { Button } from "@/components/Button";
import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";

const PRODUCTS: TypedDocumentNode<ProductsQuery, ProductsQueryVariables> = gql`
  query BrowseProducts(
    $category: Category!
    $sortBy: String
    $order: Order
    $limit: Int
    $skip: Int
  )
  @tool(
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

  const [variables, setVariables] = useHydratedVariables({
    category: reactive(params.category),
    sortBy: "title",
    order: "asc",
    limit: ITEMS_PER_PAGE,
    skip: 0,
  });

  const { category, sortBy, order } = variables;

  const { loading, error, data } = useQuery(PRODUCTS, { variables });

  if (!category) {
    return <p>Invalid category</p>;
  }

  if (error) {
    return <p>Error: {error ? error.message : "Could not fetch data"}</p>;
  }

  const limit = variables.limit ?? data?.products.limit ?? ITEMS_PER_PAGE;
  const total = data?.products.total ?? 0;
  const skip = data?.products.skip ?? 0;
  const totalPages = Math.ceil(total / limit);
  const categoryInfo = data?.categories.find((c) => c.slug === category);
  const displayName = categoryInfo?.name || category;
  const currentPage = Math.floor(skip / limit) + 1;

  function getSkipForPage(page: number) {
    return (page - 1) * limit;
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <Link
          to="/home"
          className="hover:text-secondary hover:underline transition-colors"
        >
          Products
        </Link>
        <ChevronRight size={16} className="text-icon-secondary" />
        <span className="font-semibold">{displayName}</span>
      </div>

      <h1 className="text-3xl font-bold mb-2">{displayName}</h1>

      <div className="flex items-center justify-between mb-6">
        <p className="text-secondary">
          Showing {loading ? "?" : skip + 1}-
          {loading ? "?" : skip + (data?.products?.results.length ?? 1)} of{" "}
          {loading ? "?" : total || 0} products
        </p>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2">
            <span className="text-sm font-medium text-heading">Sort by:</span>
            <select
              value={sortBy ?? undefined}
              onChange={(e) => {
                setVariables({ sortBy: e.target.value, skip: 0 });
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
                setVariables({ order: e.target.value as Order, skip: 0 });
              }}
              className="border border-primary hover:border-primary-hover bg-input rounded px-2 py-1 transition-colors"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(3,minmax(192px,1fr))] gap-4">
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
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onChangePage={(page) => setVariables({ skip: getSkipForPage(page) })}
        />
      )}
    </>
  );
}

function Pagination({
  currentPage,
  totalPages,
  onChangePage,
}: {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
}) {
  return (
    <div className="flex items-center justify-center gap-4 mt-4">
      <Button
        onClick={() => onChangePage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        variant="hidden"
        size="sm"
        iconLeft={ArrowLeft}
      >
        Previous
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          if (
            page === 1 ||
            page === totalPages ||
            (page >= currentPage - 1 && page <= currentPage + 1)
          ) {
            return (
              <Button
                key={page}
                onClick={() => onChangePage(page)}
                className={page === currentPage ? "bg-selected text-white" : ""}
                variant="secondary"
                size="sm"
              >
                {page}
              </Button>
            );
          } else if (page === currentPage - 2 || page === currentPage + 2) {
            return (
              <span key={page} className="px-2">
                &hellip;
              </span>
            );
          }
          return null;
        })}
      </div>

      <Button
        onClick={() => onChangePage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        variant="hidden"
        size="sm"
        iconRight={ArrowRight}
      >
        Next
      </Button>
    </div>
  );
}

export default Products;
