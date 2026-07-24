import { getVentifyProducts } from "@/lib/ventify";
import PersonalizadosContent from "@/components/personalizados/PersonalizadosClient";

export const dynamic = "force-dynamic";

export default async function PersonalizadosPage() {
  const allProducts = await getVentifyProducts();
  const productosPersonalizados = allProducts.filter(
    (p) => p.sku.startsWith("Amigu-") || p.sku.startsWith("Carr-")
  );

  return <PersonalizadosContent productosPersonalizados={productosPersonalizados} />;
}
