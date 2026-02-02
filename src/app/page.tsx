import { getVentifyProducts } from "@/lib/ventify";
import HomeClient from "@/components/HomeClient";

export const dynamic = 'force-dynamic';

export default async function Home() {
  // Obtener productos reales de Ventify (Server Component)
  const products = await getVentifyProducts();

  // Pasar los datos al componente cliente
  return <HomeClient products={products} />;
}
