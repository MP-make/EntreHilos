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
      {/* CONTENEDOR STICKY COMPLETO CON BLUR */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/90 shadow-sm">
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

        {/* NAVBAR PRINCIPAL */}
        <nav className="bg-white/95">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* IZQUIERDA: Logo + Texto */}
              <Link href="/" className="flex items-center gap-3 group">
                <Image 
                  src="/logo.jpg" 
                  alt="Entre Hilos Logo" 
                  width={60} 
                  height={60}
                  className="object-contain rounded-full group-hover:scale-105 transition-transform duration-300"
                />
                <div className="hidden sm:block">
                  <h1 className="font-playfair font-bold text-2xl text-[#5E548E] leading-tight">
                    Entre Hilos
                  </h1>
                  <p className="font-lato text-xs text-gray-500 tracking-wide">
                    Decorando momentos
                  </p>
                </div>
              </Link>

              {/* CENTRO: Menú de navegación */}
              <div className="hidden md:flex items-center gap-8">
                <Link 
                  href="/" 
                  className="font-lato text-sm uppercase tracking-wide text-gray-700 hover:text-[#9F86C0] transition-colors duration-200"
                >
                  Inicio
                </Link>
                <Link 
                  href="/category/san-valentin" 
                  className="font-lato text-sm uppercase tracking-wide text-[#5E548E] hover:text-[#9F86C0] font-bold transition-colors duration-200"
                >
                  San Valentín 💘
                </Link>
                <Link 
                  href="/category/dia-de-la-madre" 
                  className="font-lato text-sm uppercase tracking-wide text-gray-700 hover:text-[#9F86C0] transition-colors duration-200"
                >
                  Día de la Madre
                </Link>
                <Link 
                  href="/category/hotwheels" 
                  className="font-lato text-sm uppercase tracking-wide text-gray-700 hover:text-[#9F86C0] transition-colors duration-200"
                >
                  HotWheels
                </Link>
                <Link 
                  href="/personalizados" 
                  className="font-lato text-sm uppercase tracking-wide text-gray-700 hover:text-[#9F86C0] transition-colors duration-200"
                >
                  Personalizados
                </Link>
              </div>

              {/* DERECHA: Iconos */}
              <div className="flex items-center gap-4">
                {/* Icono de búsqueda - FUNCIONAL */}
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Buscar productos"
                >
                  <Search size={20} className="text-gray-600" />
                </button>

                {/* Icono de usuario */}
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <User size={20} className="text-gray-600" />
                </button>

                {/* Carrito con badge */}
                <Link 
                  href="/cart"
                  className="relative p-2 hover:bg-[#FDF4F7] rounded-full transition-all duration-300 group"
                >
                  <ShoppingBag size={22} className="text-[#5E548E] group-hover:text-[#9F86C0]" />
                  {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#E91E63] text-white text-xs font-lato font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
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
