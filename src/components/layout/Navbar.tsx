'use client';

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, User } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
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

          {/* CENTRO: Menú de navegación - ENLACES CORREGIDOS */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className="font-lato text-sm uppercase tracking-wide text-gray-700 hover:text-[#9F86C0] transition-colors duration-200"
            >
              Inicio
            </Link>
            <Link 
              href="/category/san-valentin" 
              className="font-lato text-sm uppercase tracking-wide text-[#E91E63] hover:text-[#C2185B] font-bold transition-colors duration-200"
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

          {/* DERECHA: Iconos decorativos + Carrito funcional */}
          <div className="flex items-center gap-4">
            {/* Icono de búsqueda */}
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
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
  );
}
