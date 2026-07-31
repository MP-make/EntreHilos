import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles, Package, Truck, MessageCircle } from "lucide-react";

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
  line: '#EDE4D9',
};

const values = [
  { icon: Heart, label: 'Hecho con Amor', desc: 'Cada puntada refleja nuestra pasión por el arte del tejido a mano', color: BRAND.rose },
  { icon: Package, label: 'Calidad Premium', desc: 'Solo hilos de algodón de la más alta calidad', color: BRAND.moss },
  { icon: Sparkles, label: 'Diseños Únicos', desc: 'Creaciones originales adaptadas a ti', color: BRAND.gold },
  { icon: Truck, label: 'Envío Seguro', desc: 'Empaque especial para que llegue perfecto', color: BRAND.clay },
];

export default function NosotrosPage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: BRAND.canvas }}>
      {/* ===== HERO ===== */}
      <section className="relative bg-gradient-to-br from-[#FDE8EF] via-white to-[#FDE8EF] py-20 px-4 border-b border-[#FDE8EF] overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-[#EE6B8D] rounded-full mix-blend-multiply filter blur-[80px] opacity-20 transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-[#C04267] rounded-full mix-blend-multiply filter blur-[80px] opacity-10 transform translate-x-1/3 translate-y-1/3"></div>
        <div className="relative max-w-4xl mx-auto text-center z-10">
          <span className="font-lato text-xs sm:text-sm tracking-[0.2em] uppercase mb-4 block" style={{ color: BRAND.clay }}>
            Entre Hilos
          </span>
          <h1 className="font-playfair text-4xl sm:text-5xl md:text-6xl font-bold mb-4 sm:mb-6" style={{ color: BRAND.roseDark }}>
            Sobre Nosotros
          </h1>
          <p className="font-lato text-base sm:text-lg md:text-xl font-light max-w-2xl mx-auto" style={{ color: BRAND.inkSoft }}>
            Tejiendo sueños con hilo y amor desde Pisco, Perú
          </p>
        </div>
      </section>

      {/* ===== NUESTRA HISTORIA ===== */}
      <section className="max-w-6xl mx-auto px-4 py-16 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-14 items-center">
          <div className="order-1 lg:order-1">
            <span className="font-lato text-xs tracking-[0.2em] uppercase mb-3 block" style={{ color: BRAND.clay }}>
              Nuestra Historia
            </span>
            <h2 className="font-playfair text-3xl sm:text-4xl font-semibold mb-6" style={{ color: BRAND.ink }}>
              Donde Cada Puntada{' '}
              <span className="italic" style={{ color: BRAND.rose }}>Cuenta una Historia</span>
            </h2>
            <div className="space-y-4">
              <p className="font-lato text-sm sm:text-base leading-relaxed" style={{ color: BRAND.ink }}>
                Entre Hilos nació de la pasión por el arte del crochet y el deseo de crear momentos inolvidables. 
                Cada pieza que tejemos lleva consigo horas de dedicación, amor y un compromiso inquebrantable con la calidad.
              </p>
              <p className="font-lato text-sm sm:text-base leading-relaxed" style={{ color: BRAND.inkSoft }}>
                Desde ramos eternos que nunca se marchitan hasta amigurumis personalizados que capturan la esencia 
                de tus personajes favoritos, nos especializamos en transformar hilos de algodón premium en obras de arte únicas.
              </p>
              <p className="font-lato text-sm sm:text-base leading-relaxed" style={{ color: BRAND.inkSoft }}>
                Ubicados en Pisco, atendemos con dedicación cada pedido, ofreciendo envíos seguros y entregas el mismo día 
                para que tus celebraciones sean aún más especiales.
              </p>
            </div>
          </div>
          <div className="order-2 lg:order-2">
            <div className="relative p-3 rounded-[2rem] border-2 border-dashed" style={{ borderColor: BRAND.rose + '55' }}>
              <div className="relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg" style={{ backgroundColor: '#F3EFE9' }}>
                <Image
                  src="/logo.png"
                  alt="Entre Hilos - Crochet Artesanal"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== VALORES ===== */}
      <section className="py-16 sm:py-20" style={{ backgroundColor: 'white' }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12 sm:mb-16">
            <span className="font-lato text-xs tracking-[0.2em] uppercase mb-4 block" style={{ color: BRAND.clay }}>
              Nuestra Esencia
            </span>
            <div className="hidden md:flex items-center gap-4 justify-center">
              <div className="flex-1 h-0 border-t-2 border-dashed max-w-[120px]" style={{ borderColor: BRAND.rose + '50' }} />
              <h2 className="font-playfair text-3xl sm:text-4xl font-semibold shrink-0 px-2" style={{ color: BRAND.roseDark }}>
                Lo Que Nos Define
              </h2>
              <div className="flex-1 h-0 border-t-2 border-dashed max-w-[120px]" style={{ borderColor: BRAND.rose + '50' }} />
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-semibold md:hidden" style={{ color: BRAND.roseDark }}>
              Lo Que Nos Define
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {values.map((item) => (
              <div key={item.label} className="text-center">
                <div
                  className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-transform hover:scale-110 duration-300 shadow-sm border-2 border-dashed bg-white"
                  style={{ borderColor: item.color + '60' }}
                >
                  <item.icon size={32} className="sm:w-10 sm:h-10" style={{ color: item.color }} />
                </div>
                <h3 className="font-playfair text-lg sm:text-xl font-semibold mb-2" style={{ color: BRAND.ink }}>
                  {item.label}
                </h3>
                <p className="font-lato text-xs sm:text-sm leading-relaxed" style={{ color: BRAND.inkSoft }}>
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LO QUE OFRECEMOS ===== */}
      <section className="py-16 sm:py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="font-lato text-xs tracking-[0.2em] uppercase mb-4 block" style={{ color: BRAND.clay }}>
              Catálogo
            </span>
            <div className="hidden md:flex items-center gap-4 justify-center">
              <div className="flex-1 h-0 border-t-2 border-dashed max-w-[120px]" style={{ borderColor: BRAND.rose + '50' }} />
              <h2 className="font-playfair text-3xl sm:text-4xl font-semibold shrink-0 px-2" style={{ color: BRAND.roseDark }}>
                Lo Que Ofrecemos
              </h2>
              <div className="flex-1 h-0 border-t-2 border-dashed max-w-[120px]" style={{ borderColor: BRAND.rose + '50' }} />
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-semibold md:hidden" style={{ color: BRAND.roseDark }}>
              Lo Que Ofrecemos
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div
              className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-2 border-dashed"
              style={{ backgroundColor: 'white', borderColor: BRAND.rose + '40' }}
            >
              <div className="h-2" style={{ backgroundColor: BRAND.rose }} />
              <div className="p-6 sm:p-8">
                <h3 className="font-playfair text-xl sm:text-2xl font-semibold mb-4" style={{ color: BRAND.ink }}>
                  Ramos Eternos
                </h3>
                <p className="font-lato text-sm sm:text-base leading-relaxed" style={{ color: BRAND.inkSoft }}>
                  Flores que nunca se marchitan, ideales para celebraciones de San Valentín, Día de la Madre 
                  y ocasiones especiales que merecen ser recordadas para siempre.
                </p>
              </div>
            </div>

            <div
              className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-2 border-dashed"
              style={{ backgroundColor: 'white', borderColor: BRAND.clay + '40' }}
            >
              <div className="h-2" style={{ backgroundColor: BRAND.clay }} />
              <div className="p-6 sm:p-8">
                <h3 className="font-playfair text-xl sm:text-2xl font-semibold mb-4" style={{ color: BRAND.ink }}>
                  Amigurumis Personalizados
                </h3>
                <p className="font-lato text-sm sm:text-base leading-relaxed" style={{ color: BRAND.inkSoft }}>
                  Tus personajes favoritos de anime, películas y series cobran vida en versiones tejidas 
                  a mano con detalles impecables y colores vibrantes.
                </p>
              </div>
            </div>

            <div
              className="rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-2 border-dashed"
              style={{ backgroundColor: 'white', borderColor: BRAND.gold + '40' }}
            >
              <div className="h-2" style={{ backgroundColor: BRAND.gold }} />
              <div className="p-6 sm:p-8">
                <h3 className="font-playfair text-xl sm:text-2xl font-semibold mb-4" style={{ color: BRAND.ink }}>
                  Decoraciones HotWheels
                </h3>
                <p className="font-lato text-sm sm:text-base leading-relaxed" style={{ color: BRAND.inkSoft }}>
                  Cuadros iluminados y decoraciones temáticas para los pequeños amantes de los autos. 
                  Perfectos para cumpleaños y habitaciones infantiles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="py-16 sm:py-20 px-4 border-t-2 border-dashed" style={{ borderColor: BRAND.line }}>
        <div className="max-w-4xl mx-auto text-center">
          <span className="font-lato text-xs tracking-[0.2em] uppercase mb-3 block" style={{ color: BRAND.clay }}>
            Contacto
          </span>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold mb-4" style={{ color: BRAND.roseDark }}>
            Listo para crear algo especial?
          </h2>
          <p className="font-lato text-base sm:text-lg mb-8 font-light max-w-xl mx-auto" style={{ color: BRAND.inkSoft }}>
            Contáctanos y hagamos realidad el regalo perfecto tejido con amor
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="font-lato px-8 py-3.5 font-semibold text-sm tracking-wide rounded-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              style={{ backgroundColor: '#EE6B8D', color: 'white' }}
            >
              Ver Colección
            </Link>
            <a
              href="https://wa.me/51902578295"
              target="_blank"
              rel="noopener noreferrer"
              className="font-lato px-8 py-3.5 border-2 border-dashed font-semibold text-sm tracking-wide rounded-full transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 hover:bg-[#F3E1E6]"
              style={{ borderColor: '#EE6B8D', color: '#C04267', backgroundColor: 'transparent' }}
            >
              <MessageCircle size={16} />
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
