import { FoodItem, Category, Order } from "./types";

const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

/** Maps our category slugs → TheMealDB category names */
export const CATEGORY_MAP: Record<string, string> = {
  pizza: "Pasta",
  burgers: "Beef",
  sushi: "Seafood",
  salads: "Side",
  desserts: "Dessert",
  noodles: "Pasta",
  bbq: "Lamb",
};

/** Reverse map: TheMealDB category → our slug */
const REVERSE_MAP: Record<string, string> = Object.fromEntries(
  Object.entries(CATEGORY_MAP).map(([slug, cat]) => [cat, slug])
);

// ── helpers ──────────────────────────────────────────────────────────────────

function derivePrice(id: string): number {
  return 8 + (parseInt(id.slice(-2), 10) % 22);
}

function deriveRating(id: string): number {
  return parseFloat((3.5 + (parseInt(id.slice(-1), 10) % 15) / 10).toFixed(1));
}

function mapMealToFoodItem(
  meal: {
    idMeal: string;
    strMeal: string;
    strMealThumb: string;
    strCategory?: string;
    strInstructions?: string;
    strArea?: string;
  },
  categorySlug: string
): FoodItem {
  const discount = parseInt(meal.idMeal.slice(-1), 10) > 7 ? 15 : undefined;
  return {
    id: `api-${meal.idMeal}`,
    name: meal.strMeal,
    price: derivePrice(meal.idMeal),
    image: meal.strMealThumb,
    category: categorySlug,
    rating: deriveRating(meal.idMeal),
    reviewCount: parseInt(meal.idMeal.slice(-3), 10),
    description: meal.strInstructions
      ? meal.strInstructions.replace(/\r?\n/g, " ").slice(0, 120) + "…"
      : `Freshly prepared ${meal.strMeal} from ${meal.strArea ?? "our kitchen"}.`,
    sizes: ["S", "M", "L"],
    ...(discount && { discount }),
  };
}

// ── public API functions ──────────────────────────────────────────────────────

/** Fetch up to 8 foods for a given category slug */
export async function fetchFoodsByCategory(slug: string): Promise<FoodItem[]> {
  const mealCategory = CATEGORY_MAP[slug];
  if (!mealCategory) return [];

  try {
    const res = await fetch(
      `${BASE_URL}/filter.php?c=${encodeURIComponent(mealCategory)}`,
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const data: {
      meals: { idMeal: string; strMeal: string; strMealThumb: string }[] | null;
    } = await res.json();

    if (!data.meals) return [];
    return data.meals.slice(0, 8).map((m) => ({
      id: `api-${m.idMeal}`,
      name: m.strMeal,
      price: derivePrice(m.idMeal),
      image: m.strMealThumb,
      category: slug,
      rating: deriveRating(m.idMeal),
      reviewCount: parseInt(m.idMeal.slice(-3), 10),
      description: `Freshly prepared ${m.strMeal}, made with quality ingredients.`,
      sizes: ["S", "M", "L"],
      ...(parseInt(m.idMeal.slice(-1), 10) > 7 ? { discount: 15 } : {}),
    }));
  } catch {
    return [];
  }
}

/** Search TheMealDB and return matching FoodItems */
export async function searchFoodsAPI(query: string): Promise<FoodItem[]> {
  if (!query.trim()) return [];
  try {
    const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`, { next: { revalidate: 3600 } });
    if (!res.ok) return [];
    const data: {
      meals:
      | {
        idMeal: string;
        strMeal: string;
        strMealThumb: string;
        strCategory: string;
        strInstructions: string;
        strArea: string;
      }[]
      | null;
    } = await res.json();

    if (!data.meals) return [];
    return data.meals.slice(0, 12).map((meal) => {
      const slug = REVERSE_MAP[meal.strCategory] ?? "burgers";
      return mapMealToFoodItem(meal, slug);
    });
  } catch {
    return [];
  }
}

export const categories: Category[] = [
  { id: "1", name: "Pizza", emoji: "🍕", slug: "pizza" },
  { id: "2", name: "Burgers", emoji: "🍔", slug: "burgers" },
  { id: "3", name: "Sushi", emoji: "🍣", slug: "sushi" },
  { id: "4", name: "Salads", emoji: "🥗", slug: "salads" },
  { id: "5", name: "Desserts", emoji: "🍰", slug: "desserts" },
  { id: "6", name: "Noodles", emoji: "🍜", slug: "noodles" },
  { id: "7", name: "BBQ", emoji: "🥩", slug: "bbq" },
];

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    date: "Dec 11, 2024",
    items: [
      {
        food: {
          id: "1", name: "Margherita Special", price: 15, image: "🍕", category: "pizza", rating: 4.8, reviewCount: 120, description: "Classic margherita", sizes: ["S", "M", "L"]
        }, quantity: 1, selectedSize: "M"
      },
      {
        food: {
          id: "4", name: "Classic Burger", price: 12, image: "🍔", category: "burgers", rating: 4.7, reviewCount: 200, description: "Juicy beef patty", sizes: ["S", "M", "L"]
        }, quantity: 2, selectedSize: "M"
      },
    ],
    total: 39,
    status: "delivered",
  },
  {
    id: "ORD-002",
    date: "Dec 9, 2024",
    items: [{
      food: {
        id: "5", name: "Double Smash Burger", price: 16, image: "🍔", category: "burgers", rating: 4.9, reviewCount: 310, description: "Two smashed beef patties", sizes: ["M", "L"]
      }, quantity: 1, selectedSize: "L"
    }],
    total: 16,
    status: "delivered",
  },
];

/** Fetch a representative mix of foods for the home page */
export async function fetchHomeFoods(): Promise<FoodItem[]> {
  const slugs = Object.keys(CATEGORY_MAP);
  // Fetch 2 slugs in parallel to keep it fast
  const [beefFoods, seafoodFoods, dessertFoods] = await Promise.all([
    fetchFoodsByCategory("burgers"),
    fetchFoodsByCategory("sushi"),
    fetchFoodsByCategory("desserts"),
  ]);
  return [...beefFoods.slice(0, 4), ...seafoodFoods.slice(0, 3), ...dessertFoods.slice(0, 3)];
}
