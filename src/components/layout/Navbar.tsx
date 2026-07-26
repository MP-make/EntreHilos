'use client';

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Truck, Clock, Menu, X, ChevronDown, User, LogIn, UserPlus, UserCircle, Package, Bell, LogOut } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useState, useEffect, useRef } from "react";
import SearchModal from "@/components/SearchModal";
import QuickViewDrawer from "@/components/QuickViewDrawer";
import CartDrawer from "@/components/CartDrawer";
import AuthModal from "@/components/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { getVentifyProducts } from "@/lib/ventify";
import { Product } from "@/lib/ventify";

const categorias = [
  { href: "/category/ramos", label: "Ramos" },
  { href: "/category/amigurumis", label: "Amigurumis" },
  { href: "/category/cajas", label: "Cajas" },
  { href: "/category/hotwheels", label: "HotWheels" },
];

const eventos = [
  { href: "/evento/dia-de-la-madre", label: "Día de la Madre" },
  { href: "/evento/dia-de-la-mujer", label: "Día de la Mujer" },
  { href: "/evento/san-valentin", label: "San Valentín" },
  { href: "/evento/flores-amarillas", label: "Flores Amarillas" },
];

interface DropdownProps {
  label: string;
  items: { href: string; label: string }[];
}

function Dropdown({ label, items }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 font-lato text-sm xl:text-base font-medium tracking-wide text-[#5C4040] hover:text-[#EE6B8D] transition-colors duration-200 cursor-pointer"
      >
        {label}
        <ChevronDown size={14} className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-[100] animate-fadeIn"
          onClick={() => setOpen(false)}
        >
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-5 py-2.5 font-lato text-sm text-gray-700 hover:text-[#EE6B8D] hover:bg-[#FDF4F7] transition-colors cursor-pointer"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  const { totalItems } = useCart();
  const { user, signOut } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [authView, setAuthView] = useState<"login" | "register">("login");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
  };

  useEffect(() => {
    const loadProducts = async () => {
      const allProducts = await getVentifyProducts();
      setProducts(allProducts);
    };
    loadProducts();
  }, []);

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

  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isUserOpen, setIsUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-[#ec4899] text-white py-2 sm:py-2.5 px-2 sm:px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="font-lato text-xs sm:text-sm md:text-base font-semibold tracking-wide">
             ¡Campaña Día de la Novia! Reserva el regalo perfecto para el amor de tu vida 
          </p>
        </div>
      </div>

      <nav className="sticky top-0 z-50">
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

        <div className="bg-white/95 backdrop-blur-sm shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-5">
            <div className="flex items-center justify-between w-full">
              <Link href="/" className="flex-shrink-0 group">
                <Image 
                  src="/logo.png" 
                  alt="Entre Hilos Logo" 
                  width={56} 
                  height={56}
                  className="w-12 h-12 sm:w-[56px] sm:h-[56px] md:w-[70px] md:h-[70px] object-contain rounded-full group-hover:scale-105 transition-transform duration-300"
                />
              </Link>

              <div className="flex lg:hidden flex-1 justify-center px-1">
                <Link 
                  href="/evento/dia-de-la-novia"
                  className="font-playfair text-base sm:text-lg font-medium text-[#C04267] border-b border-[#C04267]/30 pb-0.5 hover:text-[#EE6B8D] transition-colors whitespace-nowrap"
                >
                  Día de la Novia
                </Link>
              </div>

              <div className="hidden lg:flex items-center gap-5 xl:gap-7">
                <Link 
                  href="/"
                  className="font-lato text-sm xl:text-base font-medium tracking-wide text-[#5C4040] hover:text-[#EE6B8D] transition-colors duration-200"
                >
                  Inicio
                </Link>

                <Link 
                  href="/evento/dia-de-la-novia"
                  className="font-lato text-sm xl:text-base font-medium tracking-wide text-[#C04267] hover:text-[#EE6B8D] transition-colors duration-200 font-semibold"
                >
                  Día de la Novia
                </Link>

                <Dropdown label="Categorías" items={categorias} />
                <Dropdown label="Eventos" items={eventos} />

                <Link 
                  href="/personalizados"
                  className="font-lato text-sm xl:text-base font-medium tracking-wide text-[#5C4040] hover:text-[#EE6B8D] transition-colors duration-200"
                >
                  Personalizados
                </Link>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                  aria-label="Buscar productos"
                >
                  <Search size={20} className="sm:w-5 sm:h-5 text-[#5C4040]" />
                </button>

                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative p-1.5 sm:p-2 hover:bg-[#FDF4F7] rounded-full transition-all duration-300 group"
                >
                  <ShoppingBag size={22} className="sm:w-[22px] sm:h-[22px] text-[#C04267] group-hover:text-[#EE6B8D]" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-[#E91E63] text-white text-[10px] sm:text-xs font-lato font-bold w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-md">
                      {totalItems}
                    </span>
                  )}
                </button>

                {/* Dropdown Usuario */}
                <div ref={userRef} className="relative hidden sm:inline-block">
                  <button
                    onClick={() => setIsUserOpen(!isUserOpen)}
                    className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Usuario"
                  >
                    <User size={20} className="sm:w-5 sm:h-5 text-[#5C4040] hover:text-[#EE6B8D] transition-colors" />
                  </button>
                  <div
                    className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-[100] transition-all duration-200 ${
                      isUserOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
                  >
                    {user ? (
                      <>
                        <Link
                          href="/perfil"
                          onClick={() => setIsUserOpen(false)}
                          className="flex items-center gap-3 w-full px-5 py-2.5 font-quicksand text-sm text-gray-700 hover:text-[#EE6B8D] hover:bg-[#FDF4F7] transition-colors text-left"
                        >
                          <UserCircle size={16} />
                          Mi perfil
                        </Link>
                        <hr className="my-1 border-gray-100" />
                        <button
                          onClick={() => { setIsUserOpen(false); signOut(); }}
                          className="flex items-center gap-3 w-full px-5 py-2.5 font-quicksand text-sm text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut size={16} />
                          Cerrar sesión
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setIsUserOpen(false); setAuthView("login"); setIsAuthOpen(true); }}
                          className="flex items-center gap-3 w-full px-5 py-2.5 font-quicksand text-sm text-gray-700 hover:text-[#EE6B8D] hover:bg-[#FDF4F7] transition-colors text-left"
                        >
                          <LogIn size={16} />
                          Iniciar sesión
                        </button>
                        <button
                          onClick={() => { setIsUserOpen(false); setAuthView("register"); setIsAuthOpen(true); }}
                          className="flex items-center gap-3 w-full px-5 py-2.5 font-quicksand text-sm text-gray-700 hover:text-[#EE6B8D] hover:bg-[#FDF4F7] transition-colors text-left"
                        >
                          <UserPlus size={16} />
                          Registrarse
                        </button>
                      </>
                    )}
                  </div>
                </div>

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

      <div 
        className={`fixed inset-0 z-[60] lg:hidden transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div 
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
        
        <div 
          className={`absolute top-0 right-0 h-full w-[280px] sm:w-[320px] bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="bg-gradient-to-r from-[#EE6B8D] to-[#F48FB0] p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-playfair text-xl font-bold text-white">Menú</h2>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Cerrar menú"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
          </div>

          <nav className="py-4 overflow-y-auto max-h-[calc(100vh-120px)]">
            <Link
              href="/"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-6 py-3.5 font-lato text-base text-gray-700 border-l-4 border-transparent hover:border-[#EE6B8D] hover:bg-[#FDF4F7] hover:text-[#C04267] transition-all"
            >
              Inicio
            </Link>

            <div>
              <button
                onClick={() => setMobileExpanded(mobileExpanded === 'categorias' ? null : 'categorias')}
                className="flex items-center justify-between w-full px-6 py-3.5 font-lato text-base text-gray-700 border-l-4 border-transparent hover:border-[#EE6B8D] hover:bg-[#FDF4F7] hover:text-[#C04267] transition-all"
              >
                Categorías
                <ChevronDown size={16} className={`transition-transform ${mobileExpanded === 'categorias' ? 'rotate-180' : ''}`} />
              </button>
              {mobileExpanded === 'categorias' && (
                <div className="bg-gray-50">
                  {categorias.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-10 py-3 font-lato text-sm text-gray-600 hover:text-[#EE6B8D] hover:bg-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div>
              <button
                onClick={() => setMobileExpanded(mobileExpanded === 'eventos' ? null : 'eventos')}
                className="flex items-center justify-between w-full px-6 py-3.5 font-lato text-base text-gray-700 border-l-4 border-transparent hover:border-[#EE6B8D] hover:bg-[#FDF4F7] hover:text-[#C04267] transition-all"
              >
                Eventos
                <ChevronDown size={16} className={`transition-transform ${mobileExpanded === 'eventos' ? 'rotate-180' : ''}`} />
              </button>
              {mobileExpanded === 'eventos' && (
                <div className="bg-gray-50">
                  {eventos.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-10 py-3 font-lato text-sm text-gray-600 hover:text-[#EE6B8D] hover:bg-white transition-colors"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/personalizados"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-6 py-3.5 font-lato text-base text-gray-700 border-l-4 border-transparent hover:border-[#EE6B8D] hover:bg-[#FDF4F7] hover:text-[#C04267] transition-all"
            >
              Personalizados
            </Link>

            <Link
              href="/evento/dia-de-la-novia"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block px-6 py-3.5 font-lato text-base text-[#E91E63] font-bold border-l-4 border-[#E91E63] bg-pink-50 hover:bg-pink-100 transition-all"
            >
              Día de la Novia
            </Link>

            {user ? (
              <>
                <Link
                  href="/perfil"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-6 py-3.5 font-lato text-base text-gray-700 border-l-4 border-transparent hover:border-[#EE6B8D] hover:bg-[#FDF4F7] hover:text-[#C04267] transition-all w-full text-left"
                >
                  <UserCircle size={18} />
                  Mi cuenta
                </Link>
                <hr className="mx-6 my-1 border-gray-200" />
                <button
                  onClick={() => { setIsMobileMenuOpen(false); signOut(); }}
                  className="flex items-center gap-2 px-6 py-3.5 font-lato text-base text-red-500 border-l-4 border-transparent hover:border-red-400 hover:bg-red-50 transition-all w-full text-left"
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setAuthView("login"); setIsAuthOpen(true); }}
                  className="flex items-center gap-2 px-6 py-3.5 font-lato text-base text-gray-700 border-l-4 border-transparent hover:border-[#EE6B8D] hover:bg-[#FDF4F7] hover:text-[#C04267] transition-all w-full text-left"
                >
                  <LogIn size={18} />
                  Iniciar sesión
                </button>
                <button
                  onClick={() => { setIsMobileMenuOpen(false); setAuthView("register"); setIsAuthOpen(true); }}
                  className="flex items-center gap-2 px-6 py-3.5 font-lato text-base text-gray-700 border-l-4 border-transparent hover:border-[#EE6B8D] hover:bg-[#FDF4F7] hover:text-[#C04267] transition-all w-full text-left"
                >
                  <UserPlus size={18} />
                  Registrarse
                </button>
              </>
            )}
          </nav>

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

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onProductClick={handleProductClick}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      />

      {selectedProduct && (
        <QuickViewDrawer
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}

      <AuthModal
        isOpen={isAuthOpen}
        initialView={authView}
        onClose={() => setIsAuthOpen(false)}
      />

      <style jsx>{`
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}
