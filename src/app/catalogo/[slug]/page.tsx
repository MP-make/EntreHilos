"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getVentifyProducts } from "@/lib/ventify";
import { notFound } from "next/navigation";
import { loadExtras } from "@/lib/extras-cache";
import ProductCard from "@/components/ProductCard";
import QuickViewDrawer from "@/components/QuickViewDrawer";

type TabType = 'Ramos' | 'Amigurumis' | 'Cajas' | 'HotWheels' | 'Ver Todo';

const BRAND = {
  canvas: '#FBF6EF',
  ink: '#2E2422',
  inkSoft: '#6B5D54',
  rose: '#EE6B8D',
  roseDark: '#C04267',
  roseSoft: '#F3E1E6',
  clay: '#C97B4A',
  gold: '#C99A3E',
  line: '#EDE4D9',
};

const events = ['dia-de-la-novia', 'dia-de-la-mujer', 'san-valentin', 'dia-de-la-madre', 'flores-amarillas', 'personalizados'];
const categories: Record<string, TabType> = {
  'ramos': 'Ramos',
  'amigurumis': 'Amigurumis',
  'cajas': 'Cajas',
  'hotwheels': 'HotWheels',
};

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

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [currentSlug, setCurrentSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('Ver Todo');
  const [isEvent, setIsEvent] = useState(false);

  useEffect(() => {
    loadExtras(() => {});
  }, []);

  const handleQuickView = (producto: any) => {
    setSelectedProduct(producto);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { slug } = await params;
      setCurrentSlug(slug);

      const allSupported = [...events, ...Object.keys(categories)];
      if (!allSupported.includes(slug)) {
        notFound();
        return;
      }

      const isEventSlug = events.includes(slug);
      setIsEvent(isEventSlug);

      const products = await getVentifyProducts();
      setAllProducts(products);

      if (!isEventSlug && slug in categories) {
        setActiveTab(categories[slug]);
      }

      setLoading(false);
    };
    fetchData();
  }, [params]);

  const getProductsByTab = (tab: TabType) => {
    switch (tab) {
      case 'Ramos':
        return allProducts.filter(p => p.sku.startsWith('Ramos-') && p.stock > 0)
          .sort((a, b) => b.stock - a.stock);
      case 'Amigurumis':
        return allProducts.filter(p => p.sku.startsWith('Amigu-'));
      case 'Cajas':
        return allProducts.filter(p =>
          ['Caja-001', 'Caja-002', 'Caja-003', 'Caja-004', 'Caja-005'].includes(p.sku)
        );
      case 'HotWheels':
        return allProducts.filter(p =>
          p.sku.startsWith('Cua-') || p.sku.startsWith('Carr-') ||
          ['Caja-004', 'Caja-005'].includes(p.sku)
        );
      case 'Ver Todo':
        return allProducts.filter(p => p.stock > 0 || p.sku.startsWith('Amigu-') || p.sku.startsWith('Caja-'));
    }
  };

  const getEventProducts = (slug: string) => {
    switch (slug) {
      case 'dia-de-la-mujer':
        return allProducts.filter(p =>
          p.sku.startsWith('Mujer-') || p.nombre?.toLowerCase().includes('mujer') || p.sku.startsWith('Ramos-')
        );
      case 'san-valentin':
        return allProducts.filter(p =>
          (p.sku.startsWith('Ramos-') || ['Caja-001', 'Caja-002', 'Caja-003'].includes(p.sku)) && p.stock > 0
        ).sort((a, b) => b.stock - a.stock);
      case 'dia-de-la-novia':
        return allProducts.filter(p =>
          p.sku.startsWith('Ramos-') || ['Caja-001', 'Caja-002', 'Caja-003'].includes(p.sku)
        ).sort((a, b) => b.stock - a.stock);
      case 'dia-de-la-madre':
        return allProducts.filter(p => p.sku.startsWith('Madre-') || p.sku.startsWith('Ramos-'));
      case 'flores-amarillas':
        return allProducts.filter(p =>
          p.categoriaOriginal?.toLowerCase().includes('flores amarillas') ||
          p.nombre?.toLowerCase().includes('flores amarillas') || p.sku.startsWith('Flores-')
        );
      case 'personalizados':
        return allProducts.filter(p => p.sku.startsWith('Amigu-'));
      default:
        return [];
    }
  };

  const displayProducts = isEvent ? getEventProducts(currentSlug) : getProductsByTab(activeTab);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF4F7] flex items-center justify-center">
        <div className="text-[#EE6B8D] text-lg font-lato animate-pulse">
          Cargando...
        </div>
      </div>
    );
  }

  if (isEvent) {
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
          {displayProducts.length === 0 ? (
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
                    {displayProducts.length} producto{displayProducts.length !== 1 ? 's' : ''} en esta colección
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-10 lg:gap-y-14">
                {displayProducts.map((producto) => (
                  <ProductCard key={producto.id} producto={producto} onQuickView={handleQuickView} />
                ))}
              </div>
            </>
          )}
        </section>

        {selectedProduct && (
          <QuickViewDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.canvas }}>
      <section className="py-6 sm:py-8 px-4 overflow-x-auto sm:flex-wrap sm:justify-center gap-3 sm:gap-4 whitespace-nowrap sm:whitespace-normal" style={{ backgroundColor: BRAND.canvas }}>
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {(['Ramos', 'Amigurumis', 'Cajas', 'HotWheels', 'Ver Todo'] as TabType[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className="font-lato text-sm tracking-wide transition-all duration-300 px-5 py-2 rounded-full border shrink-0"
                  style={{
                    backgroundColor: isActive ? BRAND.rose : 'white',
                    color: isActive ? 'white' : BRAND.inkSoft,
                    borderColor: isActive ? BRAND.rose : '#E5DACB',
                    borderStyle: isActive ? 'solid' : 'dashed',
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
        {displayProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-playfair text-2xl mb-3" style={{ color: BRAND.inkSoft }}>
              No hay productos en esta categoría
            </p>
            <p className="font-lato text-sm font-light" style={{ color: BRAND.inkSoft }}>
              Explora otras secciones de nuestro catálogo
            </p>
            <Link
              href="/"
              className="inline-block mt-6 font-lato px-6 py-3 rounded-full text-white text-sm font-semibold transition-all"
              style={{ backgroundColor: BRAND.rose }}
            >
              Volver al inicio
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-10 sm:mb-12">
              <span className="font-lato text-xs tracking-[0.2em] uppercase" style={{ color: BRAND.clay }}>
                Colección
              </span>
              <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-semibold mt-1 mb-2 sm:mb-3" style={{ color: BRAND.roseDark }}>
                {activeTab === 'Ver Todo' ? 'Toda la Colección' : activeTab}
              </h2>
              <p className="font-lato text-base sm:text-lg font-light" style={{ color: BRAND.inkSoft }}>
                {displayProducts.length} producto{displayProducts.length !== 1 ? 's' : ''} disponible{displayProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-8 sm:gap-y-10 lg:gap-x-10 lg:gap-y-14">
              {displayProducts.map((producto) => (
                <ProductCard key={producto.id} producto={producto} onQuickView={handleQuickView} />
              ))}
            </div>
          </>
        )}
      </section>

      {selectedProduct && (
        <QuickViewDrawer product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
