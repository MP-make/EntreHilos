"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getVentifyProducts } from "@/lib/ventify";
import { slugify } from "@/lib/utils";
import { notFound } from "next/navigation";
import { useCart } from "@/context/CartContext";

const categoryTitles: Record<string, string> = {
  'dia-de-la-mujer': 'Día de la Mujer',
  'san-valentin': 'San Valentín',
  'dia-de-la-madre': 'Día de la Madre',
  'flores-amarillas': 'Flores Amarillas',
  'hotwheels': 'Colección HotWheels',
  'personalizados': 'Personalizados',
};

const categoryDescriptions: Record<string, string> = {
  'dia-de-la-mujer': 'Detalles únicos tejidos con amor para conmemorar su día 💜',
  'san-valentin': 'Regalos perfectos para expresar tu amor',
  'dia-de-la-madre': 'Detalles eternos para mamá',
  'flores-amarillas': 'Flores amarillas eternas que nunca se marchitan',
  'hotwheels': 'Diversión tejida a mano',
  'personalizados': 'Diseños únicos hechos a tu medida',
};

// Función para obtener un icono según la categoría
const getCategoryIcon = (slug: string) => {
  switch(slug) {
    case 'dia-de-la-madre': return '🌸';
    case 'san-valentin': return '💝';
    case 'dia-de-la-mujer': return '💜';
    case 'flores-amarillas': return '🌻';
    case 'hotwheels': return '🏎️';
    case 'personalizados': return '✨';
    default: return '🎀';
  }
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [currentSlug, setCurrentSlug] = useState('');
  const [loading, setLoading] = useState(true);

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
          <span className="text-3xl animate-bounce">🧶</span>
          Cargando detalles especiales...
        </div>
      </div>
    );
  }

  // Componente de tarjeta de producto
  const ProductCard = ({ producto }: { producto: any }) => {
    const { addToCart } = useCart();
    
    const isAmigurumiOrCaja = producto.sku.startsWith('Amigu-') || producto.sku.startsWith('Caja-');

    const handleAddToCart = () => {
      if (producto.stock === 0 && isAmigurumiOrCaja) {
        const productoData = encodeURIComponent(JSON.stringify({
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen,
          sku: producto.sku
        }));
        window.location.href = `/pedido-personalizado?producto=${productoData}`;
        return;
      }
      
      if (producto.stock === 0 && !isAmigurumiOrCaja) return;
      
      addToCart(producto);
      alert('¡Agregado al carrito! 💖');
    };

    return (
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow p-4">
        <Link href={`/product/${slugify(producto.nombre)}`} className="block">
          <div className="relative aspect-[4/5] bg-white mb-4 overflow-hidden rounded-xl">
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            
            {producto.stock <= 5 && producto.stock > 0 && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-[#FFB4A2] text-gray-800 text-xs font-lato font-bold rounded">
                Últimas unidades
              </div>
            )}

            {producto.stock === 0 && !isAmigurumiOrCaja && (
              <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center transition-all duration-300">
                <span className="font-lato text-xs font-bold text-white tracking-widest bg-gray-900/80 px-6 py-2 rounded-full uppercase shadow-xl">
                  AGOTADO
                </span>
              </div>
            )}
            
            {producto.stock === 0 && isAmigurumiOrCaja && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-[#FFB4A2] text-gray-800 text-xs font-lato font-bold rounded">
                A pedido
              </div>
            )}
          </div>

          <div className="text-center">
            <h3 className="font-playfair text-lg md:text-xl text-[#4A4A4A] mb-2 group-hover:text-[#C04267] transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
              {producto.nombre}
            </h3>

            <p className="font-lato text-sm text-[#6B6B6B] font-light mb-4 line-clamp-2 min-h-[2.5rem]">
              {producto.descripcion}
            </p>

            <div className="mb-5">
              <span className="font-playfair text-2xl font-semibold text-[#EE6B8D]">
                S/ {producto.precio.toFixed(2)}
              </span>
              <p className={`font-lato text-xs mt-1.5 font-medium tracking-wide ${
                producto.stock === 0 ? (isAmigurumiOrCaja ? 'text-[#EE6B8D]' : 'text-gray-400') : 
                producto.stock <= 5 ? 'text-orange-500' : 
                'text-[#6B6B6B]'
              }`}>
                {producto.stock === 0 ? (isAmigurumiOrCaja ? 'Disponible a pedido' : 'Sin stock por el momento') : 
                 producto.stock <= 5 ? '¡Casi agotado!' : 
                 `${producto.stock} disponibles`}
              </p>
            </div>
          </div>
        </Link>

        <button 
          onClick={handleAddToCart}
          disabled={producto.stock === 0 && !isAmigurumiOrCaja}
          className={`font-lato w-full py-2 mt-4 rounded-full font-medium transition-colors ${
            producto.stock === 0 && !isAmigurumiOrCaja
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-[#FDE8EF] text-[#C04267] hover:bg-[#EE6B8D] hover:text-white'
          }`}
        >
          {producto.stock === 0 && !isAmigurumiOrCaja 
            ? 'AGOTADO' 
            : producto.stock === 0 && isAmigurumiOrCaja
              ? 'SOLICITAR A PEDIDO'
              : 'Agregar al carrito'}
        </button>
      </div>
    );
  };

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
      <section className="max-w-6xl mx-auto px-4 py-12 md:py-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-[#FDE8EF] max-w-2xl mx-auto">
            <span className="text-6xl block mb-4">🧶</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {filteredProducts.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}