'use client';

import { Truck, Clock } from "lucide-react";

export default function AnnouncementBar() {
  return (
    <div className="sticky top-0 z-50 shadow-sm">
      {/* FRANJA SUPERIOR - Información logística CON ANIMACIONES */}
      <div className="bg-gradient-to-r from-[#5E548E] via-[#6B5B95] to-[#5E548E] text-white py-2 px-4 animate-fade-in">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-lato text-xs md:text-sm font-light tracking-wide flex items-center justify-center gap-2">
            <Truck className="w-3 h-3 md:w-4 md:h-4 animate-bounce" />
            <span>Envíos GRATIS en Pisco por compras mayores a S/ 100</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:flex items-center gap-2">
              <Clock className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
              Entrega el mismo día
            </span>
          </p>
        </div>
      </div>

      {/* FRANJA INFERIOR - Promoción San Valentín */}
      <div className="bg-[#ec4899] text-white py-2.5 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-lato text-sm md:text-base font-semibold tracking-wide">
            💜 ¡Modo San Valentín Activado! Regalos y Decoraciones 💜
          </p>
        </div>
      </div>
    </div>
  );
}