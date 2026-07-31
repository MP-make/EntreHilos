'use client';

import Image from "next/image";
import Link from "next/link";
import { Product } from "@/lib/ventify";
import { Sparkles, Heart, Package, Truck, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import QuickViewDrawer from "@/components/QuickViewDrawer";

interface HomeClientProps {
  products: Product[];
  sections: any[];
  heroData?: any[];
}

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

function HeroCarousel({ products, heroData: initialHeroData }: { products: any[]; heroData?: any[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [heroDesktop, setHeroDesktop] = useState(initialHeroData?.find((h: any) => h.clave === 'home_hero_1')?.imagen_url || "");
  const [heroMobile, setHeroMobile] = useState(initialHeroData?.find((h: any) => h.clave === 'home_hero_1')?.imagen_url_mobile || "");
  const [heroData, setHeroData] = useState<any[]>(initialHeroData || []);

  function getHeroValue(clave: string, field: string, defaultValue: any) {
    const h = heroData.find((h: any) => h.clave === clave);
    if (!h || h[field] === null || h[field] === undefined || h[field] === '') return defaultValue;
    return h[field];
  }

  const slides = [
    {
      isFlyer: true,
      imageDesktop: heroDesktop || '/dia-de-la-madre-horizontal.png',
      imageMobile: heroMobile || '/dia-de-la-madre-vertical.png',
      link: getHeroValue('home_hero_1', 'link_url', '/evento/dia-de-la-madre'),
    },
    {
      isFlyer: false,
      badge: getHeroValue('home_hero_2', 'badge', 'Especial'),
      title: getHeroValue('home_hero_2', 'titulo', 'Haz que su corazón'),
      titleHighlight: getHeroValue('home_hero_2', 'subtitulo', 'lata más fuerte '),
      subtitle: getHeroValue('home_hero_2', 'descripcion', 'Arreglos personalizados, globos y detalles únicos en Pisco.'),
      description: 'Porque cada momento merece ser celebrado.',
      image: getHeroProductImage('home_hero_2') || products.find(p => p?.nombre?.toLowerCase().includes('snoopy'))?.imagen || products.find(p => p?.nombre?.toLowerCase().includes('ramo'))?.imagen || '/logo.png',
      price: getHeroValue('home_hero_2', 'precio', 80),
      link: getHeroValue('home_hero_2', 'link_url', '#catalogo'),
    },
    {
      isFlyer: false,
      badge: getHeroValue('home_hero_3', 'badge', 'Tus Personajes Favoritos'),
      title: getHeroValue('home_hero_3', 'titulo', 'Imagina tu personaje favorito'),
      titleHighlight: getHeroValue('home_hero_3', 'subtitulo', 'tejido a crochet '),
      subtitle: getHeroValue('home_hero_3', 'descripcion', 'Creamos el amigurumi de tus sueños'),
      description: 'Cada puntada lleva dedicación y amor',
      image: getHeroProductImage('home_hero_3') || products.find(p => p?.nombre?.toLowerCase().includes('messi'))?.imagen || products.find(p => p?.nombre?.toLowerCase().includes('goku') || p?.nombre?.toLowerCase().includes('naruto'))?.imagen || '/logo.png',
      price: getHeroValue('home_hero_3', 'precio', 115),
      link: getHeroValue('home_hero_3', 'link_url', '#catalogo'),
    },
    {
      isFlyer: false,
      badge: getHeroValue('home_hero_4', 'badge', 'A Tu Medida'),
      title: getHeroValue('home_hero_4', 'titulo', 'Crea algo especial'),
      titleHighlight: getHeroValue('home_hero_4', 'subtitulo', 'para alguien especial '),
      subtitle: getHeroValue('home_hero_4', 'descripcion', 'Cajas decoradas, tulipanes y diseños únicos hechos para ti'),
      description: 'Convierte tus ideas en realidad con nuestros diseños',
      image: getHeroProductImage('home_hero_4') || products.find(p => p?.nombre?.toLowerCase().includes('cajita') && p?.nombre?.toLowerCase().includes('tulipan'))?.imagen || products.find(p => p?.nombre?.toLowerCase().includes('caja'))?.imagen || '/logo.png',
      price: getHeroValue('home_hero_4', 'precio', 50),
      link: getHeroValue('home_hero_4', 'link_url', '#catalogo'),
    },
  ];

  function getHeroProductImage(clave: string) {
    const h = heroData.find((h: any) => h.clave === clave);
    if (h?.producto_sku) {
      const prod = products.find((p: any) => p.sku === h.producto_sku);
      if (prod) return prod.imagen;
    }
    const fallbackImg = h?.imagen_url;
    return fallbackImg || null;
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
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
                  <div className="relative order-2 lg:order-2">
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

                  <div className="text-center lg:text-left space-y-3 md:space-y-6 order-1 lg:order-1">
                    <div
                      className="hidden lg:inline-flex items-center gap-2 px-4 py-1.5 md:px-5 md:py-2 rounded-full border border-dashed"
                      style={{ backgroundColor: BRAND.roseSoft, color: BRAND.roseDark, borderColor: BRAND.rose }}
                    >
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

// ==================== SECTION RENDERERS ====================

function ContentSection({ section, imagePosition = 'right' }: { section: any; imagePosition?: 'left' | 'right' }) {
  return (
    <section className="py-14 sm:py-20 px-4" style={{ backgroundColor: BRAND.canvas }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {section.imagen_url && imagePosition === 'left' && (
            <div className="relative order-2 lg:order-1">
              <div className="relative p-2 rounded-[2rem] border-2 border-dashed" style={{ borderColor: BRAND.rose + '55' }}>
                <div className="relative h-[280px] sm:h-[360px] md:h-[440px] rounded-[1.5rem] overflow-hidden shadow-lg bg-gray-100">
                  <Image
                    src={section.imagen_url}
                    alt={section.titulo || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          )}
          <div className={`order-1 ${imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1'} text-center lg:text-left ${!section.imagen_url ? 'lg:col-span-2' : ''}`}>
            {section.subtitulo && (
              <span className="font-lato text-xs tracking-[0.2em] uppercase" style={{ color: BRAND.clay }}>
                {section.subtitulo}
              </span>
            )}
            <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-semibold mt-2 mb-4" style={{ color: BRAND.roseDark }}>
              {section.titulo}
            </h2>
            {section.descripcion && (
              <p className="font-lato text-sm sm:text-base md:text-lg leading-relaxed" style={{ color: BRAND.inkSoft }}>
                {section.descripcion}
              </p>
            )}
            {section.link_url && section.link_text && (
              <div className="mt-6 sm:mt-8">
                <Link
                  href={section.link_url}
                  className="inline-block font-lato px-6 sm:px-8 py-3 text-white font-semibold text-sm tracking-wide transition-all duration-300 rounded-full shadow-md hover:shadow-lg hover:-translate-y-1"
                  style={{ backgroundColor: BRAND.rose }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.roseDark)}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.rose)}
                >
                  {section.link_text}
                </Link>
              </div>
            )}
          </div>
          {section.imagen_url && imagePosition === 'right' && (
            <div className="relative order-2 lg:order-2">
              <div className="relative p-2 rounded-[2rem] border-2 border-dashed" style={{ borderColor: BRAND.rose + '55' }}>
                <div className="relative h-[280px] sm:h-[360px] md:h-[440px] rounded-[1.5rem] overflow-hidden shadow-lg bg-gray-100">
                  <Image
                    src={section.imagen_url}
                    alt={section.titulo || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function getSkuCatalogLink(sku: string | null): string {
  if (!sku) return '/catalogo/ramos';
  if (sku.startsWith('Ramos-') || sku.startsWith('Madre-') || sku.startsWith('Flores-')) return '/catalogo/ramos';
  if (sku.startsWith('Amigu-')) return '/catalogo/amigurumis';
  if (sku.startsWith('Caja-')) return '/catalogo/cajas';
  if (sku.startsWith('Cua-') || sku.startsWith('Carr-')) return '/catalogo/hotwheels';
  return '/catalogo/ramos';
}

function ShowcaseSection({ section, products }: { section: any; products?: any[] }) {
  const rawItems = section.items || [];
  const items = rawItems.map((item: any) => {
    if (item.sku && Array.isArray(products)) {
      const prod = products.find((p: any) => p.sku === item.sku);
      if (prod) return { ...item, titulo: prod.nombre, descripcion: prod.descripcion || item.descripcion, imagen: prod.imagen || item.imagen, precio: prod.precio || item.precio };
    }
    return item;
  });
  const firstItemLink = items[0] ? getSkuCatalogLink(items[0].sku) : '/catalogo/ramos';
  return (
    <section className="py-14 sm:py-20 px-4" style={{ backgroundColor: BRAND.canvas }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 sm:mb-14">
          {section.subtitulo && (
            <span className="font-lato text-xs tracking-[0.2em] uppercase" style={{ color: BRAND.clay }}>
              {section.subtitulo}
            </span>
          )}
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-semibold mt-2 mb-3" style={{ color: BRAND.roseDark }}>
            {section.titulo}
          </h2>
          {section.descripcion && (
            <p className="font-lato text-sm sm:text-base max-w-2xl mx-auto" style={{ color: BRAND.inkSoft }}>
              {section.descripcion}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {Array.isArray(items) && items.map((item: any, i: number) => {
            const itemLink = getSkuCatalogLink(item.sku);
            return (
              <Link key={i} href={itemLink}
                className="group block bg-white rounded-2xl overflow-hidden border border-[#EDE4D9] hover:border-[#EE6B8D] transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <div className="relative aspect-[1/1] bg-[#FBF6EF] overflow-hidden">
                  {item.imagen ? (
                    <Image
                      src={item.imagen}
                      alt={item.titulo || ""}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-center p-4">
                        <div className="w-16 h-16 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: BRAND.roseSoft }}>
                          <Sparkles size={24} style={{ color: BRAND.rose }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
                    <h3 className="text-white font-playfair text-sm sm:text-base font-semibold leading-tight">
                      {item.titulo}
                    </h3>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-1">
                      {item.precio && (
                        <p className="text-white/90 font-lato text-xs font-semibold">S/ {item.precio} · Ver colección →</p>
                      )}
                      {!item.precio && (
                        <span className="text-white/90 font-lato text-xs font-semibold">Ver colección →</span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="text-center mt-10 sm:mt-14">
          <Link
            href={firstItemLink || section.link_url || '/catalogo/ramos'}
            className="inline-block font-lato px-8 py-3.5 text-white font-semibold text-sm tracking-wide transition-all duration-300 rounded-full shadow-md hover:shadow-lg hover:-translate-y-1"
            style={{ backgroundColor: BRAND.rose }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = BRAND.roseDark)}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = BRAND.rose)}
          >
            {section.link_text || 'Ver Catálogo'}
          </Link>
        </div>
      </div>
    </section>
  );
}

function FaqSection({ section }: { section: any }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const items = section.items || [];
  const hasImage = !!section.imagen_url;
  const imageRight = hasImage;

  return (
    <section className="py-14 sm:py-20 px-4" style={{ backgroundColor: BRAND.canvas }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-stretch">
          <div className={imageRight ? 'flex flex-col justify-center' : 'lg:col-span-2'}>
            <div className="text-center lg:text-left mb-8 sm:mb-10">
              {section.subtitulo && (
                <span className="font-lato text-xs tracking-[0.2em] uppercase" style={{ color: BRAND.clay }}>
                  {section.subtitulo}
                </span>
              )}
              <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-semibold mt-2 mb-3" style={{ color: BRAND.roseDark }}>
                {section.titulo}
              </h2>
              {section.descripcion && (
                <p className="font-lato text-sm sm:text-base" style={{ color: BRAND.inkSoft }}>
                  {section.descripcion}
                </p>
              )}
            </div>

            <div className="space-y-3">
              {Array.isArray(items) && items.map((item: any, i: number) => {
                const isOpen = openIndex === i;
                return (
                  <div key={i}
                    className="bg-white rounded-xl border border-[#EDE4D9] overflow-hidden transition-all duration-300 hover:border-[#EE6B8D]/30"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="w-full flex items-center justify-between gap-4 p-4 sm:p-5 text-left"
                    >
                      <span className="font-playfair text-sm sm:text-base font-semibold" style={{ color: BRAND.ink }}>
                        {item.pregunta}
                      </span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                        style={{ color: BRAND.rose }}
                      />
                    </button>
                    <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
                        <p className="font-lato text-sm leading-relaxed" style={{ color: BRAND.inkSoft }}>
                          {item.respuesta}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {hasImage && (
            <div className="relative h-full">
              <div className="relative p-2 rounded-[2rem] border-2 border-dashed h-full" style={{ borderColor: BRAND.rose + '55' }}>
                <div className="relative rounded-[1.5rem] overflow-hidden shadow-lg bg-gray-100 min-h-[300px] sm:min-h-[400px] h-full">
                  <Image
                    src={section.imagen_url}
                    alt={section.titulo || ""}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ==================== COMPONENTE PRINCIPAL ====================

export default function HomeClient({ products, sections, heroData }: HomeClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  useEffect(() => {
    import("@/lib/extras-cache").then(({ loadExtras }) => loadExtras(() => {}));
  }, []);

  const aboutSection = sections.find((s: any) => s.section_key === 'about_us');
  const showcaseSection = sections.find((s: any) => s.section_key === 'showcase');
  const customSection = sections.find((s: any) => s.section_key === 'custom_amigurumi');
  const faqSection = sections.find((s: any) => s.section_key === 'faq');

  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.canvas }}>
      {selectedProduct && (
        <QuickViewDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <HeroCarousel products={products} heroData={heroData} />

      {showcaseSection && <ShowcaseSection section={showcaseSection} products={products} />}

      {/* Por qué elegirnos */}
      <section className="py-14 sm:py-20 px-4" style={{ backgroundColor: BRAND.canvas }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <span className="font-lato text-xs tracking-[0.2em] uppercase" style={{ color: BRAND.clay }}>
              Nuestro trabajo
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

      {aboutSection && <ContentSection section={aboutSection} imagePosition="right" />}

      {customSection && <ContentSection section={customSection} imagePosition="left" />}

      {faqSection && <FaqSection section={faqSection} />}
    </div>
  );
}
