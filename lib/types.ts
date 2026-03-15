export interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: string;        // emoji (🍕) or absolute image URL (https://...)
  category: string;
  rating: number;
  reviewCount: number;
  description: string;
  sizes: ("S" | "M" | "L")[];
  discount?: number;    // percentage e.g. 20
  isFavorite?: boolean;
}

export interface CartItem {
  food: FoodItem;
  quantity: number;
  selectedSize: "S" | "M" | "L";
}

export interface Category {
  id: string;
  name: string;
  emoji: string;
  slug: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: "confirmed" | "delivered" | "pending";
}
