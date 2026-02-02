"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { getVentifyProducts } from "@/lib/ventify";
import { slugify } from "@/lib/utils";
import { notFound } from "next/navigation";

const categoryTitles: Record<string, string> = {
  'san-valentin': 'San Valentín',
  'dia-de-la-madre': 'Día de la Madre',
  'hotwheels': 'Colección HotWheels',
  'personalizados': 'Personalizados',
};

const categoryDescriptions: Record<string, string> = {
  'san-valentin': 'Regalos perfectos para expresar tu amor',
  'dia-de-la-madre': 'Detalles eternos para mamá',
  'hotwheels': 'Diversión tejida a mano',
  'personalizados': 'Diseños únicos hechos a tu medida',
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [categoryTitle, setCategoryTitle] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      const { slug } = await params;
      const allProducts = await getVentifyProducts();

      let products;
      switch (slug) {
        case 'san-valentin':
          products = allProducts.filter(p =>
            p.sku.startsWith('Ramos-') ||
            ['Caja-001', 'Caja-002', 'Caja-003'].includes(p.sku)
          );
          break;

        case 'dia-de-la-madre':
          products = allProducts.filter(p => p.sku.startsWith('Madre-'));
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

      setFilteredProducts(products);
      setCategoryTitle(categoryTitles[slug] || 'Categoría');
      setCategoryDescription(categoryDescriptions[slug] || '');
      setLoading(false);
    };
    fetchCategory();
  }, [params]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF4F7] flex items-center justify-center">
        <div className="text-[#9F86C0] text-lg">Cargando categoría...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF4F7]">
      {/* Header de Categoría */}
      <section className="bg-white py-16 px-4 border-b border-gray-200">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="font-playfair text-4xl md:text-5xl font-semibold text-[#5E548E] mb-4">
            {categoryTitle}
          </h1>
          <p className="font-lato text-lg text-[#6B6B6B] font-light">
            {categoryDescription}
          </p>
        </div>
      </section>

      {/* Grilla de Productos */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-playfair text-2xl text-[#6B6B6B] mb-3">
              Próximamente nuevos productos
            </p>
            <p className="font-lato text-sm text-[#6B6B6B] font-light mb-8">
              Estamos preparando más sorpresas para ti
            </p>
            <Link 
              href="/"
              className="font-lato px-8 py-3 bg-[#9F86C0] hover:bg-[#5E548E] text-white font-medium text-sm tracking-wide transition-all duration-300 rounded shadow-sm"
            >
              Volver al inicio
            </Link>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <p className="font-lato text-lg text-[#6B6B6B] font-light">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} disponible{filteredProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((producto) => (
                <div key={producto.id} className="group">
                  <Link href={`/product/${slugify(producto.nombre)}`} className="block">
                    <div className="relative aspect-square bg-white mb-4 overflow-hidden rounded-lg shadow-sm border border-gray-100 hover:border-[#9F86C0] transition-all duration-300">
                      <Image
                        src={producto.imagen}
                        alt={producto.nombre}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      />
                      
                      {producto.stock <= 5 && producto.stock > 0 && (
                        <div className="absolute top-3 right-3 px-2 py-1 bg-orange-500 text-white text-xs font-lato font-bold rounded">
                          Últimas unidades
                        </div>
                      )}

                      {producto.stock === 0 && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                          <span className="font-lato text-sm text-white tracking-wide bg-red-600 px-4 py-2 rounded-full">
                            AGOTADO
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="text-center">
                      <h3 className="font-playfair text-lg text-[#4A4A4A] mb-2 group-hover:text-[#5E548E] transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
                        {producto.nombre}
                      </h3>

                      <p className="font-lato text-sm text-[#6B6B6B] font-light mb-4 line-clamp-2 min-h-[2.5rem]">
                        {producto.descripcion}
                      </p>

                      <div className="mb-4">
                        <span className="font-playfair text-2xl font-medium text-[#9F86C0]">
                          S/ {producto.precio.toFixed(2)}
                        </span>
                        <p className={`font-lato text-xs mt-1 font-light ${
                          producto.stock === 0 ? 'text-red-600' : 
                          producto.stock <= 5 ? 'text-orange-600' : 
                          'text-gray-600'
                        }`}>
                          {producto.stock === 0 ? 'Agotado' : 
                           producto.stock <= 5 ? 'Últimas unidades' : 
                           `${producto.stock} disponibles`}
                        </p>
                      </div>
                    </div>
                  </Link>

                  <button 
                    onClick={() => alert('Pronto podrás comprar. Estamos terminando la web')}
                    disabled={producto.stock === 0}
                    className={`font-lato w-full py-3 text-sm font-medium tracking-wide transition-all duration-300 rounded ${
                      producto.stock === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-[#9F86C0] text-white hover:bg-[#5E548E] shadow-sm hover:shadow-md'
                    }`}
                  >
                    {producto.stock === 0 ? 'AGOTADO' : 'Agregar al carrito'}
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
