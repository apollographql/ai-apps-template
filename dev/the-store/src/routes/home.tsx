import { useApp } from "@apollo/client-ai-apps/react";
import { gql, type TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import type { TopProductsQuery, TopProductsQueryVariables } from "@/gql/types";
import { ProductTile } from "@/components/ProductTile";
import { Button } from "@/components/Button";
import { CategoryTile } from "@/components/CategoryTile";
import { PageSpinner } from "@/components/PageSpinner";

const TOP_PRODUCTS: TypedDocumentNode<
  TopProductsQuery,
  TopProductsQueryVariables
> = gql`
  query TopProducts
  @prefetch
  @tool(
    name: "Top-Products"
    description: "Shows the currently highest rated products."
  ) {
    topProducts {
      id
      ...ProductTile_product
    }
    categories {
      slug
      ...CategoryTile_category
    }
  }
`;

function App() {
  const app = useApp();
  const { loading, error, data } = useQuery(TOP_PRODUCTS);

  if (error) return <p>Error : {error.message}</p>;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Top Products</h1>
        <Button
          variant="secondary"
          onClick={async () => {
            app.sendMessage({
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Based on what you know about me, what products should I look at? Inspire me!",
                },
              ],
            });
          }}
        >
          ✨ Inspire me
        </Button>
      </div>
      {loading ?
        <PageSpinner />
      : <>
          <div className="grid grid-cols-[repeat(3,minmax(192px,1fr))] gap-4 mb-8">
            {data?.topProducts.map((product) => (
              <ProductTile key={product.id} product={product} />
            ))}
          </div>

          <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
          <div className="grid grid-cols-3 gap-4">
            {data?.categories.map((category) => (
              <CategoryTile key={category.slug} category={category} />
            ))}
          </div>
        </>
      }
    </>
  );
}

export default App;
