'use client';

import Image from "next/image";
import { useState } from "react";

export default function WhatsAppButton() {
  const [showTooltip, setShowTooltip] = useState(false);
  const whatsappNumber = "51902578295";
  const message = "¡Hola Entre Hilos! 💖 Quiero más información sobre sus productos";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40">
      
      {/* Tooltip: hidden md:block -> Lo ocultamos en celulares porque el "hover" no existe en pantallas táctiles y solo hace bulto */}
      {showTooltip && (
        <div className="hidden md:block absolute bottom-full right-0 mb-2 px-4 py-2 bg-gray-900 text-white text-sm font-lato rounded-lg whitespace-nowrap shadow-lg">
          ¿Consultas?
          <div className="absolute top-full right-6 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-gray-900"></div>
        </div>
      )}

      {/* Botón flotante: Le agregué "group" y "hover:-translate-y-2" para que se eleve elegantemente */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-[#25D366] rounded-full shadow-lg hover:shadow-[0_8px_25px_rgba(37,211,102,0.4)] hover:-translate-y-1.5 transition-all duration-300"
        aria-label="Contactar por WhatsApp"
      >
        {/* Aquí está tu imagen PNG con el efecto de rotación y zoom */}
        <Image 
          src="/Wspicono.png" 
          alt="WhatsApp" 
          width={36} 
          height={36} 
          className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 object-contain transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-12"
        />
      </a>
    </div>
  );
}