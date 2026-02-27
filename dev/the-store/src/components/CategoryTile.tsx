import type { CategoryTile_categoryFragment } from "@/gql/types";
import { gql, type FragmentType, type TypedDocumentNode } from "@apollo/client";
import { useSuspenseFragment } from "@apollo/client/react";
import { Link } from "react-router";
import { fragments } from "../apollo/fragmentRegistry";

const CategoryTileFragment: TypedDocumentNode<CategoryTile_categoryFragment> = gql`
  fragment CategoryTile_category on CategoryInfo {
    image
    name
    slug
  }
`;

fragments.register(CategoryTileFragment);

interface Props {
  category: FragmentType<CategoryTile_categoryFragment>;
}

export function CategoryTile({ category }: Props) {
  const { data } = useSuspenseFragment({
    fragment: CategoryTileFragment,
    from: category,
  });

  return (
    <Link to={`/categories/${data.slug}`} className="block">
      <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-gray-100">
        <div className="relative h-48 w-full">
          <img
            src={data.image}
            alt={data.name}
            className="w-full h-full object-cover absolute inset-0"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-black/20 flex items-end justify-center pb-4">
            <h3 className="text-white text-xl font-bold text-center px-4 drop-shadow-lg">
              {data.name}
            </h3>
          </div>
        </div>
      </div>
    </Link>
  );
}
