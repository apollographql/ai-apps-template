import { gql, type FragmentType, type TypedDocumentNode } from "@apollo/client";
import { fragments } from "../apollo/fragmentRegistry";
import { useFragment } from "@apollo/client/react";
import { Link } from "react-router";
import type { ProductTile_productFragment } from "@/gql/types";
import { Star } from "lucide-react";

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

  const ratingActual = Math.round(data.rating);
  const ratingRemaining = 5 - ratingActual;

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
      <div className="flex gap-1 items-center mb-1">
        {Array.from({ length: ratingActual }).map((_, idx) => (
          <Star
            key={idx}
            className="text-yellow-200"
            fill="currentColor"
            size={16}
          />
        ))}
        {Array.from({ length: ratingRemaining }).map((_, idx) => (
          <Star key={idx} className="text-primary" size={16} />
        ))}
        <span className="tabular-nums">{data.rating}</span>
      </div>
    </Link>
  );
}
