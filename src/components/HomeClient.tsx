'use client';

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/ventify";
import { slugify } from "@/lib/utils";
import { Sparkles, Heart, Package, Truck } from "lucide-react";
import { useState } from "react";

interface HomeClientProps {
  products: Product[];
}

// Tipos de pestañas disponibles
type TabType = 'Ramos' | 'Amigurumis' | 'Cajas' | 'HotWheels' | 'Ver Todo';

// ==================== HELPER FUNCTIONS ====================

function getCategoryBySku(sku: string): string {
  if (sku.startsWith('Ramos-') || ['Caja-001', 'Caja-002', 'Caja-003'].includes(sku)) {
    return 'San Valentín';
  }
  
  if (['Caja-004', 'Caja-005', 'Cua-001', 'Carr-001'].includes(sku)) {
    return 'Día HotWheels';
  }
  
  if (sku.startsWith('Madre-')) {
    return 'Día de la Madre';
  }
  
  if (sku.startsWith('Amigu-')) {
    return 'Personalizados';
  }
  
  return 'Otros';
}

function getCategoryBadgeColor(category: string): string {
  const colors: Record<string, string> = {
    'San Valentín': 'bg-[#E91E63]/10 text-[#E91E63] border-[#E91E63]/30',
    'Día HotWheels': 'bg-blue-50 text-blue-700 border-blue-200',
    'Día de la Madre': 'bg-pink-50 text-pink-700 border-pink-200',
    'Personalizados': 'bg-[#9F86C0]/10 text-[#5E548E] border-[#9F86C0]/30',
    'Otros': 'bg-gray-100/50 text-gray-600 border-gray-200',
  };
  return colors[category] || colors['Otros'];
}

function getAutoDescription(category: string, description?: string): string {
  if (description && description.toLowerCase() !== 'product image' && description.trim() !== '') {
    return description;
  }
  
  const autoDescriptions: Record<string, string> = {
    'San Valentín': 'El detalle perfecto para sorprender en el día más romántico',
    'Día HotWheels': 'Diversión tejida a mano para pequeños aventureros',
    'Día de la Madre': 'Un regalo eterno que nunca se marchita',
    'Personalizados': 'Tejido a mano con hilo de algodón premium según tu gusto',
    'Otros': 'Creación artesanal única hecha con amor y dedicación',
  };
  
  return autoDescriptions[category] || autoDescriptions['Otros'];
}

// ==================== COMPONENTE PRINCIPAL ====================

export default function HomeClient({ products }: HomeClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('Ramos');

  // Enriquecer productos con categoría calculada
  const enrichedProducts = products.map(product => ({
    ...product,
    categoryBySku: getCategoryBySku(product.sku),
  }));

  // Filtrar productos por categoría de pestaña
  const getProductsByTab = (tab: TabType) => {
    switch (tab) {
      case 'Ramos':
        return enrichedProducts.filter(p => p.sku.startsWith('Ramos-') || p.sku.startsWith('Madre-'));
      case 'Amigurumis':
        return enrichedProducts.filter(p => p.sku.startsWith('Amigu-'));
      case 'Cajas':
        return enrichedProducts.filter(p => p.sku.startsWith('Caja-'));
      case 'HotWheels':
        return enrichedProducts.filter(p => 
          p.sku.startsWith('Cua-') || 
          p.sku.startsWith('Carr-') || 
          ['Caja-004', 'Caja-005'].includes(p.sku)
        );
      case 'Ver Todo':
        return enrichedProducts;
      default:
        return enrichedProducts;
    }
  };

  const displayProducts = getProductsByTab(activeTab);

  // Imagen destacada del Hero (buscar Goku o Ramo)
  const imagenDestacada = enrichedProducts.find(p => 
    p.nombre.toLowerCase().includes('goku') || 
    p.nombre.toLowerCase().includes('ramo')
  )?.imagen || enrichedProducts[0]?.imagen || '/logo.jpg';

  // Componente de tarjeta de producto
  const ProductCard = ({ producto }: { producto: typeof enrichedProducts[0] }) => {
    // Lógica de stock
    const stockLabel = producto.stock === 0 
      ? 'Agotado' 
      : producto.stock <= 5 
        ? 'Últimas unidades' 
        : `${producto.stock} disponibles`;
    
    const stockColor = producto.stock === 0 
      ? 'text-red-600' 
      : producto.stock <= 5 
        ? 'text-orange-600' 
        : 'text-gray-600';

    return (
      <div className="group">
        <Link href={`/product/${slugify(producto.nombre)}`} className="block">
          <div className="relative aspect-square bg-white mb-4 overflow-hidden rounded-lg shadow-sm border border-gray-100 hover:border-[#9F86C0] transition-all duration-300">
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
            />
            
            <div className={`absolute top-3 left-3 px-3 py-1.5 text-xs font-lato font-medium border backdrop-blur-sm rounded ${getCategoryBadgeColor(producto.categoryBySku)}`}>
              {producto.categoryBySku}
            </div>

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
              {getAutoDescription(producto.categoryBySku, producto.descripcion)}
            </p>

            <div className="mb-4">
              <span className="font-playfair text-2xl font-medium text-[#9F86C0]">
                S/ {producto.precio.toFixed(2)}
              </span>
              <p className={`font-lato text-xs mt-1 font-light ${stockColor}`}>
                {stockLabel}
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
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF4F7]">
      {/* ==================== HERO EDITORIAL ==================== */}
      <section className="relative py-20 md:py-28 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Columna Izquierda: Texto Editorial */}
            <div className="text-center lg:text-left">
              <h1 className="font-playfair text-5xl md:text-6xl lg:text-7xl font-semibold text-[#5E548E] mb-6 tracking-tight leading-tight">
                Arte en Crochet
              </h1>
              
              <p className="font-lato text-lg md:text-xl text-[#6B6B6B] mb-10 font-light leading-relaxed">
                Detalles únicos tejidos a mano para momentos inolvidables
              </p>

              <button 
                onClick={() => {
                  document.querySelector('#catalogo')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="font-lato px-10 py-4 bg-[#9F86C0] hover:bg-[#5E548E] text-white font-medium text-base tracking-wide transition-all duration-300 rounded shadow-lg hover:shadow-xl"
              >
                Ver Colección
              </button>
            </div>

            {/* Columna Derecha: Imagen destacada */}
            <div className="relative aspect-square lg:aspect-auto lg:h-[500px] rounded-lg overflow-hidden shadow-xl">
              <Image
                src={imagenDestacada}
                alt="Producto destacado - Entre Hilos"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* ==================== NAVEGACIÓN POR PESTAÑAS ==================== */}
      <section id="catalogo" className="bg-[#FDF4F7] border-y border-gray-200 py-8 px-4 sticky top-[73px] z-40">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            {(['Ramos', 'Amigurumis', 'Cajas', 'HotWheels', 'Ver Todo'] as TabType[]).map((tab) => {
              const isActive = activeTab === tab;
              const count = getProductsByTab(tab).length;
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-lato text-base tracking-wide transition-all duration-300 pb-2 relative ${
                    isActive
                      ? 'text-[#5E548E] font-medium'
                      : 'text-[#6B6B6B] hover:text-[#5E548E] font-light'
                  }`}
                >
                  {tab}
                  <span className="text-sm ml-1">({count})</span>
                  
                  {/* Subrayado elegante */}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9F86C0]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ==================== GRILLA DE PRODUCTOS FILTRADA ==================== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        {displayProducts.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-playfair text-2xl text-[#6B6B6B] mb-3">
              No hay productos en esta categoría
            </p>
            <p className="font-lato text-sm text-[#6B6B6B] font-light">
              Explora otras secciones de nuestro catálogo
            </p>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#5E548E] mb-3">
                {activeTab === 'Ver Todo' ? 'Toda la Colección' : activeTab}
              </h2>
              <p className="font-lato text-lg text-[#6B6B6B] font-light">
                {displayProducts.length} producto{displayProducts.length !== 1 ? 's' : ''} disponible{displayProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayProducts.map((producto) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* ==================== BENEFICIOS (MOVIDOS AL FINAL) ==================== */}
      <section className="bg-white py-16 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#5E548E] text-center mb-12">
            Por qué elegir Entre Hilos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#9F86C0]/10 rounded-full flex items-center justify-center">
                <Sparkles size={32} className="text-[#9F86C0]" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-[#5E548E] mb-2">
                Calidad Premium
              </h3>
              <p className="font-lato text-sm text-[#6B6B6B] font-light leading-relaxed">
                Hilos de algodón de la más alta calidad
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#9F86C0]/10 rounded-full flex items-center justify-center">
                <Heart size={32} className="text-[#9F86C0]" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-[#5E548E] mb-2">
                Hecho a Mano
              </h3>
              <p className="font-lato text-sm text-[#6B6B6B] font-light leading-relaxed">
                Cada pieza tejida con dedicación
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#9F86C0]/10 rounded-full flex items-center justify-center">
                <Package size={32} className="text-[#9F86C0]" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-[#5E548E] mb-2">
                Personalizable
              </h3>
              <p className="font-lato text-sm text-[#6B6B6B] font-light leading-relaxed">
                Diseños adaptados a tus necesidades
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#9F86C0]/10 rounded-full flex items-center justify-center">
                <Truck size={32} className="text-[#9F86C0]" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-[#5E548E] mb-2">
                Envío Seguro
              </h3>
              <p className="font-lato text-sm text-[#6B6B6B] font-light leading-relaxed">
                Empaque especial y protegido
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
