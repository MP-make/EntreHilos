'use client';

import Image from "next/image";
import { X, Plus, Minus, ChevronRight, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Product } from "@/lib/ventify";
import { useCart } from "@/context/CartContext";
import { loadExtras } from "@/lib/extras-cache";

const BRAND = {
  ink: '#2E2422',
  inkSoft: '#6B5D54',
  rose: '#EE6B8D',
  roseDark: '#C04267',
  roseSoft: '#F3E1E6',
  clay: '#C97B4A',
  moss: '#6B7A5E',
  gold: '#C99A3E',
  goldSoft: '#F5E9CE',
  line: '#EDE4D9',
};

interface QuickViewDrawerProps {
  product: any;
  onClose: () => void;
  onAddToCart: (product: any, quantity: number) => void;
}

function cleanDescription(desc: string | undefined | null): string {
  if (!desc) return 'Producto artesanal tejido a mano con amor';
  const cleaned = desc.replace(/product image/i, '').trim();
  return cleaned || 'Producto artesanal tejido a mano con amor';
}

export default function QuickViewDrawer({ product, onClose, onAddToCart }: QuickViewDrawerProps) {
  const [quantity, setQuantity] = useState(1);
  const [availableExtras, setAvailableExtras] = useState<Product[]>([]);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { items, addToCart, addExtraToItem, removeExtraFromItem, updateExtraQuantity } = useCart();

  useEffect(() => {
    if (!product) return;
    setQuantity(1);
    loadExtras(setAvailableExtras);
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleClose = () => {
    onClose();
  };

  const isSoldOut = product.stock === 0;
  const isAmigurumiOrCaja = product.sku.startsWith('Amigu-') || product.sku.startsWith('Caja-');
  const canAdd = !isSoldOut || isAmigurumiOrCaja;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    handleClose();
  };

  const cartItem = items.find(i => i.id === product.id);

  const extrasLucesGlobos = availableExtras.filter(e =>
    !e.categoriaOriginal?.toLowerCase().includes('dulces') &&
    !e.categoriaOriginal?.toLowerCase().includes('flores')
  );
  const extrasDulces = availableExtras.filter(e =>
    e.categoriaOriginal?.toLowerCase().includes('dulces')
  );
  const extrasFlores = availableExtras.filter(e =>
    e.categoriaOriginal?.toLowerCase().includes('flores')
  );

  const ExtraCarousel = ({ items, title }: { items: Product[]; title: string }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (dir: 'left' | 'right') => {
      if (!scrollRef.current) return;
      const amount = 160;
      scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    };

    return (
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <h4 className="font-lato font-bold text-gray-700 uppercase tracking-wider text-xs">{title}</h4>
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => scroll('left')}
              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-500 transition-colors"
            >
              <ChevronRight size={12} className="rotate-180 text-gray-500" />
            </button>
            <button
              onClick={() => scroll('right')}
              className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center hover:border-gray-500 transition-colors"
            >
              <ChevronRight size={12} className="text-gray-500" />
            </button>
          </div>
        </div>
        <div
          ref={scrollRef}
          className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {items.map(extra => {
            const extraInCart = cartItem?.extras?.find((e: any) => e.id === extra.id);
            const qty = extraInCart ? extraInCart.cantidad : 0;
            const added = qty > 0;

            return (
              <div
                key={extra.id}
                className={`shrink-0 w-36 rounded-xl border overflow-hidden flex flex-col transition-all ${
                  added ? 'border-[#EE6B8D]' : 'border-gray-200 bg-white hover:border-[#EE6B8D]/50'
                }`}
              >
                <div className="relative aspect-[4/3] bg-[#F3EFE9]">
                  <Image
                    src={extra.imagen}
                    alt={extra.nombre}
                    fill
                    className="object-cover"
                    sizes="144px"
                  />
                </div>
                <div className="p-2.5 flex flex-col flex-1">
                  <p className="font-lato text-[11px] font-semibold text-gray-800 truncate leading-tight mb-2">{extra.nombre}</p>
                  {added ? (
                    <div className="flex items-center gap-1 bg-white border border-[#EE6B8D] rounded-lg py-1.5 mt-auto">
                      <button onClick={() => updateExtraQuantity(product.id, extra.id, qty - 1)} className="flex-1 flex items-center justify-center text-gray-600">
                        <Minus size={11} />
                      </button>
                      <span className="font-lato text-[11px] font-bold text-center min-w-[16px]">{qty}</span>
                      <button onClick={() => updateExtraQuantity(product.id, extra.id, qty + 1)} className="flex-1 flex items-center justify-center text-[#C04267]">
                        <Plus size={11} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!cartItem) {
                          addToCart(product);
                        }
                        addExtraToItem(product.id, extra);
                      }}
                      disabled={extra.stock === 0}
                      className="w-full font-lato text-[11px] font-semibold py-2 rounded-lg transition-all mt-auto flex items-center justify-center gap-1"
                      style={{
                        backgroundColor: extra.stock === 0 ? '#F1EAE2' : '#EE6B8D',
                        color: extra.stock === 0 ? '#B8AC9F' : 'white',
                        cursor: extra.stock === 0 ? 'not-allowed' : 'pointer',
                      }}
                      onMouseEnter={(e) => { if (extra.stock > 0) e.currentTarget.style.backgroundColor = '#C04267'; }}
                      onMouseLeave={(e) => { if (extra.stock > 0) e.currentTarget.style.backgroundColor = '#EE6B8D'; }}
                    >
                      + S/ {extra.precio.toFixed(2)}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
        onClick={handleClose}
      />

      <div
        ref={drawerRef}
        className="fixed top-0 left-0 z-[70] h-full w-full sm:w-[720px] md:w-[860px] lg:w-[960px] bg-white shadow-2xl flex flex-col sm:flex-row overflow-hidden animate-slide-in"
      >
        {/* ===== LEFT: Photo (desktop only) ===== */}
        <div className="hidden sm:block sm:w-1/2 relative bg-[#F3EFE9]">
          <Image
            src={product.imagen}
            alt={product.nombre}
            fill
            className="object-cover"
            sizes="480px"
            priority
          />

          {product.stock <= 5 && product.stock > 0 && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-lato font-medium bg-white/90 backdrop-blur-sm shadow-sm" style={{ color: BRAND.gold }}>
              Últimas {product.stock} unidades
            </span>
          )}

          {product.stock === 0 && isAmigurumiOrCaja && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-lato font-medium bg-white/90 backdrop-blur-sm shadow-sm" style={{ color: BRAND.clay }}>
              A pedido
            </span>
          )}
        </div>

        {/* ===== RIGHT: Content ===== */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-[#2E2422]" />
          </button>

          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {/* Mobile photo (sm only) — inside scrollable area */}
            <div className="sm:hidden relative aspect-square bg-[#F3EFE9]">
              <Image
                src={product.imagen}
                alt={product.nombre}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />

              {product.stock <= 5 && product.stock > 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-lato font-medium bg-white/90 backdrop-blur-sm shadow-sm" style={{ color: BRAND.gold }}>
                  Últimas {product.stock} unidades
                </span>
              )}

              {product.stock === 0 && isAmigurumiOrCaja && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-lato font-medium bg-white/90 backdrop-blur-sm shadow-sm" style={{ color: BRAND.clay }}>
                  A pedido
                </span>
              )}
            </div>

            <div className="px-6 pt-6 pb-4">
              <p className="font-lato text-xs uppercase tracking-[0.12em] mb-2" style={{ color: BRAND.inkSoft }}>
                {product.sku.startsWith('Ramos-') || ['Caja-001', 'Caja-002', 'Caja-003'].includes(product.sku) ? 'San Valentín'
                  : ['Caja-004', 'Caja-005', 'Cua-001', 'Carr-001'].includes(product.sku) ? 'Día HotWheels'
                  : product.sku.startsWith('Madre-') ? 'Día de la Madre'
                  : product.sku.startsWith('Amigu-') ? 'Personalizados'
                  : 'Otros'}
              </p>

              <h2 className="font-playfair text-xl sm:text-2xl font-semibold leading-snug mb-3" style={{ color: BRAND.ink }}>
                {product.nombre}
              </h2>

              <p className="font-lato text-sm leading-relaxed mb-6" style={{ color: BRAND.inkSoft }}>
                {cleanDescription(product.descripcion)}
              </p>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="font-playfair text-2xl font-bold" style={{ color: BRAND.rose }}>
                  S/ {product.precio.toFixed(2)}
                </span>
                {isSoldOut && isAmigurumiOrCaja && (
                  <span className="font-lato text-sm font-medium" style={{ color: BRAND.clay }}>
                    A pedido (1-2 semanas)
                  </span>
                )}
              </div>
            </div>

            {/* Extras — horizontal carrusel compacto */}
            {availableExtras.length > 0 && (
              <div className="px-6 pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} style={{ color: '#EE6B8D' }} />
                  <span className="font-lato text-sm font-semibold" style={{ color: BRAND.ink }}>
                    Personaliza tu regalo
                  </span>
                </div>

                <div className="space-y-4">
                  {extrasLucesGlobos.length > 0 && (
                    <ExtraCarousel items={extrasLucesGlobos} title=" Luces & Globos" />
                  )}
                  {extrasDulces.length > 0 && (
                    <ExtraCarousel items={extrasDulces} title=" Chocolates & Dulces" />
                  )}
                  {extrasFlores.length > 0 && (
                    <ExtraCarousel items={extrasFlores} title=" Flores Adicionales" />
                  )}
                </div>
              </div>
            )}

            <div className="h-4" />
          </div>

          {/* Sticky Bottom Bar — mejorada */}
          <div className="sticky bottom-0 left-0 right-0 bg-gradient-to-b from-white to-gray-50/80 border-t-2 border-dashed px-6 py-5" style={{ borderColor: BRAND.line }}>
            <div className="flex items-center gap-4">
              <div className="flex items-center border-2 rounded-full" style={{ borderColor: BRAND.line }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 rounded-l-full transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} className={quantity <= 1 ? 'text-gray-300' : ''} style={{ color: quantity <= 1 ? undefined : BRAND.ink }} />
                </button>
                <span className="w-12 text-center font-lato text-base font-semibold" style={{ color: BRAND.ink }}>
                  {String(quantity).padStart(2, '0')}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-11 h-11 flex items-center justify-center hover:bg-gray-50 rounded-r-full transition-colors"
                >
                  <Plus size={16} style={{ color: BRAND.ink }} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={!canAdd}
                className="flex-1 font-lato text-sm font-semibold py-3.5 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                style={{
                  backgroundColor: canAdd ? '#EE6B8D' : '#F1EAE2',
                  color: canAdd ? 'white' : '#B8AC9F',
                  cursor: canAdd ? 'pointer' : 'not-allowed',
                }}
                onMouseEnter={(e) => { if (canAdd) e.currentTarget.style.backgroundColor = '#C04267'; }}
                onMouseLeave={(e) => { if (canAdd) e.currentTarget.style.backgroundColor = '#EE6B8D'; }}
              >
                {isSoldOut && !isAmigurumiOrCaja
                  ? 'Agotado'
                  : isSoldOut && isAmigurumiOrCaja
                    ? 'Solicitar a pedido'
                    : `Agregar — S/ ${(product.precio * quantity).toFixed(2)}`}
                {canAdd && !isSoldOut && <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
