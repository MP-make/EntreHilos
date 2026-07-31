import { getVentifyProducts } from "@/lib/ventify";
import HomeClient from "@/components/HomeClient";

export const dynamic = 'force-dynamic';

async function getHomeSections() {
  try {
    const { supabaseAdmin } = await import("@/lib/supabase/server");
    const { data } = await supabaseAdmin
      .from("home_sections")
      .select("*")
      .eq("activo", true)
      .order("orden", { ascending: true });
    return data || [];
  } catch {
    return [];
  }
}

async function getHeroConfig() {
  try {
    const { supabaseAdmin } = await import("@/lib/supabase/server");
    const heroKeys = ['home_hero_1', 'home_hero_2', 'home_hero_3', 'home_hero_4'];
    const { data } = await supabaseAdmin
      .from("hero_config")
      .select("*")
      .in("clave", heroKeys)
      .order("clave");
    if (!data) return [];
    return heroKeys.map(k => data.find((h: any) => h.clave === k)).filter(Boolean);
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await getVentifyProducts();
  const sections = await getHomeSections();
  const heroData = await getHeroConfig();
  return <HomeClient products={products} sections={sections} heroData={heroData} />;
}
