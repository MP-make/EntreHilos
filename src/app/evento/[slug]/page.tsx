"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getVentifyProducts } from "@/lib/ventify";
import { notFound } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { loadExtras } from "@/lib/extras-cache";
import ProductCard from "@/components/ProductCard";
import QuickViewDrawer from "@/components/QuickViewDrawer";

const eventSlugs = ['dia-de-la-novia', 'dia-de-la-mujer', 'san-valentin', 'dia-de-la-madre', 'flores-amarillas', 'personalizados'];

const eventTitles: Record<string, string> = {
  'dia-de-la-novia': 'Día de la Novia',
  'dia-de-la-mujer': 'Día de la Mujer',
  'san-valentin': 'San Valentín',
  'dia-de-la-madre': 'Día de la Madre',
  'flores-amarillas': 'Flores Amarillas',
  'personalizados': 'Personalizados',
};

const eventDescriptions: Record<string, string> = {
  'dia-de-la-novia': 'Detalles únicos y románticos para celebrar tu amor',
  'dia-de-la-mujer': 'Detalles únicos tejidos con amor para conmemorar su día',
  'san-valentin': 'Regalos perfectos para expresar tu amor',
  'dia-de-la-madre': 'Detalles eternos para mamá',
  'flores-amarillas': 'Flores amarillas eternas que nunca se marchitan',
  'personalizados': 'Diseños únicos hechos a tu medida',
};

export default function EventoPage({ params }: { params: Promise<{ slug: string }> }) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [currentSlug, setCurrentSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    loadExtras(() => {});
  }, []);

  const handleQuickView = (producto: any) => setSelectedProduct(producto);

  const handleDrawerAddToCart = (producto: any, quantity: number) => {
    for (let i = 0; i < quantity; i++) addToCart(producto);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { slug } = await params;
      if (!eventSlugs.includes(slug)) {
        notFound();
        return;
      }
      setCurrentSlug(slug);
      const allProducts = await getVentifyProducts();
      let filtered: any[];
      switch (slug) {
        case 'dia-de-la-mujer':
          filtered = allProducts.filter(p =>
            p.sku.startsWith('Mujer-') || p.nombre?.toLowerCase().includes('mujer') || p.sku.startsWith('Ramos-')
          );
          break;
        case 'san-valentin':
          filtered = allProducts.filter(p =>
            (p.sku.startsWith('Ramos-') || ['Caja-001', 'Caja-002', 'Caja-003'].includes(p.sku)) && p.stock > 0
          ).sort((a, b) => b.stock - a.stock);
          break;
        case 'dia-de-la-novia':
          filtered = allProducts.filter(p =>
            p.sku.startsWith('Ramos-') || ['Caja-001', 'Caja-002', 'Caja-003'].includes(p.sku)
          ).sort((a, b) => b.stock - a.stock);
          break;
        case 'dia-de-la-madre':
          filtered = allProducts.filter(p => p.sku.startsWith('Madre-') || p.sku.startsWith('Ramos-'));
          break;
        case 'flores-amarillas':
          filtered = allProducts.filter(p =>
            p.categoriaOriginal?.toLowerCase().includes('flores amarillas') ||
            p.nombre?.toLowerCase().includes('flores amarillas') || p.sku.startsWith('Flores-')
          );
          break;
        case 'personalizados':
          filtered = allProducts.filter(p => p.sku.startsWith('Amigu-'));
          break;
        default:
          filtered = [];
      }
      setProducts(filtered);
      setLoading(false);
    };
    fetchData();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF4F7] flex items-center justify-center">
        <div className="text-[#EE6B8D] text-lg font-lato animate-pulse">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF4F7]">
      <section className="relative bg-gradient-to-br from-[#FDE8EF] via-white to-[#FDE8EF] py-20 px-4 border-b border-[#FDE8EF] overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#EE6B8D] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#C04267] rounded-full mix-blend-multiply filter blur-[80px] opacity-10 transform translate-x-1/3 translate-y-1/3" />
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-[#C04267] mb-4 tracking-tight">
            {eventTitles[currentSlug] || 'Evento'}
          </h1>
          <p className="font-lato text-lg md:text-xl text-[#6B6B6B] font-light max-w-2xl mx-auto">
            {eventDescriptions[currentSlug] || ''}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[#FDE8EF] max-w-2xl mx-auto">
            <p className="font-playfair text-3xl text-[#C04267] mb-3 font-semibold">
              ¡Estamos tejiendo cosas nuevas!
            </p>
            <p className="font-lato text-base text-[#6B6B6B] font-light mb-8 px-4">
              Por el momento no hay productos en esta colección.
            </p>
            <Link
              href="/"
              className="inline-block font-lato px-8 py-3.5 bg-[#EE6B8D] hover:bg-[#C04267] text-white font-bold text-sm tracking-widest uppercase transition-all duration-300 rounded-full shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              Explorar otras colecciones
            </Link>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-3 bg-white px-6 py-2.5 rounded-full shadow-sm border border-[#FDE8EF]">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EE6B8D] opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EE6B8D]" />
                </span>
                <span className="font-lato text-sm text-[#4A4A4A] font-medium tracking-wide">
                  {products.length} producto{products.length !== 1 ? 's' : ''} en esta colección
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-10 lg:gap-y-14">
              {products.map((producto) => (
                <ProductCard key={producto.id} producto={producto} onQuickView={handleQuickView} />
              ))}
            </div>
          </>
        )}
      </section>

      {selectedProduct && (
        <QuickViewDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} onAddToCart={handleDrawerAddToCart} />
      )}
    </div>
  );
}
