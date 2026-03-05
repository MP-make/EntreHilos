'use client';

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/ventify";
import { slugify } from "@/lib/utils";
import { Sparkles, Heart, Package, Truck, MessageCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

interface HomeClientProps {
  products: Product[];
}

// Tipos de pestañas disponibles
type TabType = 'Ramos' | 'Amigurumis' | 'Cajas' | 'HotWheels' | 'Ver Todo';

// ==================== COMPONENTE HERO CARRUSEL ====================
function HeroCarousel({ products }: { products: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Social proof diferenciado por tipo de slide
  const proofRamos = [
    '⭐ +200 clientes felices en Pisco',
    '🚚 Envío el mismo día',
    '🎁 Empaque de regalo incluido',
    '✂️ 100% hecho a mano',
  ];
  const proofPedido = [
    '⭐ +200 clientes felices en Pisco',
    '📅 Separa tu fecha de entrega',
    '🎁 Empaque de regalo incluido',
    '✂️ 100% hecho a mano',
  ];

  const slides = [
    // ── SLIDE 0: Día de la Mujer — SOLO IMAGEN BANNER FULL WIDTH ──
    { type: 'banner', image: '/Dia-de-la-mujer-8M.webp' },

    // ── SLIDE 1: San Valentín / Ramos ──
    {
      type: 'product',
      badge: 'Especial Día de la Mujer',
      badgeStyle: 'bg-[#5E548E]/10 text-[#5E548E] border-[#9F86C0]/40',
      badgeEmoji: '💜',
      title: 'El regalo perfecto',
      titleHighlight: 'para ella este 8M 🌸',
      subtitle: 'Ramos de crochet artesanales, globos y arreglos únicos en Pisco.',
      description: 'Porque merece algo especial, hecho con amor.',
      image: products.find(p => p?.nombre?.toLowerCase().includes('snoopy'))?.imagen || products.find(p => p?.nombre?.toLowerCase().includes('ramo'))?.imagen || '/logo.jpg',
      bgColor: 'bg-gradient-to-br from-pink-50 via-white to-purple-50',
      price: 80,
      link: '#catalogo',
      imageStyle: 'cover', // imagen con fondo → bordes redondeados
      proof: proofRamos,
    },

    // ── SLIDE 2: Amigurumis — imagen sin fondo, efecto flotante 2D ──
    {
      type: 'product',
      badge: 'Tus Personajes Favoritos',
      badgeStyle: 'bg-orange-100 text-orange-600 border-orange-200',
      badgeEmoji: '🧸',
      title: 'Imagina tu personaje favorito',
      titleHighlight: 'tejido a crochet ✨',
      subtitle: 'Creamos el amigurumi de tus sueños a pedido.',
      description: 'Cada puntada lleva dedicación y amor.',
      image: products.find(p => p?.nombre?.toLowerCase().includes('messi'))?.imagen || products.find(p => p?.nombre?.toLowerCase().includes('goku') || p?.nombre?.toLowerCase().includes('naruto'))?.imagen || '/logo.jpg',
      bgColor: 'bg-gradient-to-br from-purple-50 via-white to-blue-50',
      price: 115,
      link: '#catalogo',
      imageStyle: 'transparent', // sin fondo, objeto flotante
      proof: proofPedido,
    },

    // ── SLIDE 3: Personalizados — cajita tulipán con estilo cover ──
    {
      type: 'product',
      badge: 'A Tu Medida',
      badgeStyle: 'bg-orange-100 text-orange-600 border-orange-200',
      badgeEmoji: '🎁',
      title: 'Crea algo especial',
      titleHighlight: 'para alguien especial 💝',
      subtitle: 'Cajas regalo, cuadros y diseños únicos hechos para ti.',
      description: 'Convierte tus ideas en realidad con nuestros diseños personalizados.',
      image: products.find(p => p?.nombre?.toLowerCase().includes('tulip'))?.imagen
        || products.find(p => p?.nombre?.toLowerCase().includes('caja') && p?.nombre?.toLowerCase().includes('ramo'))?.imagen
        || products.find(p => p?.sku?.startsWith('Caja-'))?.imagen
        || products[0]?.imagen
        || '/logo.jpg',
      bgColor: 'bg-gradient-to-br from-amber-50 via-white to-pink-50',
      price: 50,
      link: '#catalogo',
      imageStyle: 'cover',
      proof: proofPedido,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100' : 'opacity-0 absolute inset-0'
          }`}
        >
          {/* ── BANNER FULL WIDTH (solo slide 8M) ── */}
          {slide.type === 'banner' && (
            <div className="relative w-full h-[500px] md:h-[580px]">
              {/* Imagen móvil */}
              <Image
                src="/Dia-de-la-mujer-8M-versionmovil.png"
                alt="Día Internacional de la Mujer · 8M"
                fill
                quality={100}
                className="object-cover object-center md:hidden"
                priority
              />
              {/* Imagen desktop */}
              <Image
                src={slide.image}
                alt="Día Internacional de la Mujer · 8M"
                fill
                quality={100}
                className="object-cover object-center hidden md:block"
                priority
              />
              {/* Overlay sutil con botones en la parte inferior */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#3B1F6A]/70 to-transparent px-6 py-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="#catalogo"
                  className="font-lato px-8 py-3 bg-[#9F86C0] text-white font-semibold text-sm tracking-wide rounded-full hover:bg-[#5E548E] transition-all duration-300 shadow-lg"
                >
                  Ver Colección 💜
                </Link>
                <button
                  onClick={() => window.open('https://wa.me/51927005798', '_blank')}
                  className="font-lato px-8 py-3 bg-white/90 text-[#5E548E] font-semibold text-sm tracking-wide rounded-full hover:bg-white transition-all duration-300 shadow-lg flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  Pedir por WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* ── SLIDE DE PRODUCTO ── */}
          {slide.type === 'product' && (
            <div className={`${(slide as any).bgColor} h-[500px] md:h-[580px]`}>
              <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
                <div className="w-full h-full flex flex-col lg:grid lg:grid-cols-2 lg:gap-10 items-center py-6">

                  {/* MÓVIL: solo imagen + título encima. DESKTOP: layout completo */}
                  {/* Columna imagen — siempre arriba en móvil */}
                  <div className="order-1 lg:order-2 flex items-center justify-center flex-shrink-0">
                    <div className="relative inline-block">
                      {(slide as any).imageStyle === 'transparent' ? (
                        <div className="relative w-[270px] h-[270px] md:w-[360px] md:h-[360px]">
                          <Image
                            src={(slide as any).image}
                            alt={(slide as any).title}
                            fill
                            className="object-contain"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="relative w-[290px] h-[270px] md:w-[420px] md:h-[400px] rounded-2xl overflow-hidden shadow-xl bg-gray-100">
                          <Image
                            src={(slide as any).image}
                            alt={(slide as any).title}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      {/* Badge precio */}
                      <div className="absolute -top-3 -right-3 md:-top-4 md:-right-4 w-16 h-16 md:w-20 md:h-20 bg-[#FCD34D] rounded-full shadow-xl flex flex-col items-center justify-center z-10 border-4 border-white">
                        <p className="font-lato text-[9px] md:text-[10px] font-light text-gray-700">A solo</p>
                        <p className="font-playfair text-base md:text-xl font-bold text-gray-900 leading-none">S/ {(slide as any).price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Columna texto */}
                  <div className="order-2 lg:order-1 text-center lg:text-left space-y-2 lg:space-y-4 mt-3 lg:mt-0">
                    {/* Badge — oculto en móvil para ahorrar espacio */}
                    <div className={`hidden lg:inline-flex items-center gap-2 px-4 py-2 rounded-full border ${(slide as any).badgeStyle}`}>
                      <span className="text-base">{(slide as any).badgeEmoji}</span>
                      <span className="font-lato text-sm font-semibold">{(slide as any).badge}</span>
                    </div>

                    {/* Título — siempre visible */}
                    <div>
                      <h1 className="font-playfair text-2xl md:text-5xl lg:text-6xl font-normal text-gray-900 mb-1 leading-tight">
                        {(slide as any).title}
                      </h1>
                      <h2 className="font-playfair text-2xl md:text-5xl lg:text-6xl font-normal text-[#BE185D] leading-tight">
                        {(slide as any).titleHighlight}
                      </h2>
                    </div>

                    {/* Subtítulo — oculto en móvil */}
                    <p className="hidden md:block font-lato text-sm md:text-base text-gray-700 leading-relaxed">
                      {(slide as any).subtitle}
                    </p>

                    {/* Social proof pills — oculto en móvil */}
                    <div className="hidden md:flex flex-wrap gap-2 justify-center lg:justify-start">
                      {((slide as any).proof as string[]).map((proof: string, i: number) => (
                        <span key={i} className="font-lato text-xs bg-white/80 backdrop-blur-sm border border-[#9F86C0]/20 text-gray-600 px-3 py-1 rounded-full">
                          {proof}
                        </span>
                      ))}
                    </div>

                    {/* Botones — oculto en móvil */}
                    <div className="hidden md:flex flex-col sm:flex-row gap-3 pt-1">
                      <Link
                        href={(slide as any).link}
                        className="font-lato px-7 py-3 bg-[#9F86C0] text-white font-semibold text-sm tracking-wide transition-all duration-300 rounded-full hover:bg-[#5E548E] shadow-lg hover:shadow-xl hover:-translate-y-1 text-center"
                      >
                        Ver Colección
                      </Link>
                      <button
                        onClick={() => window.open('https://wa.me/51927005798', '_blank')}
                        className="font-lato px-7 py-3 border-2 border-[#5E548E] text-[#5E548E] font-semibold text-sm tracking-wide transition-all duration-300 rounded-full hover:bg-[#5E548E] hover:text-white flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={16} />
                        Pedir por WhatsApp
                      </button>
                    </div>

                    {/* Botón único en móvil */}
                    <div className="flex md:hidden justify-center gap-3 pt-1">
                      <Link
                        href={(slide as any).link}
                        className="font-lato px-6 py-2.5 bg-[#9F86C0] text-white font-semibold text-sm rounded-full hover:bg-[#5E548E] shadow-md"
                      >
                        Ver Colección 💜
                      </Link>
                      <button
                        onClick={() => window.open('https://wa.me/51927005798', '_blank')}
                        className="font-lato px-4 py-2.5 border-2 border-[#5E548E] text-[#5E548E] font-semibold text-sm rounded-full flex items-center gap-1"
                      >
                        <MessageCircle size={14} />
                        WA
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Puntos de navegación */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              currentSlide === index
                ? 'bg-[#5E548E] w-10 h-3'
                : 'bg-white/60 w-3 h-3 hover:bg-[#9F86C0]'
            }`}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

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
    let filtered: typeof enrichedProducts = [];
    
    switch (tab) {
      case 'Ramos':
        filtered = enrichedProducts.filter(p => p.sku.startsWith('Ramos-') || p.sku.startsWith('Madre-'));
        // Priorizar productos con stock (primero los que tienen stock, luego los agotados)
        filtered.sort((a, b) => {
          if (a.stock > 0 && b.stock === 0) return -1;
          if (a.stock === 0 && b.stock > 0) return 1;
          return 0;
        });
        return filtered;
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
        // En "Ver Todo", ocultar productos sin stock EXCEPTO Amigurumis y Cajas
        return enrichedProducts.filter(p => {
          const isAmigurumiOrCaja = p.sku.startsWith('Amigu-') || p.sku.startsWith('Caja-');
          // Mostrar si tiene stock O si es Amigurumi/Caja (aunque no tenga stock)
          return p.stock > 0 || isAmigurumiOrCaja;
        });
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
    const { addToCart } = useCart();
    
    // Determinar si el producto es de Amigurumis o Cajas
    const isAmigurumiOrCaja = producto.sku.startsWith('Amigu-') || producto.sku.startsWith('Caja-');
    
    // Lógica de stock
    const stockLabel = producto.stock === 0 
      ? (isAmigurumiOrCaja ? 'A pedido' : 'Agotado')
      : producto.stock <= 5 
        ? 'Últimas unidades' 
        : `${producto.stock} disponibles`;
    
    const stockColor = producto.stock === 0 
      ? (isAmigurumiOrCaja ? 'text-[#9F86C0]' : 'text-red-600')
      : producto.stock <= 5 
        ? 'text-orange-600' 
        : 'text-gray-600';

    const handleAddToCart = () => {
      // Si es producto a pedido (sin stock), redirigir a página de pedido personalizado
      if (producto.stock === 0 && isAmigurumiOrCaja) {
        // Codificar datos del producto para pasarlos por URL
        const productoData = encodeURIComponent(JSON.stringify({
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen, // Pasar la URL completa de la imagen
          sku: producto.sku
        }));
        // Usar router.push en lugar de window.location para mejor navegación
        const url = `/pedido-personalizado?producto=${productoData}`;
        window.location.href = url;
        return;
      }
      
      // No bloquear si es producto normal sin stock
      if (producto.stock === 0 && !isAmigurumiOrCaja) return;
      
      // Agregar al carrito productos con stock
      addToCart(producto);
      alert('¡Agregado al carrito! 💜');
    };

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

            {producto.stock === 0 && !isAmigurumiOrCaja && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                <span className="font-lato text-sm text-white tracking-wide bg-red-600 px-4 py-2 rounded-full">
                  AGOTADO
                </span>
              </div>
            )}
            
            {producto.stock === 0 && isAmigurumiOrCaja && (
              <div className="absolute top-3 right-3 px-2 py-1 bg-[#9F86C0] text-white text-xs font-lato font-bold rounded">
                A pedido
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
          onClick={handleAddToCart}
          disabled={producto.stock === 0 && !isAmigurumiOrCaja}
          className={`font-lato w-full py-3 text-sm font-medium tracking-wide transition-all duration-300 rounded ${
            producto.stock === 0 && !isAmigurumiOrCaja
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : producto.stock === 0 && isAmigurumiOrCaja
                ? 'bg-[#9F86C0] text-white hover:bg-[#5E548E] shadow-sm hover:shadow-md'
                : 'bg-[#9F86C0] text-white hover:bg-[#5E548E] shadow-sm hover:shadow-md'
          }`}
        >
          {producto.stock === 0 && !isAmigurumiOrCaja 
            ? 'AGOTADO' 
            : producto.stock === 0 && isAmigurumiOrCaja
              ? 'A PEDIDO (1-2 semanas)'
              : 'Agregar al carrito'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDF4F7]">
      {/* ==================== HERO CARRUSEL AUTOMÁTICO ==================== */}
      <HeroCarousel products={enrichedProducts} />

      {/* ==================== NAVEGACIÓN POR PESTAÑAS ==================== */}
      <section id="catalogo" className="bg-[#FDF4F7] sticky top-[88px] z-30">
        <div className="max-w-6xl mx-auto px-4">

          {/* ── DESKTOP: línea morada debajo del activo ── */}
          <div className="hidden md:flex items-center justify-center gap-8 py-3 border-b border-gray-200">
            {(['Ramos', 'Amigurumis', 'Cajas', 'HotWheels', 'Ver Todo'] as TabType[]).map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-lato text-sm tracking-wide transition-all duration-300 pb-2 relative whitespace-nowrap ${
                    isActive
                      ? 'text-[#5E548E] font-semibold'
                      : 'text-[#6B6B6B] hover:text-[#5E548E] font-normal'
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#9F86C0] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── MÓVIL: píldoras con scroll horizontal, sin sombra ── */}
          <div className="flex md:hidden overflow-x-auto scrollbar-hide border-b border-gray-200">
            <div className="flex gap-2 py-2 px-1 min-w-max">
              {(['Ramos', 'Amigurumis', 'Cajas', 'HotWheels', 'Ver Todo'] as TabType[]).map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`font-lato text-sm tracking-wide transition-all duration-300 py-1.5 px-4 rounded-full whitespace-nowrap flex-shrink-0 ${
                      isActive
                        ? 'text-white bg-[#9F86C0] font-semibold'
                        : 'text-[#6B6B6B] hover:text-[#5E548E] font-normal hover:bg-[#9F86C0]/10'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
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