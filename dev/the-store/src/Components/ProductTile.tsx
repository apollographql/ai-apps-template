import { gql, type FragmentType, type TypedDocumentNode } from "@apollo/client";
import { fragments } from "../apollo/fragmentRegistry";
import { useFragment } from "@apollo/client/react";
import { Link } from "react-router";
import type { ProductTile_productFragment } from "@/gql/types";

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
  const { data, complete } = useFragment({
    fragment: ProductTileFragment,
    from: product,
  });

  if (!complete) {
    return null;
  }

  return (
    <Link
      to={`/product/${data.id}`}
      className="flex flex-col items-center border border-primary rounded-lg p-4"
    >
      <img
        src={data.thumbnail}
        alt={data.title}
        className="w-full h-32 object-cover mb-2"
      />
      <h3 className="font-semibold text-lg mb-2">{data.title}</h3>
      <p className="mb-1">⭐ {data.rating}</p>
      <p className="font-medium">${data.price.toFixed(2)}</p>
    </Link>
  );
}
