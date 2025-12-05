import { LRUCache } from "lru-cache";

// Product cache configuration
const productCache = new LRUCache({
  max: 100, // Maximum 100 products in cache
  ttl: 1000 * 60 * 5, // 5 minutes TTL
});

// Helper function to fetch product by ID with caching
async function fetchProductById(id) {
  const cached = productCache.get(id);
  if (cached) {
    return cached;
  }

  const response = await fetch(`https://dummyjson.com/products/${id}`);
  const product = await response.json();
  productCache.set(id, product);
  return product;
}

// Helper function to cache multiple products
function cacheProducts(products) {
  products.forEach((product) => {
    if (product.id) {
      productCache.set(product.id, product);
    }
  });
  return products;
}

// Category slug to image mapping
const categoryImages = {
  "beauty": "https://cdn.dummyjson.com/product-images/beauty/powder-canister/thumbnail.webp",
  "fragrances": "https://cdn.dummyjson.com/product-images/fragrances/calvin-klein-ck-one/thumbnail.webp",
  "furniture": "https://cdn.dummyjson.com/product-images/furniture/knoll-saarinen-executive-conference-chair/thumbnail.webp",
  "groceries": "https://cdn.dummyjson.com/product-images/groceries/water/thumbnail.webp",
  "home-decoration": "https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp",
  "kitchen-accessories": "https://cdn.dummyjson.com/product-images/kitchen-accessories/lunch-box/thumbnail.webp",
  "laptops": "https://cdn.dummyjson.com/product-images/laptops/huawei-matebook-x-pro/thumbnail.webp",
  "mens-shirts": "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp",
  "mens-shoes": "https://cdn.dummyjson.com/product-images/mens-shoes/puma-future-rider-trainers/thumbnail.webp",
  "mens-watches": "https://cdn.dummyjson.com/product-images/mens-watches/rolex-cellini-date-black-dial/thumbnail.webp",
  "mobile-accessories": "https://cdn.dummyjson.com/product-images/mobile-accessories/amazon-echo-plus/thumbnail.webp",
  "motorcycle": "https://cdn.dummyjson.com/product-images/motorcycle/generic-motorcycle/thumbnail.webp",
  "skin-care": "https://cdn.dummyjson.com/product-images/skin-care/olay-ultra-moisture-shea-butter-body-wash/thumbnail.webp",
  "smartphones": "https://cdn.dummyjson.com/product-images/smartphones/realme-xt/thumbnail.webp",
  "sports-accessories": "https://cdn.dummyjson.com/product-images/sports-accessories/american-football/thumbnail.webp",
  "sunglasses": "https://cdn.dummyjson.com/product-images/sunglasses/green-and-black-glasses/thumbnail.webp",
  "tablets": "https://cdn.dummyjson.com/product-images/tablets/samsung-galaxy-tab-s8-plus-grey/thumbnail.webp",
  "tops": "https://cdn.dummyjson.com/product-images/tops/girl-summer-dress/thumbnail.webp",
  "vehicle": "https://cdn.dummyjson.com/product-images/vehicle/durango-sxt-rwd/thumbnail.webp",
  "womens-bags": "https://cdn.dummyjson.com/product-images/womens-bags/heshe-women's-leather-bag/thumbnail.webp",
  "womens-dresses": "https://cdn.dummyjson.com/product-images/womens-dresses/dress-pea/thumbnail.webp",
  "womens-jewellery": "https://cdn.dummyjson.com/product-images/womens-jewellery/tropical-earring/thumbnail.webp",
  "womens-shoes": "https://cdn.dummyjson.com/product-images/womens-shoes/calvin-klein-heel-shoes/thumbnail.webp",
  "womens-watches": "https://cdn.dummyjson.com/product-images/womens-watches/watch-gold-for-women/thumbnail.webp",
};

// In-memory cart storage
const cart = [];
let cartIdCounter = 1;

export const resolvers = {
  Product: {
    category: (product) => product.category.replace(/-/g, "_"),
  },
  CartItem: {
    product: async (cartItem) => {
      return fetchProductById(cartItem.productId);
    },
  },
  Query: {
    topProducts: async (_, { category }) => {
      const categorySlug = category ? category.replace(/_/g, "-") : null;
      const basePath = categorySlug
        ? `https://dummyjson.com/products/category/${encodeURIComponent(categorySlug)}`
        : "https://dummyjson.com/products";

      const response = await fetch(
        `${basePath}?limit=10&sortBy=rating&order=desc`
      );
      const data = await response.json();
      return cacheProducts(data.products);
    },
    product: async (_, { id }) => {
      return fetchProductById(id);
    },
    search: async (_, { query }) => {
      const response = await fetch(
        `https://dummyjson.com/products/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      return cacheProducts(data.products);
    },
    products: async (_, { category, sortBy, order, limit, skip }) => {
      const params = new URLSearchParams();
      if (sortBy) params.append("sortBy", sortBy);
      if (order) params.append("order", order);
      if (limit) params.append("limit", limit);
      if (skip) params.append("skip", skip);

      // Convert enum value (underscores) to API format (hyphens)
      const categorySlug = category.replace(/_/g, "-");

      const queryString = params.toString();
      const url = `https://dummyjson.com/products/category/${encodeURIComponent(categorySlug)}${queryString ? `?${queryString}` : ""}`;

      const response = await fetch(url);
      const data = await response.json();

      // Cache the products
      cacheProducts(data.products);

      // Return pagination details along with results
      return {
        results: data.products,
        total: data.total,
        skip: data.skip,
        limit: data.limit,
      };
    },
    cart: async () => {
      const productPromises = cart.map((item) =>
        fetchProductById(item.productId)
      );
      const products = await Promise.all(productPromises);

      return cart.map((item, index) => ({
        id: item.id,
        productId: item.productId,
        product: products[index],
        quantity: item.quantity,
      }));
    },
    categories: async () => {
      const response = await fetch("https://dummyjson.com/products/categories");
      const data = await response.json();
      return data.map((category) => ({
        name: category.name,
        slug: category.slug.replace(/-/g, "_"),
        image: categoryImages[category.slug] || "",
      }));
    },
  },
  Mutation: {
    addToCart: (_, { productId, quantity }) => {
      const existingItem = cart.find((item) => item.productId === productId);
      if (existingItem) {
        existingItem.quantity += quantity;
        return existingItem;
      }

      const cartItem = {
        id: String(cartIdCounter++),
        productId,
        quantity,
      };
      cart.push(cartItem);
      return cartItem;
    },
    updateCartItemQuantity: (_, { id, quantity }) => {
      const index = cart.findIndex((item) => item.id === id);
      if (index === -1) {
        return null;
      }

      if (quantity <= 0) {
        cart.splice(index, 1);
        return null;
      }

      cart[index].quantity = quantity;
      return cart[index];
    },
  },
};
