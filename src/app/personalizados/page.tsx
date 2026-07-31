import { getVentifyProducts } from "@/lib/ventify";
import PersonalizadosContent from "@/components/personalizados/PersonalizadosClient";

export const dynamic = "force-dynamic";

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

export default async function PersonalizadosPage() {
  const allProducts = await getVentifyProducts();
  const productosPersonalizados = allProducts.filter(
    (p) => p.sku.startsWith("Amigu-") || p.sku.startsWith("Carr-")
  );

  const sections = await getHomeSections();
  const heroConfig = sections.find((s: any) => s.section_key === "personalizados_hero");

  return <PersonalizadosContent productosPersonalizados={productosPersonalizados} heroConfig={heroConfig} />;
}
