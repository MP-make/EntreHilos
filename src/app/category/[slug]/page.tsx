"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getVentifyProducts } from "@/lib/ventify";
import { notFound } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { loadExtras } from "@/lib/extras-cache";
import ProductCard from "@/components/ProductCard";
import QuickViewDrawer from "@/components/QuickViewDrawer";

const categoryTitles: Record<string, string> = {
  'dia-de-la-novia': 'Día de la Novia',
  'dia-de-la-mujer': 'Día de la Mujer',
  'san-valentin': 'San Valentín',
  'dia-de-la-madre': 'Día de la Madre',
  'flores-amarillas': 'Flores Amarillas',
  'hotwheels': 'Colección HotWheels',
  'personalizados': 'Personalizados',
};

const categoryDescriptions: Record<string, string> = {
  'dia-de-la-novia': 'Detalles únicos y románticos para celebrar tu amor',
  'dia-de-la-mujer': 'Detalles únicos tejidos con amor para conmemorar su día ',
  'san-valentin': 'Regalos perfectos para expresar tu amor',
  'dia-de-la-madre': 'Detalles eternos para mamá',
  'flores-amarillas': 'Flores amarillas eternas que nunca se marchitan',
  'hotwheels': 'Diversión tejida a mano',
  'personalizados': 'Diseños únicos hechos a tu medida',
};

// Función para obtener un icono según la categoría
const getCategoryIcon = (slug: string) => {
  switch(slug) {
    case 'dia-de-la-novia': return '';
    case 'dia-de-la-madre': return '';
    case 'san-valentin': return '';
    case 'dia-de-la-mujer': return '';
    case 'flores-amarillas': return '';
    case 'hotwheels': return '';
    case 'personalizados': return '';
    default: return '';
  }
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { addToCart } = useCart();
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [currentSlug, setCurrentSlug] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    loadExtras(() => {});
  }, []);

  const handleQuickView = (producto: any) => {
    setSelectedProduct(producto);
  };

  const handleDrawerAddToCart = (producto: any, quantity: number) => {
    for (let i = 0; i < quantity; i++) {
      addToCart(producto);
    }
  };

  useEffect(() => {
    const fetchCategory = async () => {
      const { slug } = await params;
      setCurrentSlug(slug);
      const allProducts = await getVentifyProducts();

      let products;
      switch (slug) {
        case 'dia-de-la-mujer':
          products = allProducts.filter(p => 
            p.sku.startsWith('Mujer-') || 
            p.nombre?.toLowerCase().includes('mujer') ||
            p.sku.startsWith('Ramos-')
          );
          break;

        case 'san-valentin':
          products = allProducts.filter(p =>
            (p.sku.startsWith('Ramos-') ||
            ['Caja-001', 'Caja-002', 'Caja-003'].includes(p.sku)) &&
            p.stock > 0
          );
          products.sort((a, b) => b.stock - a.stock);
          break;

        case 'dia-de-la-novia':
          products = allProducts.filter(p =>
            p.sku.startsWith('Ramos-') ||
            ['Caja-001', 'Caja-002', 'Caja-003'].includes(p.sku)
          );
          products.sort((a, b) => b.stock - a.stock);
          break;

        case 'dia-de-la-madre':
          products = allProducts.filter(p => p.sku.startsWith('Madre-') || p.sku.startsWith('Ramos-')); // Agregué Ramos por si acaso
          break;

        case 'flores-amarillas':
          products = allProducts.filter(p => 
            p.categoriaOriginal?.toLowerCase().includes('flores amarillas') ||
            p.nombre?.toLowerCase().includes('flores amarillas') ||
            p.sku.startsWith('Flores-')
          );
          break;

        case 'hotwheels':
          products = allProducts.filter(p =>
            p.sku.startsWith('Cua-') ||
            p.sku.startsWith('Carr-') ||
            ['Caja-004', 'Caja-005'].includes(p.sku)
          );
          break;

        case 'personalizados':
          products = allProducts.filter(p => p.sku.startsWith('Amigu-'));
          break;

        default:
          notFound();
      }

      setFilteredProducts(products || []);
      setCategoryTitle(categoryTitles[slug] || 'Categoría');
      setCategoryDescription(categoryDescriptions[slug] || '');
      setLoading(false);
    };
    fetchCategory();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF4F7] flex items-center justify-center">
        <div className="text-[#EE6B8D] text-lg font-lato animate-pulse flex flex-col items-center gap-3">
          <span className="text-3xl animate-bounce"></span>
          Cargando detalles especiales...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF4F7]">
      {/* ==================== HEADER DE CATEGORÍA MEJORADO (HERO) ==================== */}
      <section className="relative bg-gradient-to-br from-[#FDE8EF] via-white to-[#FDE8EF] py-20 px-4 border-b border-[#FDE8EF] overflow-hidden">
        {/* Círculos decorativos desenfocados de fondo */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#EE6B8D] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#C04267] rounded-full mix-blend-multiply filter blur-[80px] opacity-10 transform translate-x-1/3 translate-y-1/3"></div>

        <div className="relative max-w-4xl mx-auto text-center z-10">
          <span className="text-5xl md:text-6xl mb-6 block transform hover:scale-110 transition-transform duration-300 cursor-default drop-shadow-sm">
            {getCategoryIcon(currentSlug)}
          </span>
          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-[#C04267] mb-4 tracking-tight">
            {categoryTitle}
          </h1>
          <p className="font-lato text-lg md:text-xl text-[#6B6B6B] font-light max-w-2xl mx-auto">
            {categoryDescription}
          </p>
        </div>
      </section>

      {/* ==================== GRILLA DE PRODUCTOS ==================== */}
      <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[#FDE8EF] max-w-2xl mx-auto">
            <span className="text-6xl block mb-4"></span>
            <p className="font-playfair text-3xl text-[#C04267] mb-3 font-semibold">
              ¡Estamos tejiendo cosas nuevas!
            </p>
            <p className="font-lato text-base text-[#6B6B6B] font-light mb-8 px-4">
              Por el momento no hay productos en esta colección, pero estamos preparando hermosas sorpresas para ti.
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
            {/* BADGE DE DISPONIBILIDAD MEJORADO */}
            <div className="flex justify-center mb-12">
              <div className="inline-flex items-center gap-3 bg-white px-6 py-2.5 rounded-full shadow-sm border border-[#FDE8EF]">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#EE6B8D] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-[#EE6B8D]"></span>
                </span>
                <span className="font-lato text-sm text-[#4A4A4A] font-medium tracking-wide">
                  {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} en esta colección
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10 lg:gap-x-10 lg:gap-y-14">
              {filteredProducts.map((producto) => (
                <ProductCard key={producto.id} producto={producto} onQuickView={handleQuickView} />
              ))}
            </div>
          </>
        )}
      </section>

      {selectedProduct && (
        <QuickViewDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleDrawerAddToCart}
        />
      )}
    </div>
  );
}