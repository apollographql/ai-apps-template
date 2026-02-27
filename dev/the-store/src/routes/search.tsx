import type { SearchQuery, SearchQueryVariables } from "@/gql/types";
import { gql, type TypedDocumentNode } from "@apollo/client";
import { createHydrationUtils, reactive } from "@apollo/client-ai-apps/react";
import { useQuery } from "@apollo/client/react";
import { useSearchParams } from "react-router";
import { ProductTile } from "@/components/ProductTile";
import { SkeletonTile } from "@/components/SkeletonTile";

const SEARCH_QUERY: TypedDocumentNode<SearchQuery, SearchQueryVariables> = gql`
  query SearchQuery($query: String!)
  @tool(
    name: "Search-Products"
    description: "Searches for products based on a search query."
  ) {
    search(query: $query) {
      id
      ...ProductTile_product
    }
  }
`;

const { useHydratedVariables } = createHydrationUtils(SEARCH_QUERY);

function SearchResults() {
  const [searchParams] = useSearchParams();

  const [variables] = useHydratedVariables({
    query: reactive(searchParams.get("q") || ""),
  });

  const { query } = variables;

  const { loading, error, data } = useQuery(SEARCH_QUERY, {
    variables,
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
      <>
        <h1 className="text-2xl font-bold mb-4">
          Search Results for "{query}"
        </h1>
        <div className="grid grid-cols-[repeat(3,minmax(192px,1fr))] gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonTile key={index} />
          ))}
        </div>
      </>
    );
  }
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
      {data?.search && data.search.length > 0 ?
        <div className="grid grid-cols-[repeat(3,minmax(192px,1fr))] gap-4 mb-8">
          {data.search.map((product) => (
            <ProductTile key={product.id} product={product} />
          ))}
        </div>
      : <p className="text-neutral">No products found matching your search.</p>}
    </>
  );
}

export default SearchResults;
