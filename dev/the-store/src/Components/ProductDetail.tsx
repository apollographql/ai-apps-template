import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { useParams, Link, useNavigate } from "react-router";

const GET_PRODUCT = gql`
  query Product($id: ID!) @tool(name: "Get Product", description: "Shows the details page for a specific product.") {
    product(id: $id) {
      id
      title
      rating
      price
      description
      images
    }
  }
`;

const ADD_TO_CART = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!)
  @tool(name: "Add to Cart", description: "Adds a product to the users shopping cart.") {
    addToCart(productId: $productId, quantity: $quantity) {
      id
    }
  }
`;

type Product = {
  id: string;
  title: string;
  rating: number;
  price: number;
  description: string;
  images: string[];
};

function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { loading, error, data } = useQuery<{ product: Product }>(GET_PRODUCT, {
    variables: { id },
    fetchPolicy: "cache-and-network",
    returnPartialData: true,
  });
  const [addToCart, { loading: addingToCart }] = useMutation(ADD_TO_CART, {
    onCompleted: () => {
      navigate("/cart");
    },
  });

  const handleAddToCart = () => {
    if (id) {
      addToCart({
        variables: { productId: id, quantity: 1 },
      });
    }
  };

  if (loading && !data?.product) return <p>Loading...</p>;
  if (error && !data?.product) return <p>Error: {error.message}</p>;
  if (!data?.product) return <p>Product not found</p>;

  const product = data.product;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/home" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Products
      </Link>

      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-2">
            {product.images && product.images.length > 0 ? (
              product.images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.title} - Image ${index + 1}`}
                  className="w-full h-48 object-cover rounded"
                />
              ))
            ) : (
              // Skeleton loader
              [...Array(4)].map((_, index) => (
                <div key={index} className="w-full h-48 rounded animate-pulse">
                  <svg
                    className="w-full h-full"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                  >
                    <rect
                      width="100"
                      height="100"
                      fill="#e5e7eb"
                      rx="4"
                      ry="4"
                    />
                    <rect
                      x="35"
                      y="30"
                      width="30"
                      height="25"
                      fill="#d1d5db"
                      rx="2"
                      ry="2"
                    />
                    <circle cx="50" cy="65" r="8" fill="#d1d5db" />
                  </svg>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex-1">
          <p className="text-gray-600 mb-2">⭐ {product.rating}</p>
          <p className="text-green-600 font-bold text-2xl mb-4">${product.price?.toFixed(2)}</p>
          {product.description ? (
            <p className="text-gray-700 mb-4">{product.description}</p>
          ) : (
            <div className="mb-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          )}
          <button
            onClick={handleAddToCart}
            disabled={addingToCart}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded"
          >
            {addingToCart ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
