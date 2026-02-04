import Image from "next/image";
import Link from "next/link";
import { Heart, Sparkles, Users, Award } from "lucide-react";

export default function NosotrosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF4F7] to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#5E548E] to-[#9F86C0] text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">
            Sobre Nosotros
          </h1>
          <p className="font-lato text-base sm:text-lg md:text-xl font-light leading-relaxed">
            Tejiendo sueños con hilo y amor desde Pisco, Perú
          </p>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="font-playfair text-3xl sm:text-4xl font-semibold text-[#5E548E] mb-4 sm:mb-6">
              Nuestra Historia
            </h2>
            <p className="font-lato text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              Entre Hilos nació de la pasión por el arte del crochet y el deseo de crear momentos inolvidables. 
              Cada pieza que tejemos lleva consigo horas de dedicación, amor y un compromiso inquebrantable con la calidad.
            </p>
            <p className="font-lato text-sm sm:text-base text-gray-700 leading-relaxed mb-4">
              Desde ramos eternos que nunca se marchitan hasta amigurumis personalizados que capturan la esencia 
              de tus personajes favoritos, nos especializamos en transformar hilos de algodón premium en obras de arte únicas.
            </p>
            <p className="font-lato text-sm sm:text-base text-gray-700 leading-relaxed">
              Ubicados en Pisco, atendemos con dedicación cada pedido, ofreciendo envíos seguros y entregas el mismo día 
              para que tus celebraciones sean aún más especiales.
            </p>
          </div>
          <div className="order-1 lg:order-2 relative h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden shadow-2xl">
            <Image 
              src="/logo.jpg" 
              alt="Entre Hilos - Crochet Artesanal" 
              fill 
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* Nuestros Valores */}
      <section className="bg-white py-12 sm:py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-playfair text-3xl sm:text-4xl font-semibold text-[#5E548E] text-center mb-8 sm:mb-12">
            Lo Que Nos Define
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-[#9F86C0]/10 rounded-full flex items-center justify-center">
                <Heart size={32} className="sm:w-10 sm:h-10 text-[#9F86C0]" />
              </div>
              <h3 className="font-playfair text-lg sm:text-xl font-semibold text-[#5E548E] mb-3">
                Hecho con Amor
              </h3>
              <p className="font-lato text-xs sm:text-sm text-gray-600 leading-relaxed">
                Cada puntada refleja nuestra pasión por el arte del tejido a mano
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-[#9F86C0]/10 rounded-full flex items-center justify-center">
                <Award size={32} className="sm:w-10 sm:h-10 text-[#9F86C0]" />
              </div>
              <h3 className="font-playfair text-lg sm:text-xl font-semibold text-[#5E548E] mb-3">
                Calidad Premium
              </h3>
              <p className="font-lato text-xs sm:text-sm text-gray-600 leading-relaxed">
                Utilizamos solo hilos de algodón de la más alta calidad
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-[#9F86C0]/10 rounded-full flex items-center justify-center">
                <Sparkles size={32} className="sm:w-10 sm:h-10 text-[#9F86C0]" />
              </div>
              <h3 className="font-playfair text-lg sm:text-xl font-semibold text-[#5E548E] mb-3">
                Diseños Únicos
              </h3>
              <p className="font-lato text-xs sm:text-sm text-gray-600 leading-relaxed">
                Creaciones originales adaptadas a tus necesidades especiales
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 bg-[#9F86C0]/10 rounded-full flex items-center justify-center">
                <Users size={32} className="sm:w-10 sm:h-10 text-[#9F86C0]" />
              </div>
              <h3 className="font-playfair text-lg sm:text-xl font-semibold text-[#5E548E] mb-3">
                Atención Personal
              </h3>
              <p className="font-lato text-xs sm:text-sm text-gray-600 leading-relaxed">
                Te acompañamos en cada paso para crear el regalo perfecto
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lo Que Ofrecemos */}
      <section className="max-w-6xl mx-auto px-4 py-12 sm:py-16">
        <h2 className="font-playfair text-3xl sm:text-4xl font-semibold text-[#5E548E] text-center mb-8 sm:mb-12">
          Lo Que Ofrecemos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-playfair text-xl sm:text-2xl font-semibold text-[#5E548E] mb-4">
              Ramos Eternos
            </h3>
            <p className="font-lato text-sm sm:text-base text-gray-600 leading-relaxed">
              Flores que nunca se marchitan, ideales para celebraciones de San Valentín, Día de la Madre 
              y ocasiones especiales que merecen ser recordadas para siempre.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-playfair text-xl sm:text-2xl font-semibold text-[#5E548E] mb-4">
              Amigurumis Personalizados
            </h3>
            <p className="font-lato text-sm sm:text-base text-gray-600 leading-relaxed">
              Tus personajes favoritos de anime, películas y series cobran vida en versiones tejidas 
              a mano con detalles impecables y colores vibrantes.
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
            <h3 className="font-playfair text-xl sm:text-2xl font-semibold text-[#5E548E] mb-4">
              Decoraciones HotWheels
            </h3>
            <p className="font-lato text-sm sm:text-base text-gray-600 leading-relaxed">
              Cuadros iluminados y decoraciones temáticas para los pequeños amantes de los autos. 
              Perfectos para cumpleaños y habitaciones infantiles.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-[#9F86C0] to-[#5E548E] text-white py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            ¿Listo para crear algo especial?
          </h2>
          <p className="font-lato text-base sm:text-lg mb-6 sm:mb-8 font-light">
            Contáctanos y hagamos realidad el regalo perfecto tejido con amor
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/"
              className="font-lato px-6 sm:px-8 py-3 sm:py-4 bg-white text-[#5E548E] font-semibold rounded-full hover:bg-gray-100 transition-colors text-sm sm:text-base"
            >
              Ver Colección
            </Link>
            <a 
              href="https://wa.me/51927005798"
              target="_blank"
              rel="noopener noreferrer"
              className="font-lato px-6 sm:px-8 py-3 sm:py-4 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#5E548E] transition-all text-sm sm:text-base"
            >
              Contactar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}