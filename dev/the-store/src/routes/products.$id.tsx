import type {
  AddToCartMutation,
  AddToCartMutationVariables,
  ProductQuery,
  ProductQueryVariables,
} from "@/gql/types";
import { gql, type TypedDocumentNode } from "@apollo/client";
import { createHydrationUtils, reactive } from "@apollo/client-ai-apps/react";
import { useQuery, useMutation } from "@apollo/client/react";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router";
import { Rating } from "@/components/Rating";
import { Button } from "@/components/Button";

const GET_PRODUCT: TypedDocumentNode<ProductQuery, ProductQueryVariables> = gql`
  query Product($id: ID!)
  @tool(
    name: "Get-Product"
    description: "Shows the details page for a specific product."
  ) {
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

const ADD_TO_CART: TypedDocumentNode<
  AddToCartMutation,
  AddToCartMutationVariables
> = gql`
  mutation AddToCart($productId: ID!, $quantity: Int!)
  @tool(
    name: "Add-to-Cart"
    description: "Adds a product to the users shopping cart."
  ) {
    addToCart(productId: $productId, quantity: $quantity) {
      id
    }
  }
`;

const { useHydratedVariables } = createHydrationUtils(GET_PRODUCT);

function ProductDetail() {
  const params = useParams<{ id: string }>() as { id: string };
  const navigate = useNavigate();

  const [variables] = useHydratedVariables({ id: reactive(params.id) });
  const { id } = variables;

  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables,
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
    <div>
      <Link to="/home" className="flex gap-1 items-center hover:underline mb-4">
        <ArrowLeft size={16} className="text-icon-primary" /> Back to Products
      </Link>

      <h1 className="text-3xl font-bold mb-2">{product.title}</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="grid grid-cols-2 gap-2">
            {
              product.images && product.images.length > 0 ?
                product.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    className="w-full h-48 object-cover rounded"
                  />
                ))
                // Skeleton loader
              : [...Array(4)].map((_, index) => (
                  <div
                    key={index}
                    className="w-full h-48 rounded animate-pulse"
                  >
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

            }
          </div>
        </div>

        <div className="flex-1">
          <Rating rating={product.rating ?? 0} />
          <p className="font-bold text-2xl mb-4">
            ${product.price?.toFixed(2)}
          </p>
          {product.description ?
            <p className="text-gray-700 mb-4">{product.description}</p>
          : <div className="mb-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          }
          <Button
            onClick={handleAddToCart}
            disabled={addingToCart}
            variant="primary"
            size="lg"
            iconLeft={ShoppingCart}
          >
            {addingToCart ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
