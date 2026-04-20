'use client';

import { MessageCircle } from "lucide-react";
import { useState } from "react";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const whatsappNumber = "51902578295";
  // Corazón actualizado a la nueva paleta
  const message = "¡Hola Entre Hilos! 💖 Quiero más información sobre sus productos";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    // 1. z-40: Lo bajamos un nivel para que el menú móvil (z-50) lo pueda tapar al abrirse.
    // 2. bottom-4 right-4: Más pegado a la esquina en móviles para no estorbar el centro.
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      
      {/* Tooltip: hidden md:block -> Lo ocultamos en celulares porque el "hover" no existe en pantallas táctiles y solo hace bulto */}
      {showTooltip && (
        <div className="hidden md:block absolute bottom-full right-0 mb-2 px-4 py-2 bg-gray-900 text-white text-sm font-lato rounded-lg whitespace-nowrap shadow-lg">
          ¿Consultas?
          <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Botón: w-12 h-12 en celular (48px) y w-16 h-16 en PC (64px) */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300"
        aria-label="Contactar por WhatsApp"
      >
        {/* Icono más pequeño en móvil para mantener la proporción */}
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7" />
      </a>
    </div>
  );
}
