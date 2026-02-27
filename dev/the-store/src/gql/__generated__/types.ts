export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type CartItem = {
  __typename: "CartItem";
  id: Scalars["ID"]["output"];
  product: Product;
  quantity: Scalars["Int"]["output"];
};

export type Category =
  | "beauty"
  | "fragrances"
  | "furniture"
  | "groceries"
  | "home_decoration"
  | "kitchen_accessories"
  | "laptops"
  | "mens_shirts"
  | "mens_shoes"
  | "mens_watches"
  | "mobile_accessories"
  | "motorcycle"
  | "skin_care"
  | "smartphones"
  | "sports_accessories"
  | "sunglasses"
  | "tablets"
  | "tops"
  | "vehicle"
  | "womens_bags"
  | "womens_dresses"
  | "womens_jewellery"
  | "womens_shoes"
  | "womens_watches";

export type CategoryInfo = {
  __typename: "CategoryInfo";
  image: Scalars["String"]["output"];
  name: Scalars["String"]["output"];
  slug: Category;
};

export type Dimensions = {
  __typename: "Dimensions";
  depth: Scalars["Float"]["output"];
  height: Scalars["Float"]["output"];
  width: Scalars["Float"]["output"];
};

export type Mutation = {
  __typename: "Mutation";
  addToCart: CartItem;
  updateCartItemQuantity: Maybe<CartItem>;
};

export type MutationaddToCartArgs = {
  productId: Scalars["ID"]["input"];
  quantity: Scalars["Int"]["input"];
};

export type MutationupdateCartItemQuantityArgs = {
  id: Scalars["ID"]["input"];
  quantity: Scalars["Int"]["input"];
};

export type Order = "asc" | "desc";

export type Product = {
  __typename: "Product";
  availabilityStatus: Scalars["String"]["output"];
  brand: Maybe<Scalars["String"]["output"]>;
  category: Category;
  description: Scalars["String"]["output"];
  dimensions: Dimensions;
  discountPercentage: Scalars["Float"]["output"];
  id: Scalars["ID"]["output"];
  images: Array<Scalars["String"]["output"]>;
  meta: ProductMeta;
  minimumOrderQuantity: Scalars["Int"]["output"];
  price: Scalars["Float"]["output"];
  rating: Scalars["Float"]["output"];
  returnPolicy: Scalars["String"]["output"];
  reviews: Array<Review>;
  shippingInformation: Scalars["String"]["output"];
  sku: Scalars["String"]["output"];
  stock: Scalars["Int"]["output"];
  tags: Array<Scalars["String"]["output"]>;
  thumbnail: Scalars["String"]["output"];
  title: Scalars["String"]["output"];
  warrantyInformation: Scalars["String"]["output"];
  weight: Scalars["Float"]["output"];
};

export type ProductMeta = {
  __typename: "ProductMeta";
  barcode: Scalars["String"]["output"];
  createdAt: Scalars["String"]["output"];
  qrCode: Scalars["String"]["output"];
  updatedAt: Scalars["String"]["output"];
};

export type ProductsResult = {
  __typename: "ProductsResult";
  limit: Scalars["Int"]["output"];
  results: Array<Product>;
  skip: Scalars["Int"]["output"];
  total: Scalars["Int"]["output"];
};

export type Query = {
  __typename: "Query";
  cart: Array<CartItem>;
  categories: Array<CategoryInfo>;
  product: Maybe<Product>;
  products: ProductsResult;
  search: Array<Product>;
  topProducts: Array<Product>;
};

export type QueryproductArgs = {
  id: Scalars["ID"]["input"];
};

export type QueryproductsArgs = {
  category: Category;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  order?: InputMaybe<Order>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
};

export type QuerysearchArgs = {
  query: Scalars["String"]["input"];
};

export type QuerytopProductsArgs = {
  category?: InputMaybe<Category>;
};

export type Review = {
  __typename: "Review";
  comment: Scalars["String"]["output"];
  date: Scalars["String"]["output"];
  rating: Scalars["Int"]["output"];
  reviewerEmail: Scalars["String"]["output"];
  reviewerName: Scalars["String"]["output"];
};

export type UpdateCartItemQuantityMutationVariables = Exact<{
  cartItemId: Scalars["ID"]["input"];
  quantity: Scalars["Int"]["input"];
}>;

export type UpdateCartItemQuantityMutation = {
  updateCartItemQuantity: {
    __typename: "CartItem";
    id: string;
    quantity: number;
  } | null;
};

export type CartQueryVariables = Exact<{ [key: string]: never }>;

export type CartQuery = {
  cart: Array<{
    __typename: "CartItem";
    id: string;
    quantity: number;
    product: {
      __typename: "Product";
      price: number;
      thumbnail: string;
      title: string;
    };
  }>;
};

export type CategoryTile_categoryFragment = {
  __typename: "CategoryInfo";
  image: string;
  name: string;
  slug: Category;
} & { " $fragmentName"?: "CategoryTile_categoryFragment" };

export type TopProductsQueryVariables = Exact<{ [key: string]: never }>;

export type TopProductsQuery = {
  topProducts: Array<
    { __typename: "Product"; id: string } & {
      " $fragmentRefs"?: {
        ProductTile_productFragment: ProductTile_productFragment;
      };
    }
  >;
  categories: Array<
    { __typename: "CategoryInfo"; slug: Category } & {
      " $fragmentRefs"?: {
        CategoryTile_categoryFragment: CategoryTile_categoryFragment;
      };
    }
  >;
};

export type ProductQueryVariables = Exact<{
  id: Scalars["ID"]["input"];
}>;

export type ProductQuery = {
  product: {
    __typename: "Product";
    id: string;
    title: string;
    rating: number;
    price: number;
    description: string;
    images: Array<string>;
  } | null;
};

export type AddToCartMutationVariables = Exact<{
  productId: Scalars["ID"]["input"];
  quantity: Scalars["Int"]["input"];
}>;

export type AddToCartMutation = {
  addToCart: { __typename: "CartItem"; id: string };
};

export type ProductTile_productFragment = {
  __typename: "Product";
  id: string;
  thumbnail: string;
  title: string;
  rating: number;
  price: number;
} & { " $fragmentName"?: "ProductTile_productFragment" };

export type ProductsQueryVariables = Exact<{
  category: Category;
  sortBy?: InputMaybe<Scalars["String"]["input"]>;
  order?: InputMaybe<Order>;
  limit?: InputMaybe<Scalars["Int"]["input"]>;
  skip?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type ProductsQuery = {
  products: {
    __typename: "ProductsResult";
    limit: number;
    skip: number;
    total: number;
    results: Array<
      { __typename: "Product"; id: string } & {
        " $fragmentRefs"?: {
          ProductTile_productFragment: ProductTile_productFragment;
        };
      }
    >;
  };
  categories: Array<{
    __typename: "CategoryInfo";
    name: string;
    slug: Category;
  }>;
};

export type SearchQueryVariables = Exact<{
  query: Scalars["String"]["input"];
}>;

export type SearchQuery = {
  search: Array<
    { __typename: "Product"; id: string } & {
      " $fragmentRefs"?: {
        ProductTile_productFragment: ProductTile_productFragment;
      };
    }
  >;
};
