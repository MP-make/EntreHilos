"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  Heart,
  MessageCircle,
  Star,
  Ruler,
  Palette,
  Wand2,
  LogIn,
} from "lucide-react";
import type { Product } from "@/lib/ventify";
import { useAuth } from "@/context/AuthContext";
import QuoteForm from "./QuoteForm";
import Gallery from "./Gallery";
import Faq from "./Faq";
import Modal from "./Modal";
import AuthModal from "@/components/AuthModal";

interface Props {
  productosPersonalizados: Product[];
  heroConfig?: any;
}

export default function PersonalizadosContent({ productosPersonalizados, heroConfig }: Props) {
  const items = heroConfig?.items || {};
  const { user } = useAuth();

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const productosRef = productosPersonalizados.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    precio: p.precio,
  }));

  const pasos = [
    { icon: MessageCircle, titulo: "Cuéntanos tu idea", desc: "Personaje, mascota o diseño que tengas en mente" },
    { icon: Palette, titulo: "Lo diseñamos para ti", desc: "Te enviamos el diseño y presupuesto sin compromiso" },
    { icon: Ruler, titulo: "Lo tejemos a mano", desc: "Cada puntada es única, 100% artesanal" },
    { icon: Heart, titulo: "Lo recibes en casa", desc: "Empacado con amor y listo para regalar" },
  ];

  const collage = productosPersonalizados.slice(0, 3);

  function handleOpenForm() {
    if (user) {
      setFormModalOpen(true);
    } else {
      setAuthModalOpen(true);
    }
  }

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* HERO */}
        <section className="relative bg-gradient-to-br from-[#FDF4F7] via-white to-[#FDE8EF] overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#EE6B8D] rounded-full mix-blend-multiply filter blur-[100px] opacity-20" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#C04267] rounded-full mix-blend-multiply filter blur-[100px] opacity-20" />
          </div>

          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-12 md:py-16">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center gap-2 bg-white/80 border border-[#FDE8EF] text-[#C04267] px-3 sm:px-4 py-1.5 rounded-full text-[11px] sm:text-xs font-quicksand font-semibold mb-4 sm:mb-6 shadow-sm">
                  <Sparkles size={14} />
                  {items.badge || "Hecho 100% a mano en Perú"}
                </div>

                <h1 className="font-fredoka text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#C04267] leading-tight mb-3 sm:mb-4">
                  {items.titulo_linea1 || "Tú lo imaginas,"}<br />
                  <span className="text-[#EE6B8D]">{items.titulo_linea2 || "nosotros lo tejemos"}</span>
                </h1>

                <p className="font-quicksand text-sm sm:text-base md:text-lg text-[#6B6B6B] mb-6 sm:mb-8 max-w-md leading-relaxed">
                  {heroConfig?.subtitulo || "Convertimos tus ideas en amigurumis únicos. Personajes, mascotas o diseños personalizados tejidos a mano con algodón premium."}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={handleOpenForm}
                    className="inline-flex items-center justify-center gap-2 font-quicksand px-6 sm:px-8 py-3 sm:py-3.5 bg-[#EE6B8D] hover:bg-[#C04267] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    {user ? <Wand2 size={18} /> : <LogIn size={18} />}
                    {user ? (items.boton_primario_logged || "Personalizar") : (items.boton_primario || "Iniciar sesión")}
                  </button>
                  <a
                    href="#galeria"
                    className="inline-flex items-center justify-center gap-2 font-quicksand px-6 sm:px-8 py-3 sm:py-3.5 border-2 border-[#EE6B8D] text-[#C04267] hover:bg-[#EE6B8D] hover:text-white font-semibold text-xs sm:text-sm rounded-xl transition-all"
                  >
                    {items.boton_secundario || "Ver trabajos"}
                  </a>
                </div>

                <div className="flex items-center gap-3 sm:gap-4 mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={14} className="sm:w-4 sm:h-4 text-amber-400" fill="#FBBF24" />
                    ))}
                  </div>
                  <p className="font-quicksand text-[11px] sm:text-xs text-[#6B6B6B]">
                    <span className="font-semibold text-[#C04267]">{items.estadistica || "+200"}</span>{items.estadistica?.includes("diseños") ? "" : " diseños entregados"}
                  </p>
                </div>
              </div>

              <div className="relative order-1 md:order-2">
                {heroConfig?.imagen_url ? (
                  <div className="relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-[#FDE8EF]">
                    <Image
                      src={heroConfig.imagen_url}
                      alt="Personalizados"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : collage.length >= 3 ? (
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-[#FDE8EF]">
                      <Image
                        src={collage[0].imagen}
                        alt={collage[0].nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-[#FDE8EF]">
                      <Image
                        src={collage[1].imagen}
                        alt={collage[1].nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="col-span-2 relative aspect-[2/1] rounded-xl sm:rounded-2xl overflow-hidden shadow-lg border border-[#FDE8EF]">
                      <Image
                        src={collage[2].imagen}
                        alt={collage[2].nombre}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                ) : collage.length > 0 ? (
                  <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-xl border border-[#FDE8EF]">
                    <Image
                      src={collage[0].imagen}
                      alt="Amigurumi personalizado"
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-square rounded-xl sm:rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-[#FDE8EF] to-white border border-[#FDE8EF] flex items-center justify-center">
                    <Heart className="w-12 sm:w-16 h-12 sm:h-16 text-[#EE6B8D] opacity-30" />
                  </div>
                )}
                <div className="absolute -bottom-3 sm:-bottom-4 -left-3 sm:-left-4 bg-white rounded-xl shadow-lg p-3 sm:p-4 border border-[#FDE8EF]">
                  <p className="font-quicksand text-[10px] sm:text-xs text-[#6B6B6B]">{items.etiqueta_precio || "Desde"}</p>
                  <p className="font-fredoka text-base sm:text-xl text-[#EE6B8D] font-bold">{items.valor_precio || "S/ 80"}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESO */}
        <section className="py-16 sm:py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-10 sm:mb-14">
              <h2 className="font-fredoka text-2xl sm:text-3xl md:text-4xl font-bold text-[#C04267] mb-2 sm:mb-3">
                ¿Cómo funciona?
              </h2>
              <p className="font-quicksand text-sm sm:text-base text-[#6B6B6B] max-w-lg mx-auto">
                Hacer tu pedido personalizado es más fácil de lo que piensas
              </p>
            </div>

            <div className="relative">
              <div
                className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-0 border-t-2 border-dashed"
                style={{ borderColor: '#EE6B8D50' }}
                aria-hidden="true"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 relative">
                {pasos.map((paso, i) => {
                  const Icon = paso.icon;
                  const rotate = i % 2 === 0 ? '-rotate-2' : 'rotate-2';
                  return (
                    <div key={paso.titulo} className="text-center group">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-[#FDF4F7] rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-[#EE6B8D] group-hover:scale-110 transition-all duration-300 border-2 border-dashed ${rotate}`}
                        style={{ borderColor: '#EE6B8D' }}
                      >
                        <Icon size={24} className="sm:w-7 sm:h-7 text-[#EE6B8D] group-hover:text-white transition-colors" />
                      </div>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#EE6B8D] text-white rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3 text-[11px] sm:text-sm font-fredoka font-bold -mt-2 border-2 border-dashed border-white/50">
                        {i + 1}
                      </div>
                      <h3 className="font-quicksand text-xs sm:text-sm font-bold text-[#4A4A4A] mb-1">{paso.titulo}</h3>
                      <p className="font-quicksand text-[11px] sm:text-xs text-[#6B6B6B]">{paso.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* GALERÍA */}
        <Gallery products={productosPersonalizados} />

        {/* CTA FINAL */}
        <section className="py-16 sm:py-20 bg-gradient-to-br from-white to-[#FDF4F7]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#FDE8EF] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Heart className="w-7 sm:w-8 h-7 sm:h-8 text-[#EE6B8D]" fill="#EE6B8D" />
            </div>
            <h2 className="font-fredoka text-2xl sm:text-3xl md:text-4xl font-bold text-[#C04267] mb-2 sm:mb-3">
              ¿Listo para empezar?
            </h2>
            <p className="font-quicksand text-sm sm:text-base text-[#6B6B6B] mb-6 sm:mb-8 max-w-md mx-auto">
              Cuéntanos tu idea y te enviaremos una cotización personalizada sin compromiso
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleOpenForm}
                className="inline-flex items-center justify-center gap-2 font-quicksand px-8 sm:px-10 py-3 sm:py-4 bg-[#EE6B8D] hover:bg-[#C04267] text-white font-bold text-sm sm:text-base rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                {user ? <Wand2 size={22} /> : <LogIn size={22} />}
                {user ? "Crear mi diseño" : "Inicia sesión para crear"}
              </button>
              <a
                href={`https://wa.me/51902578295?text=${encodeURIComponent("¡Hola! Quiero hacer un pedido personalizado")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 font-quicksand px-6 sm:px-8 py-3 sm:py-4 border-2 border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white font-bold text-sm sm:text-base rounded-xl transition-all"
              >
                <MessageCircle size={22} />
                Escribir por WhatsApp
              </a>
            </div>
            <p className="font-quicksand text-xs text-gray-400 mt-4">
              Sin registro, respuesta rápida
            </p>
          </div>
        </section>

        {/* FAQ */}
        <Faq />
      </div>

      {/* MODAL FORM */}
      <Modal open={formModalOpen} onClose={() => setFormModalOpen(false)} wide>
        <QuoteForm
          productos={productosRef}
          onSuccess={() => setFormModalOpen(false)}
        />
      </Modal>

      {/* MODAL AUTH */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          setAuthModalOpen(false);
          setFormModalOpen(true);
        }}
      />
    </>
  );
}
