import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { Link } from "react-router";

const UPDATE_CART_ITEM_QUANTITY = gql`
  mutation UpdateCartItemQuantity($cartItemId: ID!, $quantity: Int!)
  @tool(
    name: "Update cart item quantity"
    description: "Updates the quantity of a cart item. Setting the quantity to 0 will remove the item from the cart."
  ) {
    updateCartItemQuantity(id: $cartItemId, quantity: $quantity) {
      id
      quantity
    }
  }
`;

const GET_CART = gql`
  query CartQuery
  @tool(name: "View Cart", description: "Shows the items currently added to the user's shopping cart.") {
    cart {
      id
      quantity
      product {
        price
        thumbnail
        title
      }
    }
  }
`;

type CartItem = {
  id: string;
  quantity: number;
  product: {
    price: number;
    thumbnail: string;
    title: string;
  };
};

type UpdateCartItemQuantityResponse = {
  updateCartItemQuantity: {
    __typename?: string;
    id: string;
    quantity: number;
  } | null;
};

function Cart() {
  const { loading, error, data } = useQuery<{ cart: CartItem[] }>(GET_CART, {
    fetchPolicy: "network-only",
  });
  const [updateQuantity] = useMutation<UpdateCartItemQuantityResponse>(UPDATE_CART_ITEM_QUANTITY, {
    refetchQueries: ["CartQuery"],
  });

  const handleQuantityChange = (itemId: string, currentQuantity: number, delta: number) => {
    const newQuantity = currentQuantity + delta;
    updateQuantity({
      variables: {
        cartItemId: itemId,
        quantity: newQuantity,
      },
    });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const cartItems = data?.cart || [];
  const total = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Link to="/home" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to Products
      </Link>

      <h1 className="text-3xl font-bold mb-4">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center gap-4 p-4 border rounded">
                <img src={item.product.thumbnail} alt={item.product.title} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h2 className="font-semibold">{item.product.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-lg font-bold"
                    >
                      -
                    </button>
                    <span className="text-gray-600 w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                      className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
                <p className="text-green-600 font-bold">${(item.product.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t">
            <p className="text-xl font-bold text-right">
              Total: <span className="text-green-600">${total.toFixed(2)}</span>
            </p>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
