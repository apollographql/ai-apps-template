import { useSendFollowUpMessage } from "@apollo/client-ai-apps";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import { Link } from "react-router";

const TOP_PRODUCTS = gql`
  query TopProducts @prefetch @tool(name: "Top Products", description: "Shows the currently highest rated products.") {
    topProducts {
      id
      title
      rating
      price
      thumbnail
    }
    categories {
      image
      name
      slug
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

type Category = {
  image: string;
  name: string;
  slug: string;
};

function App() {
  const { loading, error, data } = useQuery<{ topProducts: Product[]; categories: Category[] }>(TOP_PRODUCTS);
  const sendPrompt = useSendFollowUpMessage();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Top Products</h1>
        <button
          onClick={async () => {
            sendPrompt("Based on what you know about me, what products should I look at? Inspire me!");
          }}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          ✨ Inspire me
        </button>
      </div>
      <div className="flex flex-wrap gap-4 mb-8">
        {data?.topProducts.map((product) => (
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

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Shop by Category</h2>
        <div className="grid grid-cols-3 gap-4">
          {data?.categories.map((category) => (
            <Link key={category.slug} to={`/products/${category.slug}`} className="block">
              <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-100">
                <div className="relative h-48 w-full">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover absolute inset-0"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/20 flex items-end justify-center pb-4">
                    <h3 className="text-white text-xl font-bold text-center px-4 drop-shadow-lg">{category.name}</h3>
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
