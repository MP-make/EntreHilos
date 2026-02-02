'use client';

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [cartCount] = useState(3); // Simulado por ahora

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo a la izquierda */}
          <Link href="/" className="flex items-center gap-3 group">
            <Image 
              src="/logo.jpg" 
              alt="Entre Hilos Logo" 
              width={50} 
              height={50}
              className="object-contain rounded-full group-hover:scale-105 transition-transform duration-300"
            />
            <span className="font-playfair font-semibold text-xl text-[#5E548E] hidden sm:inline">
              Entre Hilos
            </span>
          </Link>

          {/* Navegación al centro */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/category/san-valentin" 
              className="font-lato text-sm text-[#E91E63] hover:text-[#C2185B] transition-colors duration-200 font-semibold tracking-wide"
            >
              San Valentín
            </Link>
            <Link 
              href="/category/dia-de-la-madre" 
              className="font-lato text-sm text-[#6B6B6B] hover:text-[#9F86C0] transition-colors duration-200 font-light tracking-wide"
            >
              Día de la Madre
            </Link>
            <Link 
              href="/category/hotwheels" 
              className="font-lato text-sm text-[#6B6B6B] hover:text-[#9F86C0] transition-colors duration-200 font-light tracking-wide"
            >
              HotWheels
            </Link>
            <Link 
              href="/personalizados" 
              className="font-lato text-sm text-[#6B6B6B] hover:text-[#9F86C0] transition-colors duration-200 font-light tracking-wide"
            >
              Personalizados
            </Link>
          </div>

          {/* Carrito a la derecha */}
          <Link 
            href="/cart"
            className="relative p-2 hover:bg-[#FDF4F7] rounded-full transition-all duration-300 group"
          >
            <ShoppingBag size={22} className="text-[#5E548E] group-hover:text-[#9F86C0]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#9F86C0] text-white text-xs font-lato font-medium w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
