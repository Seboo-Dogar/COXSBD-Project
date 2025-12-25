export type Product = {
  id: number;
  title: string;
  description?: string;
  priceUSD: number;           // base price in USD
  originalPriceUSD?: number;
  image: string;
  rating: number;             // 0–5
  reviewCount: number;
  category: string;           // must match name in categories
  isNew?: boolean;
  isBestSeller?: boolean;
};
