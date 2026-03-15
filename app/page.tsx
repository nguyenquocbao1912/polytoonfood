import { fetchHomeFoods } from "@/lib/api";
import HomePageClient from "@/components/HomePageClient";

export default async function HomePage() {
  const foods = await fetchHomeFoods();
  return <HomePageClient initialFoods={foods} />;
}