import { gql, type FragmentType, type TypedDocumentNode } from "@apollo/client";
import { fragments } from "../apollo/fragmentRegistry";
import { useSuspenseFragment } from "@apollo/client/react";
import { Link } from "react-router";
import type { ProductTile_productFragment } from "@/gql/types";
import { Rating } from "./Rating";

const ProductTileFragment: TypedDocumentNode<
  ProductTile_productFragment,
  Record<string, never>
> = gql`
  fragment ProductTile_product on Product {
    id
    thumbnail
    title
    rating
    price
  }
`;

fragments.register(ProductTileFragment);

interface Props {
  product: FragmentType<ProductTile_productFragment>;
}

export function ProductTile({ product }: Props) {
  const { data } = useSuspenseFragment({
    fragment: ProductTileFragment,
    from: product,
  });

  return (
    <Link
      to={`/product/${data.id}`}
      className="flex flex-col border border-primary rounded p-4 hover:bg-secondary transition-colors"
    >
      <img
        src={data.thumbnail}
        alt={data.title}
        className="w-full h-32 mx-auto object-cover mb-2"
      />
      <h3 className="font-semibold text-lg mb-2">{data.title}</h3>
      <div className="font-medium text-xl flex-1 mb-2">
        ${data.price.toFixed(2)}
      </div>
      <Rating rating={data.rating} className="mb-1" />
    </Link>
  );
}
