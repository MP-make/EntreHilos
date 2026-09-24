"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Maximize2, X } from "lucide-react";

export interface RotondaItem {
  imagen: string;
  etiqueta?: string;
  titulo?: string;
  descripcion?: string;
}

export interface CampanaRotondaSectionProps {
  section?: any;
  eventoActual?: any;
}

const DEFAULT_FALLBACK_ITEMS: RotondaItem[] = [
  {
    imagen: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=800&q=80",
    etiqueta: "Flores Amarillas",
    titulo: "Ramos con alegría",
    descripcion: "Ramos eternos tejidos a mano entregados con dedicatorias especiales.",
  },
  {
    imagen: "/dia-de-la-madre-horizontal.png",
    etiqueta: "Día de la Madre",
    titulo: "Sonrisas para Mamá",
    descripcion: "Cajas decoradas, tulipanes y rosas eternas celebrando con amor.",
  },
  {
    imagen: "/Dia-de-la-mujer-8M.png",
    etiqueta: "Día de la Mujer",
    titulo: "Detalles que inspiran",
    descripcion: "Detalles artesanales entregados en colegios, hogares y empresas.",
  },
  {
    imagen: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=800&q=80",
    etiqueta: "San Valentín",
    titulo: "Historias tejidas",
    descripcion: "Arreglos románticos personalizados que hicieron latir corazones.",
  },
];

export default function CampanaRotondaSection({ section, eventoActual }: CampanaRotondaSectionProps) {
  if (section && section.activo === false) return null;

  // 1. Obtener fotos del evento actual o más reciente (fotos_campana)
  let itemsFromEvento: RotondaItem[] = [];
  if (eventoActual?.fotos_campana && Array.isArray(eventoActual.fotos_campana) && eventoActual.fotos_campana.length > 0) {
    itemsFromEvento = eventoActual.fotos_campana
      .map((f: any, idx: number) => {
        if (typeof f === "string") {
          return {
            imagen: f,
            etiqueta: eventoActual.nombre || "Campaña",
            titulo: `Momento especial ${idx + 1}`,
            descripcion: `Entrega real de la campaña ${eventoActual.nombre || ""}`,
          };
        }
        return {
          imagen: f.url || f.imagen || "",
          etiqueta: f.etiqueta || eventoActual.nombre || "Campaña",
          titulo: f.titulo || `Entrega especial ${idx + 1}`,
          descripcion: f.descripcion || `Fotos de clientes en la campaña ${eventoActual.nombre || ""}`,
        };
      })
      .filter((i: RotondaItem) => Boolean(i.imagen));
  }

  // 2. Si no hay fotos en el evento, verificar si la sección tiene items configurados
  let itemsFromSection: RotondaItem[] = [];
  if (section?.items && Array.isArray(section.items) && section.items.length > 0) {
    itemsFromSection = section.items.filter((i: any) => Boolean(i.imagen));
  }

  // 3. Combinar con defaults para tener al menos 4 tarjetas
  const baseItems = itemsFromEvento.length > 0
    ? itemsFromEvento
    : itemsFromSection.length > 0
    ? itemsFromSection
    : DEFAULT_FALLBACK_ITEMS;

  const items: RotondaItem[] = baseItems.length >= 4
    ? baseItems
    : [...baseItems, ...DEFAULT_FALLBACK_ITEMS].slice(0, 4);

  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [lightboxImg, setLightboxImg] = useState<{ src: string; title?: string; tag?: string } | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  const total = items.length;

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Rotación automática suave cada 5.5s cuando no está en hover
  useEffect(() => {
    if (isHovered || lightboxImg) return;
    const timer = setInterval(nextSlide, 5500);
    return () => clearInterval(timer);
  }, [isHovered, lightboxImg, nextSlide]);

  // Cerrar lightbox con tecla Escape
  useEffect(() => {
    if (!lightboxImg) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxImg(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImg]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
  };

  const handleTouchEnd = () => {
    if (Math.abs(touchDeltaX.current) > 40) {
      if (touchDeltaX.current > 0) prevSlide();
      else nextSlide();
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  // Títulos dinámicos con mismo tamaño y estilo que las demás secciones
  const titulo = eventoActual?.nombre 
    ? `Así se vivió ${eventoActual.nombre}`
    : section?.titulo || "Así se vivieron nuestras campañas";

  const subtitulo = eventoActual?.nombre 
    ? `Momentos · ${eventoActual.nombre}`
    : section?.subtitulo || "Entregas Reales";

  const descripcion = section?.descripcion || (eventoActual?.nombre
    ? `Fotos reales de nuestros clientes y cómo se entregó cada detalle en la campaña de ${eventoActual.nombre}.`
    : "Fotos de clientes y pedidos que llevaron felicidad en nuestras fechas más especiales.");

  return (
    <section 
      className="py-14 sm:py-20 px-2 sm:px-6 xl:px-10 overflow-hidden relative w-full"
      style={{ backgroundColor: "#FBF6EF" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="w-full max-w-[96rem] mx-auto">
        {/* Cabecera con tipografía y proporciones idénticas al resto del inicio */}
        <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 px-4">
          <span className="font-lato text-xs tracking-[0.2em] uppercase font-bold" style={{ color: "#C97B4A" }}>
            {subtitulo}
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-semibold mt-2 mb-3" style={{ color: "#C04267" }}>
            {titulo}
          </h2>
          {descripcion && (
            <p className="font-lato text-sm sm:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
              {descripcion}
            </p>
          )}
        </div>

        {/* Carrusel Rotonda 3D: Más alto que ancho, 4 visibles en desktop (2 en medio resaltados) y 3 en celular */}
        <div 
          className="relative w-full mx-auto h-[390px] sm:h-[440px] md:h-[490px] lg:h-[550px] flex items-center justify-center select-none"
          style={{ perspective: "1300px" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {items.map((item, idx) => {
            const diff = (idx - activeIndex + total) % total;

            let transform = "";
            let zIndex = 10;
            let opacity = 0;
            let pointerEvents: "auto" | "none" = "none";
            let isHighlight = false;

            if (isMobile) {
              // MODO CELULAR: DE 3 EN 3 (1 CENTRO RESALTADO, 2 LATERALES)
              if (diff === 0) {
                // CENTRO
                transform = "translate3d(0, 0, 0px) scale(1) rotateY(0deg)";
                zIndex = 30;
                opacity = 1;
                pointerEvents = "auto";
                isHighlight = true;
              } else if (diff === 1) {
                // LATERAL DERECHO
                transform = "translate3d(62%, 0, -100px) scale(0.85) rotateY(-20deg)";
                zIndex = 20;
                opacity = 0.88;
                pointerEvents = "auto";
              } else if (diff === total - 1) {
                // LATERAL IZQUIERDO
                transform = "translate3d(-62%, 0, -100px) scale(0.85) rotateY(20deg)";
                zIndex = 20;
                opacity = 0.88;
                pointerEvents = "auto";
              } else {
                transform = "translate3d(0, 0, -220px) scale(0.65) rotateY(0deg)";
                zIndex = 10;
                opacity = 0;
                pointerEvents = "none";
              }
            } else {
              // MODO DESKTOP: DE 4 EN 4 (2 EN EL MEDIO RESALTADAS, 2 LATERALES)
              if (diff === 0) {
                // MEDIO IZQUIERDO (RESALTADA)
                transform = "translate3d(-54%, 0, 0px) scale(1.02) rotateY(4deg)";
                zIndex = 30;
                opacity = 1;
                pointerEvents = "auto";
                isHighlight = true;
              } else if (diff === 1) {
                // MEDIO DERECHO (RESALTADA)
                transform = "translate3d(54%, 0, 0px) scale(1.02) rotateY(-4deg)";
                zIndex = 30;
                opacity = 1;
                pointerEvents = "auto";
                isHighlight = true;
              } else if (diff === 2) {
                // LATERAL DERECHO (EFECTO CURVO 3D)
                transform = "translate3d(158%, 0, -110px) scale(0.85) rotateY(-22deg)";
                zIndex = 20;
                opacity = 0.92;
                pointerEvents = "auto";
              } else if (diff === total - 1) {
                // LATERAL IZQUIERDO (EFECTO CURVO 3D)
                transform = "translate3d(-158%, 0, -110px) scale(0.85) rotateY(22deg)";
                zIndex = 20;
                opacity = 0.92;
                pointerEvents = "auto";
              } else {
                // RESTO OCULTO ATRÁS
                transform = "translate3d(0, 0, -260px) scale(0.65) rotateY(0deg)";
                zIndex = 10;
                opacity = 0;
                pointerEvents = "none";
              }
            }

            return (
              <div
                key={idx}
                onClick={() => {
                  if (isMobile) {
                    if (diff === 1) nextSlide();
                    else if (diff === total - 1) prevSlide();
                    else if (diff === 0) {
                      setLightboxImg({ src: item.imagen, title: item.titulo, tag: item.etiqueta });
                    }
                  } else {
                    if (diff === 2) nextSlide();
                    else if (diff === total - 1) prevSlide();
                    else if (diff === 0 || diff === 1) {
                      setLightboxImg({ src: item.imagen, title: item.titulo, tag: item.etiqueta });
                    }
                  }
                }}
                className={`absolute w-[230px] sm:w-[260px] md:w-[280px] lg:w-[310px] xl:w-[330px] h-[340px] sm:h-[380px] md:h-[420px] lg:h-[470px] xl:h-[500px] rounded-3xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-xl ${
                  isHighlight
                    ? "ring-2 sm:ring-4 ring-[#EE6B8D]/35 shadow-[0_20px_50px_-10px_rgba(238,107,141,0.32)]"
                    : "hover:opacity-95"
                }`}
                style={{
                  transform,
                  zIndex,
                  opacity,
                  pointerEvents,
                  transformStyle: "preserve-3d",
                }}
              >
                {/* Imagen del momento (formato vertical/retrato) */}
                <img
                  src={item.imagen}
                  alt={item.titulo || item.etiqueta || "Campaña"}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/logo.png";
                  }}
                />

                {/* Gradiente suave sólo en la base para no oscurecer la foto */}
                <div className="absolute bottom-0 inset-x-0 h-32 sm:h-40 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />

                {/* Badge superior de Campaña */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#C04267] font-lato font-bold text-[11px] shadow-sm">
                    <Sparkles size={11} className="text-[#EE6B8D]" />
                    {item.etiqueta || eventoActual?.nombre || "Campaña"}
                  </span>

                  {isHighlight && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLightboxImg({ src: item.imagen, title: item.titulo, tag: item.etiqueta });
                      }}
                      className="pointer-events-auto p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md transition-all shadow-md"
                      title="Ver foto completa"
                    >
                      <Maximize2 size={13} />
                    </button>
                  )}
                </div>

                {/* Textos de la entrega (sin duplicar etiqueta si coincide) */}
                {(item.descripcion || (item.titulo && item.titulo.trim().toLowerCase() !== (item.etiqueta || "").trim().toLowerCase())) && (
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white pointer-events-none">
                    {item.titulo && item.titulo.trim().toLowerCase() !== (item.etiqueta || "").trim().toLowerCase() && (
                      <h3 className="font-playfair text-base sm:text-lg font-bold leading-tight mb-1 text-white drop-shadow-md">
                        {item.titulo}
                      </h3>
                    )}
                    {item.descripcion && (
                      <p className="font-lato text-xs sm:text-sm text-white/95 line-clamp-2 leading-relaxed drop-shadow-sm">
                        {item.descripcion}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Flechas de navegación laterales */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Anterior foto"
            className="absolute left-1 sm:left-3 lg:left-6 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-[#C04267] hover:text-[#EE6B8D] flex items-center justify-center shadow-lg hover:shadow-xl transition-all border border-pink-100 backdrop-blur-sm hover:scale-105"
          >
            <ChevronLeft size={22} />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Siguiente foto"
            className="absolute right-1 sm:right-3 lg:right-6 z-40 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/95 hover:bg-white text-[#C04267] hover:text-[#EE6B8D] flex items-center justify-center shadow-lg hover:shadow-xl transition-all border border-pink-100 backdrop-blur-sm hover:scale-105"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Indicadores inferiores */}
        <div className="flex items-center justify-center gap-2 mt-7">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActiveIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? "w-8 bg-[#EE6B8D]"
                  : "w-2.5 bg-pink-200 hover:bg-pink-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Lightbox / Modal de visualización completa */}
      {lightboxImg && (
        <div 
          className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={() => setLightboxImg(null)}
        >
          {/* Botón flotante para cerrar */}
          <button
            onClick={() => setLightboxImg(null)}
            aria-label="Cerrar foto"
            className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 sm:p-3 rounded-full bg-white/15 hover:bg-white/30 active:scale-95 text-white backdrop-blur-md transition-all shadow-lg hover:ring-2 hover:ring-white/40"
          >
            <X size={22} />
          </button>

          {/* Contenedor central natural de la imagen (sin marco blanco ni barras negras) */}
          <div 
            className="relative flex items-center justify-center max-h-[82vh] max-w-[92vw] sm:max-w-[85vw]"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxImg.src}
              alt={lightboxImg.title || lightboxImg.tag || "Foto de campaña"}
              className="max-h-[82vh] max-w-[92vw] sm:max-w-[85vw] w-auto h-auto object-contain rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] border border-white/10"
            />
          </div>

          {/* Pie de foto flotante minimalista */}
          {(lightboxImg.title || lightboxImg.tag) && (
            <div 
              className="mt-4 flex items-center justify-center pointer-events-none px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 py-2 rounded-full bg-black/65 backdrop-blur-md border border-white/15 text-center text-white shadow-xl flex items-center gap-2">
                {lightboxImg.tag && (
                  <span className="font-lato text-xs sm:text-sm font-bold text-[#FF8FAB]">
                    {lightboxImg.tag}
                  </span>
                )}
                {lightboxImg.title && lightboxImg.title.trim().toLowerCase() !== (lightboxImg.tag || "").trim().toLowerCase() && (
                  <>
                    <span className="text-white/40 text-xs">•</span>
                    <span className="font-lato text-xs sm:text-sm text-white/90">
                      {lightboxImg.title}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
