import Image from "next/image";
import Link from "next/link";
import { getVentifyProducts } from "@/lib/ventify";
import { slugify } from "@/lib/utils";
import { Check } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function PersonalizadosPage() {
  // Obtener productos personalizados
  const allProducts = await getVentifyProducts();
  const productosPersonalizados = allProducts.filter(
    p => p.sku.startsWith('Amigu-') || p.sku.startsWith('Carr-')
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* ==================== COLUMNA IZQUIERDA: PITCH STICKY ==================== */}
          <div className="lg:sticky lg:top-0 lg:h-screen flex items-center px-4 sm:px-6 md:px-8 lg:px-12 py-12 sm:py-16 lg:py-20 bg-white lg:border-r border-gray-200">
            <div className="max-w-lg mx-auto lg:mx-0 w-full">
              {/* Título Principal */}
              <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold text-[#5E548E] mb-4 sm:mb-6 leading-tight">
                Tú lo imaginas, nosotros lo tejemos
              </h1>
              
              {/* Subtítulo */}
              <p className="font-lato text-base sm:text-lg md:text-xl text-[#6B6B6B] mb-8 sm:mb-10 font-light leading-relaxed">
                Convertimos tus personajes favoritos, mascotas o ideas en amigurumis únicos de alta calidad
              </p>

              {/* Lista de Beneficios */}
              <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-12">
                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <Check size={18} className="sm:w-5 sm:h-5 text-[#9F86C0]" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-lato text-sm sm:text-base font-semibold text-[#5E548E] mb-1">
                      Diseño 100% exclusivo
                    </h3>
                    <p className="font-lato text-xs sm:text-sm text-[#6B6B6B] font-light">
                      Creado especialmente para ti según tus especificaciones
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <Check size={18} className="sm:w-5 sm:h-5 text-[#9F86C0]" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-lato text-sm sm:text-base font-semibold text-[#5E548E] mb-1">
                      Materiales hipoalergénicos
                    </h3>
                    <p className="font-lato text-xs sm:text-sm text-[#6B6B6B] font-light">
                      Hilos de algodón premium seguros para todas las edades
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-2 sm:gap-3">
                  <div className="mt-1 flex-shrink-0">
                    <Check size={18} className="sm:w-5 sm:h-5 text-[#9F86C0]" strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="font-lato text-sm sm:text-base font-semibold text-[#5E548E] mb-1">
                      Atención personalizada
                    </h3>
                    <p className="font-lato text-xs sm:text-sm text-[#6B6B6B] font-light">
                      Te acompañamos en todo el proceso de creación
                    </p>
                  </div>
                </li>
              </ul>

              {/* CTA Principal WhatsApp */}
              <a 
                href="https://wa.me/51927005738?text=Hola,%20quisiera%20cotizar%20un%20pedido%20personalizado"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 sm:gap-3 w-full font-lato px-6 sm:px-8 py-3 sm:py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold text-sm sm:text-base tracking-wide transition-all duration-300 rounded shadow-lg hover:shadow-xl"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Cotiza tu pedido ahora
              </a>

              {/* Info adicional */}
              <p className="font-lato text-xs text-[#6B6B6B] text-center mt-4 font-light">
                Respuesta inmediata • Presupuesto sin compromiso
              </p>
            </div>
          </div>

          {/* ==================== COLUMNA DERECHA: GALERÍA SCROLL ==================== */}
          <div className="px-8 md:px-12 py-20 bg-[#FAFAFA]">
            <div className="max-w-2xl mx-auto">
              {/* Header de Galería */}
              <div className="mb-12 text-center">
                <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-[#5E548E] mb-4">
                  Nuestros Trabajos
                </h2>
                <p className="font-lato text-base text-[#6B6B6B] font-light">
                  Inspiración de proyectos anteriores
                </p>
              </div>

              {/* Galería de Productos */}
              {productosPersonalizados.length > 0 ? (
                <div className="grid grid-cols-2 gap-6">
                  {productosPersonalizados.map((producto) => (
                    <Link 
                      key={producto.id} 
                      href={`/product/${slugify(producto.nombre)}`}
                      className="group block"
                    >
                      <div className="relative aspect-square bg-white mb-3 overflow-hidden rounded shadow-sm border border-gray-200 group-hover:border-[#9F86C0] transition-all duration-300">
                        <Image
                          src={producto.imagen}
                          alt={producto.nombre}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      </div>

                      <h3 className="font-playfair text-base text-[#4A4A4A] mb-1 group-hover:text-[#5E548E] transition-colors duration-300 line-clamp-1">
                        {producto.nombre}
                      </h3>

                      <p className="font-lato text-sm text-[#9F86C0] font-medium">
                        Desde S/ {producto.precio.toFixed(2)}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded shadow-sm">
                  <p className="font-lato text-base text-[#6B6B6B] font-light">
                    Galería próximamente
                  </p>
                </div>
              )}

              {/* CTA Secundario */}
              <div className="mt-16 p-8 bg-white rounded shadow-sm border border-gray-200 text-center">
                <h3 className="font-playfair text-2xl font-semibold text-[#5E548E] mb-3">
                  ¿Listo para empezar?
                </h3>
                <p className="font-lato text-sm text-[#6B6B6B] font-light mb-6">
                  Cuéntanos tu idea y te enviaremos una cotización personalizada
                </p>
                <a 
                  href="https://wa.me/51927005738?text=Hola,%20quisiera%20cotizar%20un%20pedido%20personalizado"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-lato px-6 py-3 border-2 border-[#9F86C0] text-[#5E548E] font-medium text-sm tracking-wide hover:bg-[#9F86C0] hover:text-white transition-all duration-300 rounded"
                >
                  Contactar ahora
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
