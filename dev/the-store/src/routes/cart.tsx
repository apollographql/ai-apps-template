import type {
  CartQuery,
  CartQueryVariables,
  UpdateCartItemQuantityMutation,
  UpdateCartItemQuantityMutationVariables,
} from "@/gql/types";
import { gql, type TypedDocumentNode } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { ArrowLeft, Plus, Minus } from "lucide-react";
import { Link } from "react-router";
import { Button } from "@/components/Button";
import { PageSpinner } from "@/components/PageSpinner";

const UPDATE_CART_ITEM_QUANTITY: TypedDocumentNode<
  UpdateCartItemQuantityMutation,
  UpdateCartItemQuantityMutationVariables
> = gql`
  mutation UpdateCartItemQuantity($cartItemId: ID!, $quantity: Int!)
  @tool(
    name: "Update-cart-item-quantity"
    description: "Updates the quantity of a cart item. Setting the quantity to 0 will remove the item from the cart."
  ) {
    updateCartItemQuantity(id: $cartItemId, quantity: $quantity) {
      id
      quantity
    }
  }
`;

const GET_CART: TypedDocumentNode<CartQuery, CartQueryVariables> = gql`
  query CartQuery
  @tool(
    name: "View-Cart"
    description: "Shows the items currently added to the user's shopping cart."
  ) {
    cart {
      id
      quantity
      product {
        id
        price
        thumbnail
        title
      }
    }
  }
`;

function Cart() {
  const { loading, error, data } = useQuery(GET_CART, {
    fetchPolicy: "network-only",
  });
  const [updateQuantity] = useMutation(UPDATE_CART_ITEM_QUANTITY, {
    refetchQueries: ["CartQuery"],
  });

  const handleQuantityChange = (
    itemId: string,
    currentQuantity: number,
    delta: number
  ) => {
    const newQuantity = currentQuantity + delta;
    updateQuantity({
      variables: {
        cartItemId: itemId,
        quantity: newQuantity,
      },
    });
  };

  if (error) return <p>Error: {error.message}</p>;

  const cartItems = data?.cart || [];
  const total = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <div>
      <Link to="/home" className="flex gap-1 items-center hover:underline mb-4">
        <ArrowLeft size={16} className="text-icon-primary" /> Back to Products
      </Link>

      <h1 className="text-3xl font-bold mb-2">Your Cart</h1>

      {loading ?
        <PageSpinner />
      : cartItems.length === 0 ?
        <p className="text-neutral">Your cart is empty</p>
      : <>
          <div className="flex flex-col gap-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 border border-primary rounded"
              >
                <img
                  src={item.product.thumbnail}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <h2 className="font-semibold">{item.product.title}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity, -1)
                      }
                      variant="secondary"
                      size="sm"
                      iconLeft={Minus}
                    />
                    <span className="w-4 text-center">{item.quantity}</span>
                    <Button
                      onClick={() =>
                        handleQuantityChange(item.id, item.quantity, 1)
                      }
                      variant="secondary"
                      size="sm"
                      iconLeft={Plus}
                    />
                  </div>
                </div>
                <p className="font-bold">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-t-primary">
            <p className="text-xl font-bold text-right">
              Total: <span>${total.toFixed(2)}</span>
            </p>
          </div>
        </>
      }
    </div>
  );
}

export default Cart;
