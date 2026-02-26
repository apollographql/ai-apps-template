import { useApp } from "@apollo/client-ai-apps/react";
import { gql, type TypedDocumentNode } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Link } from "react-router";
import type { TopProductsQuery, TopProductsQueryVariables } from "@/gql/types";
import { ProductTile } from "./ProductTile";
import { Button } from "./Button";

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
      image
      name
      slug
    }
  }
`;

function App() {
  const app = useApp();
  const { loading, error, data } = useQuery(TOP_PRODUCTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
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
      <div className="grid grid-cols-[repeat(auto-fit,minmax(192px,1fr))] gap-4 mb-8">
        {data?.topProducts.map((product) => (
          <ProductTile key={product.id} product={product} />
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-3 gap-4">
          {data?.categories.map((category) => (
            <Link
              key={category.slug}
              to={`/products/${category.slug}`}
              className="block"
            >
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-100">
                <div className="relative h-48 w-full">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover absolute inset-0"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 flex items-end justify-center pb-4">
                    <h3 className="text-white text-xl font-bold text-center px-4 drop-shadow-lg">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
