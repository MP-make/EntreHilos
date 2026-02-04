'use client';

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, User, Truck, Clock } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect } from "react";
import SearchModal from "@/components/SearchModal";
import { getVentifyProducts } from "@/lib/ventify";
import { Product } from "@/lib/ventify";

export default function Navbar() {
  const { totalItems } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  // Cargar productos para el buscador
  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await getVentifyProducts();
      setProducts(allProducts);
    };
    loadProducts();
  }, []);

  return (
    <>
      {/* CONTENEDOR STICKY COMPLETO CON BLUR - SIN FONDO QUE SOBRESCRIBA */}
      <div className="sticky top-0 z-50 backdrop-blur-md shadow-sm">
        {/* FRANJA SUPERIOR - Información logística CON ANIMACIONES */}
        <div className="bg-gradient-to-r from-[#5E548E] via-[#6B5B95] to-[#5E548E] text-white py-2 px-2 sm:px-4 animate-fade-in">
          <div className="max-w-7xl mx-auto text-center">
            <p className="font-lato text-[10px] sm:text-xs md:text-sm font-light tracking-wide flex flex-wrap items-center justify-center gap-1 sm:gap-2">
              <Truck className="w-3 h-3 md:w-4 md:h-4 animate-bounce flex-shrink-0" />
              <span className="text-center">Envíos GRATIS en Pisco por compras mayores a S/ 100</span>
              <span className="hidden sm:inline">|</span>
              <span className="hidden sm:flex items-center gap-2">
                <Clock className="w-3 h-3 md:w-4 md:h-4 animate-pulse" />
                Entrega el mismo día
              </span>
            </p>
          </div>
        </div>

        {/* FRANJA INFERIOR - Promoción San Valentín */}
        <div className="bg-[#ec4899] text-white py-2 sm:py-2.5 px-2 sm:px-4">
          <div className="max-w-7xl mx-auto text-center">
            <p className="font-lato text-xs sm:text-sm md:text-base font-semibold tracking-wide">
              💜 ¡Modo San Valentín Activado! Regalos y Decoraciones 💜
            </p>
          </div>
        </div>

        {/* NAVBAR PRINCIPAL */}
        <nav className="bg-white/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4">
            <div className="flex items-center justify-between gap-2">
              {/* IZQUIERDA: Logo + Texto */}
              <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
                <Image 
                  src="/logo.jpg" 
                  alt="Entre Hilos Logo" 
                  width={50} 
                  height={50}
                  className="w-10 h-10 sm:w-[50px] sm:h-[50px] md:w-[60px] md:h-[60px] object-contain rounded-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="hidden sm:block">
                  <h1 className="font-playfair font-bold text-lg sm:text-xl md:text-2xl text-[#5E548E] leading-tight">
                    Entre Hilos
                  </h1>
                  <p className="font-lato text-[10px] sm:text-xs text-gray-500 tracking-wide">
                    Decorando momentos
                  </p>
                </div>
              </Link>

              {/* CENTRO: Menú de navegación - Solo Desktop */}
              <div className="hidden lg:flex items-center gap-4 xl:gap-8">
                <Link 
                  href="/" 
                  className="font-lato text-xs xl:text-sm uppercase tracking-wide text-gray-700 hover:text-[#9F86C0] transition-colors duration-200"
                >
                  Inicio
                </Link>
                <Link 
                  href="/category/san-valentin" 
                  className="font-lato text-xs xl:text-sm uppercase tracking-wide text-[#5E548E] hover:text-[#9F86C0] font-bold transition-colors duration-200"
                >
                  San Valentín 💘
                </Link>
                <Link 
                  href="/category/dia-de-la-madre" 
                  className="font-lato text-xs xl:text-sm uppercase tracking-wide text-gray-700 hover:text-[#9F86C0] transition-colors duration-200"
                >
                  Día de la Madre
                </Link>
                <Link 
                  href="/category/hotwheels" 
                  className="font-lato text-xs xl:text-sm uppercase tracking-wide text-gray-700 hover:text-[#9F86C0] transition-colors duration-200"
                >
                  HotWheels
                </Link>
                <Link 
                  href="/personalizados" 
                  className="font-lato text-xs xl:text-sm uppercase tracking-wide text-gray-700 hover:text-[#9F86C0] transition-colors duration-200"
                >
                  Personalizados
                </Link>
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

                {/* Icono de usuario */}
                <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <User size={18} className="sm:w-5 sm:h-5 text-gray-600" />
                </button>

                {/* Carrito con badge */}
                <Link 
                  href="/cart"
                  className="relative p-1.5 sm:p-2 hover:bg-[#FDF4F7] rounded-full transition-all duration-300 group"
                >
                  <ShoppingBag size={20} className="sm:w-[22px] sm:h-[22px] text-[#5E548E] group-hover:text-[#9F86C0]" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-[#E91E63] text-white text-[10px] sm:text-xs font-lato font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </div>

      {/* Modal de Búsqueda */}
      <SearchModal 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        products={products} 
      />
    </>
  );
}
