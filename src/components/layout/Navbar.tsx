'use client';

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Truck, Clock, Menu, X } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import SearchModal from "@/components/SearchModal";
import { getVentifyProducts } from "@/lib/ventify";
import { Product } from "@/lib/ventify";

export default function Navbar() {
  const { totalItems } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Cargar productos para el buscador
  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await getVentifyProducts();
      setProducts(allProducts);
    };
    loadProducts();
  }, []);

  // Bloquear scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const menuItems = [
    { href: "/", label: "Inicio", highlight: false },
    { href: "/category/dia-de-la-madre", label: "Día de la Madre 🌸", highlight: true }, // ¡Movido al principio, con flor y resaltado!
    { href: "/category/dia-de-la-mujer", label: "Día de la Mujer 💜", highlight: false },
    { href: "/category/san-valentin", label: "San Valentín 💘", highlight: false },
    { href: "/category/flores-amarillas", label: "Flores Amarillas", highlight: false },
    { href: "/personalizados", label: "Personalizados", highlight: false },
  ];

  return (
    <>
      {/* FRANJA ROSA - Día de la Madre (SCROLLEA) */}
      <div className="bg-[#ec4899] text-white py-2 sm:py-2.5 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-lato text-xs sm:text-sm md:text-base font-semibold tracking-wide">
            🌸 ¡Campaña Día de la Madre! Reserva el regalo perfecto para mamá 🌸
          </p>
        </div>
      </div>

      {/* NAVBAR STICKY (NO SCROLLEA) */}
      <nav className="sticky top-0 z-50">
        {/* FRANJA SUPERIOR - Información logística (NUEVO GRADIENTE ROSA) */}
        <div className="bg-gradient-to-r from-[#EE6B8D] via-[#F48FB0] to-[#EE6B8D] text-white py-2 px-2 sm:px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="font-lato text-[10px] sm:text-xs md:text-sm font-light tracking-wide flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              <Truck className="w-3 h-3 md:w-4 md:h-4 animate-bounce flex-shrink-0" />
              <span className="text-center">Envíos GRATIS por compras mayores a S/150</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:flex items-center gap-2">
                <Clock className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
                Separa tu fecha
              </span>
            </p>
          </div>
        </div>

        {/* NAVBAR PRINCIPAL */}
        <div className="bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2">
              {/* IZQUIERDA: Logo + Texto */}
              <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                <Image 
                  src="/logo.png" 
                  alt="Entre Hilos Logo" 
                  width={50} 
                  height={50}
                  className="w-10 h-10 sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] object-contain rounded-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="hidden sm:block">
                  <h1 className="font-playfair font-bold text-lg sm:text-xl md:text-2xl text-[#C04267] leading-tight">
                    Entre Hilos
                  </h1>
                  <p className="font-lato text-[10px] sm:text-xs text-gray-500 tracking-wide">
                    Decorando momentos
                  </p>
                </div>
              </Link>

              {/* CENTRO: Menú de navegación - Solo Desktop */}
              <div className="hidden lg:flex items-center gap-4 xl:gap-8">
                {menuItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={`font-lato text-xs xl:text-sm uppercase tracking-wide transition-colors duration-200 ${
                      item.highlight 
                        ? 'text-[#C04267] hover:text-[#EE6B8D] font-bold' 
                        : 'text-gray-700 hover:text-[#EE6B8D]'
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* DERECHA: Iconos */}
              <div className="flex items-center gap-1 sm:gap-2 md:gap-4">
                {/* Icono de búsqueda - FUNCIONAL */}
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Buscar productos"
                >
                  <Search size={18} className="sm:w-5 sm:h-5 text-gray-600" />
                </button>

                {/* Carrito con badge */}
                <Link 
                  href="/cart"
                  className="relative p-1.5 sm:p-2 hover:bg-[#FDF4F7] rounded-full transition-all duration-300 group"
                >
                  <ShoppingBag size={20} className="sm:w-[22px] sm:h-[22px] text-[#C04267] group-hover:text-[#EE6B8D]" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-[#E91E63] text-white text-[10px] sm:text-xs font-lato font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md">
                      {totalItems}
                    </span>
                  )}
                </Link>

                {/* Botón Hamburguesa - Solo Móvil */}
                <button 
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Abrir menú"
                >
                  {isMobileMenuOpen ? (
                    <X size={24} className="text-[#C04267]" />
                  ) : (
                    <Menu size={24} className="text-[#C04267]" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* MENÚ MÓVIL - Overlay con animación */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Overlay oscuro */}
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        {/* Panel del menú */}
        <div 
          className={`absolute top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Header del menú */}
          <div className="bg-gradient-to-r from-[#EE6B8D] to-[#F48FB0] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-xl font-bold text-white">
                Menú
              </h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Cerrar menú"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
          </div>

          {/* Lista de links */}
          <nav className="py-6">
            {menuItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-6 py-4 font-lato text-base tracking-wide transition-all duration-200 border-l-4 ${
                  item.highlight
                    ? 'text-[#E91E63] font-bold border-[#E91E63] bg-pink-50 hover:bg-pink-100'
                    : 'text-gray-700 border-transparent hover:border-[#EE6B8D] hover:bg-[#FDF4F7] hover:text-[#C04267]'
                }`}
                style={{ 
                  animationDelay: `${index * 50}ms`,
                  animation: isMobileMenuOpen ? 'slideInRight 0.3s ease-out forwards' : 'none'
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Footer del menú con info */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-[#FDF4F7] border-t border-gray-200">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5 text-[#EE6B8D] flex-shrink-0" />
                <span className="font-lato">Envíos desde S/ 5 según distancia</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Clock className="w-5 h-5 text-[#EE6B8D] flex-shrink-0" />
                <span className="font-lato">Entrega el mismo día</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Búsqueda */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        products={products} 
      />

      {/* Estilos para animaciones */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}