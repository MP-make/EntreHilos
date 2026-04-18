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

  // Datos de los slides
  const slides = [
    {
      isFlyer: true, // Indica que es una imagen de ancho completo
      // ACTUALIZADO: Rutas exactas de tus imágenes png
      imageDesktop: '/dia-de-la-madre-horizontal.png', 
      imageMobile: '/dia-de-la-madre-vertical.png',
      link: '/category/dia-de-la-madre',
      bgColor: 'bg-[#FDE8EF]', // Color de fondo base mientras carga la imagen
    },
    {
      isFlyer: false,
      badge: 'Especial',
      title: 'Haz que su corazón',
      titleHighlight: 'lata más fuerte ❤️',
      subtitle: 'Arreglos personalizados, globos y detalles únicos en Pisco.',
      description: 'Porque cada momento merece ser celebrado.',
      image: products.find(p => p?.nombre?.toLowerCase().includes('snoopy'))?.imagen || products.find(p => p?.nombre?.toLowerCase().includes('ramo'))?.imagen || '/logo.png',
      bgColor: 'bg-gradient-to-br from-pink-50 via-white to-orange-50',
      price: 80,
      link: '#catalogo',
    },
    {
      isFlyer: false,
      badge: 'Tus Personajes Favoritos',
      title: 'Imagina tu personaje favorito',
      titleHighlight: 'tejido a crochet ✨',
      subtitle: 'Creamos el amigurumi de tus sueños',
      description: 'Cada puntada lleva dedicación y amor',
      image: products.find(p => p?.nombre?.toLowerCase().includes('messi'))?.imagen || products.find(p => p?.nombre?.toLowerCase().includes('goku') || p?.nombre?.toLowerCase().includes('naruto'))?.imagen || '/logo.png',
      bgColor: 'bg-gradient-to-br from-pink-50 via-white to-blue-50',
      price: 115,
      link: '#catalogo',
    },
    {
      isFlyer: false,
      badge: 'A Tu Medida',
      title: 'Crea algo especial',
      titleHighlight: 'para alguien especial 💝',
      subtitle: 'Cajas decoradas, tulipanes y diseños únicos hechos para ti',
      description: 'Convierte tus ideas en realidad con nuestros diseños',
      // Busca específicamente la cajita tulipan
      image: products.find(p => p?.nombre?.toLowerCase().includes('cajita') && p?.nombre?.toLowerCase().includes('tulipan'))?.imagen || products.find(p => p?.nombre?.toLowerCase().includes('caja'))?.imagen || '/logo.png',
      bgColor: 'bg-gradient-to-br from-amber-50 via-white to-pink-50',
      price: 50,
      link: '#catalogo',
    },
  ];

  // Auto-avanzar cada 6 segundos
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
            currentSlide === index ? 'opacity-100 z-10' : 'opacity-0 absolute inset-0 z-0'
          }`}
        >
          {/* Contenedor principal con altura mínima responsiva */}
          <div className={`${slide.bgColor} min-h-[500px] md:min-h-[600px] relative`}>
            
            {/* LÓGICA CONDICIONAL: Si es Flyer completo o si es Slide con textos */}
            {slide.isFlyer ? (
              <Link href={slide.link} className="absolute inset-0 w-full h-full block group overflow-hidden">
                
                {/* 🖥️ Imagen DESKTOP: hidden en móvil, block en lg+ */}
                <Image
                  src={slide.imageDesktop || '/logo.png'}
                  alt="Promoción Especial Entre Hilos"
                  fill
                  className="object-cover object-center hidden lg:block group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority={index === 0}
                  sizes="100vw"
                />

                {/* 📱 Imagen MOBILE: block por defecto, hidden en lg+ */}
                <Image
                  src={slide.imageMobile || '/logo.png'}
                  alt="Promoción Especial Entre Hilos Móvil"
                  fill
                  className="object-cover object-center block lg:hidden group-hover:scale-105 transition-transform duration-700 ease-out"
                  priority={index === 0}
                  sizes="100vw"
                />

                {/* Overlay sutil al hacer hover para indicar cloqueo */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
              </Link>
            ) : (
              // ... El resto del código de slides normales NO CAMBIA ...
              <div className="max-w-7xl mx-auto px-4 py-12 md:py-16 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Columna Izquierda: Contenido */}
                  <div className="text-center lg:text-left space-y-6 order-2 lg:order-1">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full border border-orange-200">
                      <span className="text-base">
                        {index === 1 ? '💝' : index === 2 ? '🧸' : '🖼️'}
                      </span>
                      <span className="font-lato text-sm font-semibold">{slide.badge}</span>
                    </div>

                    {/* Título Principal */}
                    <div>
                      <h1 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-normal text-gray-900 mb-2 leading-tight">
                        {slide.title}
                      </h1>
                      <h2 className="font-playfair text-4xl md:text-5xl lg:text-6xl font-normal text-[#C04267] leading-tight">
                        {slide.titleHighlight}
                      </h2>
                    </div>

                    {/* Subtítulo */}
                    <p className="font-lato text-base md:text-lg text-gray-700 leading-relaxed">
                      {slide.subtitle}
                    </p>
                    <p className="font-lato text-sm text-gray-500 italic">
                      {slide.description}
                    </p>

                    {/* Botones */}
                    <div className="flex flex-col sm:flex-row gap-4 pt-4">
                      <Link
                        href={slide.link}
                        className="font-lato px-8 py-4 bg-[#EE6B8D] text-white font-semibold text-sm tracking-wide transition-all duration-300 rounded-full hover:bg-[#C04267] shadow-lg hover:shadow-xl hover:-translate-y-1 text-center"
                      >
                        Ver Colección
                      </Link>
                      <button 
                        onClick={() => window.open('https://wa.me/51927005798', '_blank')}
                        className="font-lato px-8 py-4 border-2 border-[#C04267] text-[#C04267] font-semibold text-sm tracking-wide transition-all duration-300 rounded-full hover:bg-[#C04267] hover:text-white flex items-center justify-center gap-2"
                      >
                        <MessageCircle size={18} />
                        Contactar al WhatsApp
                      </button>
                    </div>
                  </div>

                  {/* Columna Derecha: Imagen con Badge de Precio */}
                  <div className="relative order-1 lg:order-2">
                    <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl bg-gray-100">
                      <Image
                        src={slide.image || '/logo.png'}
                        alt={slide.title || "Producto"}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>
                    {/* Badge de Precio Flotante */}
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-[#FCD34D] rounded-full shadow-2xl flex flex-col items-center justify-center z-10 border-4 border-white">
                      <p className="font-lato text-xs font-light text-gray-700">A solo</p>
                      <p className="font-playfair text-2xl font-bold text-gray-900 leading-none">S/ {slide.price}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Puntos de navegación */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all duration-300 rounded-full shadow-sm ${
              currentSlide === index 
                ? 'bg-[#EE6B8D] w-10 h-3' 
                : 'bg-white/80 w-3 h-3 hover:bg-white border border-gray-300'
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
    'Personalizados': 'bg-[#EE6B8D]/10 text-[#C04267] border-[#EE6B8D]/30', 
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

  const enrichedProducts = products.map(product => ({
    ...product,
    categoryBySku: getCategoryBySku(product.sku),
  }));

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

  const ProductCard = ({ producto }: { producto: typeof enrichedProducts[0] }) => {
    const { addToCart } = useCart();
    
    const isAmigurumiOrCaja = producto.sku.startsWith('Amigu-') || producto.sku.startsWith('Caja-');
    
    const stockLabel = producto.stock === 0 
      ? (isAmigurumiOrCaja ? 'A pedido' : 'Agotado')
      : producto.stock <= 5 
        ? 'Últimas unidades' 
        : `${producto.stock} disponibles`;
    
    const stockColor = producto.stock === 0 
      ? (isAmigurumiOrCaja ? 'text-[#EE6B8D]' : 'text-red-600')
      : producto.stock <= 5 
        ? 'text-orange-600' 
        : 'text-gray-600';

    const handleAddToCart = () => {
      if (producto.stock === 0 && isAmigurumiOrCaja) {
        const productoData = encodeURIComponent(JSON.stringify({
          id: producto.id,
          nombre: producto.nombre,
          precio: producto.precio,
          imagen: producto.imagen, 
          sku: producto.sku
        }));
        const url = `/pedido-personalizado?producto=${productoData}`;
        window.location.href = url;
        return;
      }
      
      if (producto.stock === 0 && !isAmigurumiOrCaja) return;
      
      addToCart(producto);
      alert('¡Agregado al carrito! 💖');
    };

    return (
      <div className="group">
        <Link href={`/product/${slugify(producto.nombre)}`} className="block">
          <div className="relative aspect-square bg-white mb-4 overflow-hidden rounded-lg shadow-sm border border-gray-100 hover:border-[#EE6B8D] transition-all duration-300">
            <Image
              src={producto.imagen}
              alt={producto.nombre}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
              <div className="absolute top-3 right-3 px-2 py-1 bg-[#EE6B8D] text-white text-xs font-lato font-bold rounded">
                A pedido
              </div>
            )}
          </div>

          <div className="text-center">
            <h3 className="font-playfair text-lg text-[#4A4A4A] mb-2 group-hover:text-[#C04267] transition-colors duration-300 line-clamp-2 min-h-[3.5rem]">
              {producto.nombre}
            </h3>

            <p className="font-lato text-sm text-[#6B6B6B] font-light mb-4 line-clamp-2 min-h-[2.5rem]">
              {getAutoDescription(producto.categoryBySku, producto.descripcion)}
            </p>

            <div className="mb-4">
              <span className="font-playfair text-2xl font-medium text-[#EE6B8D]">
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
              : 'bg-[#EE6B8D] text-white hover:bg-[#C04267] shadow-sm hover:shadow-md'
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
      <HeroCarousel products={enrichedProducts} />

      <section id="catalogo" className="bg-[#FDF4F7] py-8 px-4 sticky top-[120px] sm:top-[130px] z-40 mt-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap justify-center gap-8">
            {(['Ramos', 'Amigurumis', 'Cajas', 'HotWheels', 'Ver Todo'] as TabType[]).map((tab) => {
              const isActive = activeTab === tab;
              
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`font-lato text-base tracking-wide transition-all duration-300 pb-2 relative ${
                    isActive
                      ? 'text-[#C04267] font-semibold'
                      : 'text-[#6B6B6B] hover:text-[#C04267] font-normal'
                  }`}
                >
                  {tab}
                  
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#EE6B8D]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

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
              <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#C04267] mb-3">
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

      <section className="bg-white py-16 px-4 border-t border-gray-200">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#C04267] text-center mb-12">
            Por qué elegir Entre Hilos
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#EE6B8D]/10 rounded-full flex items-center justify-center">
                <Sparkles size={32} className="text-[#EE6B8D]" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-[#C04267] mb-2">
                Calidad Premium
              </h3>
              <p className="font-lato text-sm text-[#6B6B6B] font-light leading-relaxed">
                Hilos de algodón de la más alta calidad
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#EE6B8D]/10 rounded-full flex items-center justify-center">
                <Heart size={32} className="text-[#EE6B8D]" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-[#C04267] mb-2">
                Hecho a Mano
              </h3>
              <p className="font-lato text-sm text-[#6B6B6B] font-light leading-relaxed">
                Cada pieza tejida con dedicación
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#EE6B8D]/10 rounded-full flex items-center justify-center">
                <Package size={32} className="text-[#EE6B8D]" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-[#C04267] mb-2">
                Personalizable
              </h3>
              <p className="font-lato text-sm text-[#6B6B6B] font-light leading-relaxed">
                Diseños adaptados a tus necesidades
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#EE6B8D]/10 rounded-full flex items-center justify-center">
                <Truck size={32} className="text-[#EE6B8D]" />
              </div>
              <h3 className="font-playfair text-lg font-semibold text-[#C04267] mb-2">
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