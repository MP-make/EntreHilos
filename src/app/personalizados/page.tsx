import Image from "next/image";
import Link from "next/link";
import { getVentifyProducts } from "@/lib/ventify";
import { slugify } from "@/lib/utils";
import { Sparkles, Heart, MessageCircle, Check, ChevronRight, Shield, Ruler, Palette } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function PersonalizadosPage() {
  const allProducts = await getVentifyProducts();
  const productosPersonalizados = allProducts.filter(
    p => p.sku.startsWith('Amigu-') || p.sku.startsWith('Carr-')
  );

  const pasos = [
    { icon: MessageCircle, titulo: "Cuéntanos tu idea", desc: "Personaje, mascota o diseño que tengas en mente" },
    { icon: Palette, titulo: "Lo diseñamos para ti", desc: "Te enviamos el diseño y presupuesto sin compromiso" },
    { icon: Ruler, titulo: "Lo tejemos a mano", desc: "Cada puntada es única, 100% artesanal" },
    { icon: Heart, titulo: "Lo recibes en casa", desc: "Empacado con amor y listo para regalar" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* HERO */}
      <section className="relative bg-gradient-to-br from-[#FDF4F7] via-white to-[#FDE8EF] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#EE6B8D] rounded-full mix-blend-multiply filter blur-[100px] opacity-20" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C04267] rounded-full mix-blend-multiply filter blur-[100px] opacity-20" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white/80 border border-[#FDE8EF] text-[#C04267] px-4 py-1.5 rounded-full text-xs font-quicksand font-semibold mb-6 shadow-sm">
                <Sparkles size={14} />
                Hecho 100% a mano en Perú
              </div>

              <h1 className="font-fredoka text-4xl sm:text-5xl md:text-6xl font-bold text-[#C04267] leading-tight mb-4">
                Tú lo imaginas,<br />
                <span className="text-[#EE6B8D]">nosotros lo tejemos</span>
              </h1>

              <p className="font-quicksand text-base sm:text-lg text-[#6B6B6B] mb-8 max-w-md leading-relaxed">
                Convertimos tus ideas en amigurumis únicos. Personajes, mascotas o diseños personalizados tejidos a mano con algodón premium.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://wa.me/51902578295?text=Hola,%20quisiera%20cotizar%20un%20pedido%20personalizado"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 font-quicksand px-8 py-3.5 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <MessageCircle size={20} />
                  Cotizar por WhatsApp
                </a>
                <a
                  href="#galeria"
                  className="inline-flex items-center justify-center gap-2 font-quicksand px-8 py-3.5 border-2 border-[#EE6B8D] text-[#C04267] hover:bg-[#EE6B8D] hover:text-white font-semibold text-sm rounded-xl transition-all"
                >
                  Ver trabajos
                  <ChevronRight size={18} />
                </a>
              </div>

              <div className="flex items-center gap-6 mt-8 pt-8 border-t border-gray-200">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FDE8EF] to-[#EE6B8D] border-2 border-white flex items-center justify-center">
                      <Heart size={12} className="text-white" />
                    </div>
                  ))}
                </div>
                <p className="font-quicksand text-xs text-[#6B6B6B]">
                  <span className="font-semibold text-[#C04267]">+200</span> diseños entregados
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="relative aspect-square rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-[#FDE8EF] to-white border border-[#FDE8EF]">
                {productosPersonalizados.length > 0 ? (
                  <Image
                    src={productosPersonalizados[0].imagen}
                    alt="Amigurumi personalizado"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Heart className="w-16 h-16 text-[#EE6B8D] opacity-30" />
                  </div>
                )}
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 border border-[#FDE8EF]">
                <p className="font-quicksand text-xs text-[#6B6B6B]">Desde</p>
                <p className="font-fredoka text-xl text-[#EE6B8D] font-bold">S/ 80</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESO */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-fredoka text-3xl md:text-4xl font-bold text-[#C04267] mb-3">
              ¿Cómo funciona?
            </h2>
            <p className="font-quicksand text-base text-[#6B6B6B] max-w-lg mx-auto">
              Hacer tu pedido personalizado es más fácil de lo que piensas
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {pasos.map((paso, i) => {
              const Icon = paso.icon;
              return (
                <div key={paso.titulo} className="text-center group">
                  <div className="w-16 h-16 bg-[#FDF4F7] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#EE6B8D] group-hover:scale-110 transition-all duration-300">
                    <Icon size={28} className="text-[#EE6B8D] group-hover:text-white transition-colors" />
                  </div>
                  <div className="w-8 h-8 bg-[#EE6B8D] text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-fredoka font-bold -mt-2">
                    {i + 1}
                  </div>
                  <h3 className="font-quicksand text-sm font-bold text-[#4A4A4A] mb-1">{paso.titulo}</h3>
                  <p className="font-quicksand text-xs text-[#6B6B6B]">{paso.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* GALERÍA */}
      <section id="galeria" className="py-20 bg-[#FDF4F7]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-fredoka text-3xl md:text-4xl font-bold text-[#C04267] mb-3">
              Trabajos recientes
            </h2>
            <p className="font-quicksand text-base text-[#6B6B6B]">
              Inspírate con proyectos que ya hemos realizado
            </p>
          </div>

          {productosPersonalizados.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {productosPersonalizados.slice(0, 9).map((producto) => (
                <Link
                  key={producto.id}
                  href={`/product/${slugify(producto.nombre)}`}
                  className="group"
                >
                  <div className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-[#FDE8EF] group-hover:shadow-lg group-hover:border-[#EE6B8D] transition-all duration-300">
                    <Image
                      src={producto.imagen}
                      alt={producto.nombre}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0">
                      <span className="block text-white font-quicksand text-xs font-semibold bg-black/50 rounded-lg px-3 py-1.5 text-center backdrop-blur-sm">
                        Ver detalle
                      </span>
                    </div>
                  </div>
                  <h3 className="font-quicksand text-sm font-semibold text-[#4A4A4A] mt-3 group-hover:text-[#C04267] transition-colors line-clamp-1">
                    {producto.nombre}
                  </h3>
                  <p className="font-fredoka text-sm text-[#EE6B8D] font-medium mt-0.5">
                    Desde S/ {producto.precio.toFixed(2)}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#FDE8EF]">
              <Heart className="w-12 h-12 text-[#EE6B8D] mx-auto mb-4 opacity-50" />
              <p className="font-quicksand text-base text-[#6B6B6B]">Galería próximamente</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-20 bg-gradient-to-br from-white to-[#FDF4F7]">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <div className="w-16 h-16 bg-[#FDE8EF] rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-[#EE6B8D]" fill="#EE6B8D" />
          </div>
          <h2 className="font-fredoka text-3xl md:text-4xl font-bold text-[#C04267] mb-3">
            ¿Listo para empezar?
          </h2>
          <p className="font-quicksand text-base text-[#6B6B6B] mb-8 max-w-md mx-auto">
            Cuéntanos tu idea y te enviaremos una cotización personalizada sin compromiso
          </p>
          <a
            href="https://wa.me/51902578295?text=Hola,%20quisiera%20cotizar%20un%20pedido%20personalizado"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 font-quicksand px-10 py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-base rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <MessageCircle size={22} />
            Cotizar ahora
          </a>
          <div className="flex items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
              <Shield size={14} className="text-[#EE6B8D]" />
              Pago seguro
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
              <MessageCircle size={14} className="text-[#EE6B8D]" />
              Respuesta inmediata
            </div>
            <div className="flex items-center gap-2 text-xs text-[#6B6B6B]">
              <Heart size={14} className="text-[#EE6B8D]" />
              Sin compromiso
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
