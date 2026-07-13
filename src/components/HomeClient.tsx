'use client';

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/ventify";
import { slugify } from "@/lib/utils";
import { Sparkles, Heart, Package, Truck } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { useCart } from "@/context/CartContext";
import { loadExtras } from "@/lib/extras-cache";
import QuickViewDrawer from "@/components/QuickViewDrawer";
import ProductCard from "@/components/ProductCard";

interface HomeClientProps {
  products: Product[];
}

type TabType = 'Ramos' | 'Amigurumis' | 'Cajas' | 'HotWheels' | 'Ver Todo';

// ==================== TOKENS DE MARCA ====================
const BRAND = {
  canvas: '#FBF6EF',
  ink: '#2E2422',
  inkSoft: '#6B5D54',
  rose: '#EE6B8D',
  roseDark: '#C04267',
  roseSoft: '#F3E1E6',
  clay: '#C97B4A',
  moss: '#6B7A5E',
  gold: '#C99A3E',
  goldSoft: '#F5E9CE',
  line: '#EDE4D9',
};

// ==================== COMPONENTE HERO CARRUSEL ====================
function HeroCarousel({ products }: { products: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      isFlyer: true,
      imageDesktop: '/dia-de-la-madre-horizontal.png',
      imageMobile: '/dia-de-la-madre-vertical.png',
      link: '/category/dia-de-la-madre',
    },
    {
      isFlyer: false,
      badge: 'Especial',
      title: 'Haz que su corazón',
      titleHighlight: 'lata más fuerte ',
      subtitle: 'Arreglos personalizados, globos y detalles únicos en Pisco.',
      description: 'Porque cada momento merece ser celebrado.',
      image: products.find(p => p?.nombre?.toLowerCase().includes('snoopy'))?.imagen || products.find(p => p?.nombre?.toLowerCase().includes('ramo'))?.imagen || '/logo.png',
      price: 80,
      link: '#catalogo',
    },
    {
      isFlyer: false,
      badge: 'Tus Personajes Favoritos',
      title: 'Imagina tu personaje favorito',
      titleHighlight: 'tejido a crochet ',
      subtitle: 'Creamos el amigurumi de tus sueños',
      description: 'Cada puntada lleva dedicación y amor',
      image: products.find(p => p?.nombre?.toLowerCase().includes('messi'))?.imagen || products.find(p => p?.nombre?.toLowerCase().includes('goku') || p?.nombre?.toLowerCase().includes('naruto'))?.imagen || '/logo.png',
      price: 115,
      link: '#catalogo',
    },
    {
      isFlyer: false,
      badge: 'A Tu Medida',
      title: 'Crea algo especial',
      titleHighlight: 'para alguien especial ',
      subtitle: 'Cajas decoradas, tulipanes y diseños únicos hechos para ti',
      description: 'Convierte tus ideas en realidad con nuestros diseños',
      image: products.find(p => p?.nombre?.toLowerCase().includes('cajita') && p?.nombre?.toLowerCase().includes('tulipan'))?.imagen || products.find(p => p?.nombre?.toLowerCase().includes('caja'))?.imagen || '/logo.png',
      price: 50,
      link: '#catalogo',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    // pt-4: separación de seguridad respecto al nav. Si tu header usa position:fixed,
    // agrega además un padding-top al <main> o wrapper del layout igual a la altura del header,
    // porque este componente no puede saber esa altura desde acá.
    <section className="relative overflow-hidden pt-4 md:pt-0" style={{ backgroundColor: BRAND.canvas }}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`transition-opacity duration-1000 ${
            currentSlide === index ? 'opacity-100 relative z-10' : 'opacity-0 absolute inset-0 z-0 pointer-events-none'
          }`}
        >
          <div className="h-[560px] sm:h-[520px] md:h-[600px] relative" style={{ backgroundColor: BRAND.canvas }}>
            {slide.isFlyer ? (
              <Link href={slide.link} className="absolute inset-0 w-full h-full block group overflow-hidden">
                <Image
                  src={slide.imageDesktop || '/logo.png'}
                  alt="Promoción Especial Entre Hilos"
                  fill
                  className="object-cover object-center hidden lg:block group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority={index === 0}
                  sizes="100vw"
                />
                <Image
                  src={slide.imageMobile || '/logo.png'}
                  alt="Promoción Especial Entre Hilos Móvil"
                  fill
                  className="object-cover object-center block lg:hidden group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority={index === 0}
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
              </Link>
            ) : (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-16 md:py-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center">

                  {/* Columna Imagen — en mobile va primero, con margen propio para no pegarse al nav */}
                  <div className="relative order-1 lg:order-2">
                    <div className="relative p-2 rounded-[2rem] border-2 border-dashed" style={{ borderColor: BRAND.rose + '55' }}>
                      <div className="relative h-[320px] sm:h-[340px] md:h-[480px] rounded-[1.5rem] overflow-hidden shadow-xl bg-gray-100">
                        <Image
                          src={slide.image || '/logo.png'}
                          alt={slide.title || "Producto"}
                          fill
                          className="object-cover"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />
                      </div>
                    </div>

                    <div
                      className="absolute -top-3 -right-3 sm:-top-4 sm:-right-4 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full shadow-xl flex flex-col items-center justify-center z-10 border-2 border-dashed border-white rotate-6"
                      style={{ backgroundColor: BRAND.gold }}
                    >
                      <p className="font-lato text-[8px] sm:text-xs font-light text-white/90 leading-tight">A solo</p>
                      <p className="font-playfair text-xs sm:text-base md:text-2xl font-bold text-white leading-none">S/ {slide.price}</p>
                    </div>
                  </div>

                  {/* Columna Contenido */}
                  <div className="text-center lg:text-left space-y-3 md:space-y-6 order-2 lg:order-1">

                    <div
                      className="hidden lg:inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-dashed"
                      style={{ backgroundColor: BRAND.roseSoft, color: BRAND.roseDark, borderColor: BRAND.rose }}
                    >
                      <span className="text-sm md:text-base">
                        {index === 1 ? '' : index === 2 ? '' : ''}
                      </span>
                      <span className="font-lato text-xs md:text-sm font-semibold tracking-wide">{slide.badge}</span>
                    </div>

                    <div className="hidden lg:block">
                      <h1
                        className="font-playfair text-[28px] leading-[1.15] sm:text-4xl md:text-5xl lg:text-6xl font-normal sm:leading-[1.05] tracking-tight mb-1 md:mb-2"
                        style={{ color: BRAND.ink }}
                      >
                        {slide.title}
                      </h1>
                      <h2
                        className="font-playfair text-[28px] leading-[1.15] sm:text-4xl md:text-5xl lg:text-6xl italic font-normal sm:leading-[1.05]"
                        style={{ color: BRAND.rose }}
                      >
                        {slide.titleHighlight}
                      </h2>
                    </div>

                    <p className="hidden lg:block font-lato text-[15px] md:text-lg leading-relaxed" style={{ color: BRAND.inkSoft }}>
                      {slide.subtitle}
                    </p>
                    <p className="hidden lg:block font-lato text-sm italic" style={{ color: BRAND.inkSoft, opacity: 0.75 }}>
                      {slide.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2 sm:pt-4">
                      <Link
                        href={slide.link}
                        className="font-lato px-6 sm:px-8 py-3.5 sm:py-4 text-white font-semibold text-sm tracking-wide transition-all duration-300 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 text-center"
                        style={{ backgroundColor: BRAND.rose }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.roseDark)}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.rose)}
                      >
                        Ver Colección
                      </Link>

                      <button
                        onClick={() => window.open('https://wa.me/51902578295', '_blank')}
                        className="group font-lato px-6 sm:px-8 py-3.5 sm:py-4 border-2 border-dashed font-semibold text-sm tracking-wide transition-all duration-300 rounded-full flex items-center justify-center gap-2 hover:-translate-y-1"
                        style={{ borderColor: BRAND.rose, color: BRAND.roseDark }}
                        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = BRAND.roseSoft; }}
                        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                      >
                        <Image
                          src="/Wspicono.png"
                          alt="WhatsApp"
                          width={20}
                          height={20}
                          className="transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-12"
                        />
                        Contactar al WhatsApp
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Puntos de navegación — con padding propio reservado abajo (pb-16 arriba) para que nunca se solapen con los botones */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className="transition-all duration-300 rounded-full shadow-sm"
            style={{
              backgroundColor: currentSlide === index ? BRAND.rose : 'rgba(255,255,255,0.8)',
              width: currentSlide === index ? '2.25rem' : '0.625rem',
              height: '0.625rem',
              border: currentSlide === index ? 'none' : `1px solid ${BRAND.inkSoft}55`,
            }}
            aria-label={`Ir al slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}

// ==================== HELPER FUNCTIONS ====================

function getCategoryBySku(sku: string): string {
  if (sku.startsWith('Ramos-') || ['Caja-001', 'Caja-002', 'Caja-003'].includes(sku)) return 'San Valentín';
  if (['Caja-004', 'Caja-005', 'Cua-001', 'Carr-001'].includes(sku)) return 'Día HotWheels';
  if (sku.startsWith('Madre-')) return 'Día de la Madre';
  if (sku.startsWith('Amigu-')) return 'Personalizados';
  return 'Otros';
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
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    loadExtras(() => {});
  }, []);

  const enrichedProducts = products.map(product => ({
    ...product,
    categoryBySku: getCategoryBySku(product.sku),
  }));

  const handleQuickView = useCallback((producto: any) => {
    setSelectedProduct(producto);
  }, []);

  const handleCloseDrawer = useCallback(() => {
    setSelectedProduct(null);
  }, []);

  const handleDrawerAddToCart = useCallback((producto: any, quantity: number) => {
    for (let i = 0; i < quantity; i++) {
      addToCart(producto);
    }
  }, [addToCart]);

  const getProductsByTab = (tab: TabType) => {
    let filtered: typeof enrichedProducts = [];

    switch (tab) {
      case 'Ramos':
        filtered = enrichedProducts.filter(p => p.sku.startsWith('Ramos-') || p.sku.startsWith('Madre-'));
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
        return enrichedProducts.filter(p => {
          const isAmigurumiOrCaja = p.sku.startsWith('Amigu-') || p.sku.startsWith('Caja-');
          return p.stock > 0 || isAmigurumiOrCaja;
        });
      default:
        return enrichedProducts;
    }
  };

  const displayProducts = getProductsByTab(activeTab);

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.canvas }}>
      {selectedProduct && (
        <QuickViewDrawer
          product={selectedProduct}
          onClose={handleCloseDrawer}
          onAddToCart={handleDrawerAddToCart}
        />
      )}
      <HeroCarousel products={enrichedProducts} />

      {/*
        Tabs de categoría: antes eran "sticky" con un offset fijo en px (top-[60px]/[130px])
        adivinado a mano, que no coincide con la altura real de tu nav en todos los anchos
        y causaba solapes. Los dejo en flujo normal (no sticky) — más robusto en cualquier
        pantalla. Si querés que se peguen al hacer scroll, pasame la altura real de tu header
        en cada breakpoint y lo calculamos bien con una CSS var en vez de un número fijo.
      */}
      <section
        id="catalogo"
        className="py-6 sm:py-8 px-4 flex overflow-x-auto sm:flex-wrap sm:justify-center gap-3 sm:gap-4 whitespace-nowrap sm:whitespace-normal"
        style={{ backgroundColor: BRAND.canvas }}
      >
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

      <section className="py-14 sm:py-16 px-4 border-t" style={{ backgroundColor: 'white', borderColor: BRAND.line }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <span className="font-lato text-xs tracking-[0.2em] uppercase" style={{ color: BRAND.clay }}>
              Nuestro oficio
            </span>
          </div>
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-semibold text-center mb-10 sm:mb-14" style={{ color: BRAND.roseDark }}>
            Por qué elegir Entre Hilos
          </h2>

          <div className="relative">
            <div
              className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0 border-t-2 border-dashed"
              style={{ borderColor: BRAND.rose + '50' }}
              aria-hidden="true"
            />

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 relative">
              {[
                { icon: Sparkles, label: 'Calidad Premium', desc: 'Hilos de algodón de la más alta calidad', color: BRAND.rose, rotate: '-rotate-2' },
                { icon: Heart, label: 'Hecho a Mano', desc: 'Cada pieza tejida con dedicación', color: BRAND.clay, rotate: 'rotate-2' },
                { icon: Package, label: 'Personalizable', desc: 'Diseños adaptados a tus necesidades', color: BRAND.moss, rotate: '-rotate-2' },
                { icon: Truck, label: 'Envío Seguro', desc: 'Empaque especial y protegido', color: BRAND.gold, rotate: 'rotate-2' },
              ].map(({ icon: Icon, label, desc, color, rotate }) => (
                <div key={label} className="text-center">
                  <div
                    className={`w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl flex items-center justify-center shadow-sm border-2 border-dashed bg-white ${rotate}`}
                    style={{ borderColor: color }}
                  >
                    <Icon size={24} style={{ color }} />
                  </div>
                  <h3 className="font-playfair text-base sm:text-lg font-semibold mb-1 sm:mb-2" style={{ color: BRAND.roseDark }}>
                    {label}
                  </h3>
                  <p className="font-lato text-xs sm:text-sm font-light leading-relaxed" style={{ color: BRAND.inkSoft }}>
                    {desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}