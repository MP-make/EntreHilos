'use client';

export default function AnnouncementBar() {
  return (
    <div>
      {/* FRANJA SUPERIOR (Top Bar) - Información de envíos - COLOR VINO TINTO */}
      <div className="bg-[#881337] text-white py-2 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-lato text-xs md:text-sm font-light tracking-wide">
            🚚 Envíos GRATIS en Pisco por compras mayores a S/ 150 | 🕒 Entrega el mismo día
          </p>
        </div>
      </div>

      {/* FRANJA INFERIOR (Promo Bar) - Promoción San Valentín - COLOR FUCSIA */}
      <div className="bg-[#E91E63] text-white py-2 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-lato text-sm md:text-base font-bold tracking-wide">
            🎈 ¡Modo San Valentín Activado! Regalos y Decoraciones 🎈
          </p>
        </div>
      </div>
    </div>
  );
}