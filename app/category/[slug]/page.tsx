import { notFound } from "next/navigation";
import { fetchFoodsByCategory, categories } from "@/lib/api";
import CategoryPageClient from "@/components/CategoryPageClient";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const foods = await fetchFoodsByCategory(slug);

  return <CategoryPageClient initialFoods={foods} cat={cat} slug={slug} />;
}
