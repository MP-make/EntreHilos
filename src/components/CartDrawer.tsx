'use client';

import Image from "next/image";
import Link from "next/link";
import { X, Plus, Minus, Trash2, ShoppingBag, Gift, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/ventify";
import { loadExtras } from "@/lib/extras-cache";

const BRAND = {
  ink: '#2E2422',
  inkSoft: '#6B5D54',
  rose: '#B23A5C',
  roseDark: '#8F2C48',
  roseSoft: '#F3E1E6',
  clay: '#C97B4A',
  line: '#EDE4D9',
};

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const [animate, setAnimate] = useState(false);
  const [availableExtras, setAvailableExtras] = useState<Product[]>([]);
  const [activeItemForExtras, setActiveItemForExtras] = useState<string | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { items, removeFromCart, updateQuantity, totalPrice, addExtraToItem, removeExtraFromItem, updateExtraQuantity } = useCart();

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setAnimate(true));
    } else {
      setAnimate(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    if (isOpen) loadExtras(setAvailableExtras);
  }, [isOpen]);

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

  const HandleClose = () => {
    setAnimate(false);
    setTimeout(onClose, 300);
  };

  const totalExtrasPrice = items.reduce((sum, item) =>
    sum + (item.extras?.reduce((eSum, e) => eSum + (e.precio * e.cantidad), 0) || 0), 0
  );

  const ExtrasModal = () => {
    if (!activeItemForExtras) return null;
    const currentItem = items.find(i => i.id === activeItemForExtras);
    if (!currentItem) return null;

    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-md p-4" onClick={() => setActiveItemForExtras(null)}>
        <div className="bg-white rounded-2xl w-full max-w-lg max-h-[80vh] overflow-hidden flex flex-col shadow-2xl" onClick={e => e.stopPropagation()}>
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-lato text-lg font-semibold" style={{ color: BRAND.roseDark }}>
              Personaliza tu regalo
            </h3>
            <button onClick={() => setActiveItemForExtras(null)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <X size={20} className="text-gray-400" />
            </button>
          </div>

          <div className="overflow-y-auto p-4 space-y-4">
            {extrasLucesGlobos.length > 0 && (
              <div>
                <h4 className="font-lato font-bold text-gray-700 uppercase tracking-wider text-xs mb-3">Luces & Globos</h4>
                <div className="space-y-2">
                  {extrasLucesGlobos.map(extra => <ExtraOption key={extra.id} extra={extra} currentItem={currentItem} />)}
                </div>
              </div>
            )}
            {extrasDulces.length > 0 && (
              <div>
                <h4 className="font-lato font-bold text-gray-700 uppercase tracking-wider text-xs mb-3">Chocolates & Dulces</h4>
                <div className="space-y-2">
                  {extrasDulces.map(extra => <ExtraOption key={extra.id} extra={extra} currentItem={currentItem} />)}
                </div>
              </div>
            )}
            {extrasFlores.length > 0 && (
              <div>
                <h4 className="font-lato font-bold text-gray-700 uppercase tracking-wider text-xs mb-3">Flores Adicionales</h4>
                <div className="space-y-2">
                  {extrasFlores.map(extra => <ExtraOption key={extra.id} extra={extra} currentItem={currentItem} />)}
                </div>
              </div>
            )}
            {availableExtras.length === 0 && (
              <p className="text-center text-gray-500 font-lato italic py-8">Cargando opciones de personalizaci&oacute;n...</p>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-white">
            <button onClick={() => setActiveItemForExtras(null)} className="w-full py-3 rounded-full font-lato font-semibold text-white transition-colors" style={{ backgroundColor: '#EE6B8D' }}>
              Listo, guardar cambios
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ExtraOption = ({ extra, currentItem }: { extra: Product; currentItem: any }) => {
    const extraInCart = currentItem.extras?.find((e: any) => e.id === extra.id);
    const qty = extraInCart ? extraInCart.cantidad : 0;

    return (
      <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${qty > 0 ? 'border-[#EE6B8D] bg-[#FDE8EF]/30' : 'border-gray-200 bg-white hover:border-[#EE6B8D]/50'}`}>
        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image src={extra.imagen} alt={extra.nombre} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-lato text-xs font-semibold text-gray-800 truncate">{extra.nombre}</p>
          <p className="font-lato text-xs font-medium" style={{ color: '#EE6B8D' }}>S/ {extra.precio.toFixed(2)}</p>
        </div>
        <div className="flex flex-col items-center">
          {qty === 0 ? (
            <button onClick={() => addExtraToItem(currentItem.id, extra)} disabled={extra.stock === 0}
              className={`p-1.5 rounded-full transition-colors ${extra.stock === 0 ? 'bg-gray-100 text-gray-300' : 'bg-[#FDE8EF] text-[#C04267] hover:bg-[#EE6B8D] hover:text-white'}`}>
              <Plus size={16} />
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-white border border-[#EE6B8D] rounded-full p-1 shadow-sm">
              <button onClick={() => updateExtraQuantity(currentItem.id, extra.id, qty - 1)} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">
                <Minus size={12} />
              </button>
              <span className="font-lato text-[10px] font-bold w-2 text-center">{qty}</span>
              <button onClick={() => updateExtraQuantity(currentItem.id, extra.id, qty + 1)} className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#C04267]">
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 z-[80] bg-black/40 backdrop-blur-md transition-opacity duration-300 ${
          animate ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={HandleClose}
      />

      <div
        ref={drawerRef}
        className={`fixed top-0 right-0 z-[90] h-full w-full sm:w-[420px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col ${
          animate ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: BRAND.line }}>
          <div className="flex items-center gap-2">
            <ShoppingBag size={20} style={{ color: '#EE6B8D' }} />
            <span className="font-lato text-base font-semibold" style={{ color: BRAND.ink }}>
              Tu Carrito
            </span>
            {items.length > 0 && (
              <span className="font-lato text-xs px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#EE6B8D' }}>
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </div>
          <button onClick={HandleClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} style={{ color: BRAND.inkSoft }} />
          </button>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className="flex-1 flex items-center justify-center px-6">
            <div className="text-center">
              <ShoppingBag size={48} className="mx-auto mb-4 opacity-30" style={{ color: BRAND.inkSoft }} />
              <p className="font-lato text-base font-medium mb-2" style={{ color: BRAND.ink }}>Tu carrito est&aacute; vac&iacute;o</p>
              <p className="font-lato text-sm" style={{ color: BRAND.inkSoft }}>Agrega productos para empezar</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              <div className="px-6 py-4 space-y-4">
                {items.map(item => {
                  const itemExtrasPrice = item.extras?.reduce((s, e) => s + (e.precio * e.cantidad), 0) || 0;

                  return (
                    <div key={item.id} className="border rounded-xl p-3" style={{ borderColor: BRAND.line }}>
                      <div className="flex gap-3">
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image src={item.imagen} alt={item.nombre} fill className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-lato text-sm font-semibold truncate pr-2" style={{ color: BRAND.ink }}>
                              {item.nombre}
                            </h4>
                            <button onClick={() => removeFromCart(item.id)} className="p-0.5 text-gray-400 hover:text-red-500 transition-colors shrink-0">
                              <Trash2 size={14} />
                            </button>
                          </div>
                          <p className="font-lato text-xs mt-0.5" style={{ color: BRAND.inkSoft }}>
                            S/ {item.precio.toFixed(2)} c/u
                          </p>

                          {/* Quantity controls */}
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center border rounded-lg" style={{ borderColor: BRAND.line }}>
                              <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}
                                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-800 disabled:opacity-30">
                                <Minus size={12} />
                              </button>
                              <span className="font-lato text-xs font-bold w-6 text-center" style={{ color: BRAND.ink }}>
                                {item.quantity}
                              </span>
                              <button onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                disabled={!item.sku.startsWith('Amigu-') && !item.sku.startsWith('Caja-') && item.quantity >= item.stock}
                                className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-gray-800 disabled:opacity-30">
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="font-lato text-sm font-semibold" style={{ color: '#EE6B8D' }}>
                              S/ {(item.precio * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Extras section */}
                      <div className="mt-2 pt-2 border-t" style={{ borderColor: BRAND.line }}>
                        <div className="flex items-center justify-between">
                          <span className="font-lato text-[10px] uppercase tracking-wider" style={{ color: BRAND.inkSoft }}>
                            <Gift size={12} className="inline mr-1" style={{ color: '#EE6B8D' }} />
                            Detalles adicionales
                          </span>
                          <button onClick={() => setActiveItemForExtras(item.id)}
                            className="text-[10px] font-semibold uppercase tracking-wide flex items-center gap-0.5 px-2 py-0.5 rounded border"
                            style={{ color: '#C04267', borderColor: BRAND.line }}>
                            Personalizar <ChevronRight size={10} />
                          </button>
                        </div>
                        {item.extras && item.extras.length > 0 ? (
                          <div className="mt-1.5 space-y-1">
                            {item.extras.map(extra => (
                              <div key={extra.id} className="flex justify-between items-center text-xs font-lato">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-1 py-0.5 rounded text-[10px] font-bold" style={{ backgroundColor: BRAND.roseSoft, color: BRAND.roseDark }}>
                                    {extra.cantidad}x
                                  </span>
                                  <span className="text-gray-700 truncate max-w-[150px]">{extra.nombre}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-gray-500">S/ {(extra.precio * extra.cantidad).toFixed(2)}</span>
                                  <button onClick={() => removeExtraFromItem(item.id, extra.id)} className="text-gray-400 hover:text-red-500 p-0.5">
                                    <X size={12} />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[10px] text-gray-400 italic mt-1 font-lato">Agrega luces, chocolates o tarjetas a este detalle.</p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="h-4" />
            </div>

            {/* Bottom bar */}
            <div className="border-t px-6 py-4 space-y-3" style={{ borderColor: BRAND.line, backgroundColor: '#FBF6EF' }}>
              <div className="flex justify-between items-center">
                <span className="font-lato text-sm font-medium" style={{ color: BRAND.ink }}>Subtotal</span>
                <span className="font-lato text-base font-bold" style={{ color: BRAND.roseDark }}>
                  S/ {(totalPrice - totalExtrasPrice).toFixed(2)}
                </span>
              </div>
              {totalExtrasPrice > 0 && (
                <div className="flex justify-between items-center text-sm">
                  <span className="font-lato text-xs" style={{ color: BRAND.inkSoft }}>Adicionales (Extras)</span>
                  <span className="font-lato text-xs font-medium" style={{ color: BRAND.ink }}>
                    S/ {totalExtrasPrice.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="font-lato text-sm font-medium" style={{ color: BRAND.ink }}>Total</span>
                <span className="font-lato text-lg font-bold" style={{ color: '#EE6B8D' }}>
                  S/ {totalPrice.toFixed(2)}
                </span>
              </div>

              <Link
                href="/checkout"
                onClick={HandleClose}
                className="block w-full text-center font-lato text-sm font-semibold py-3.5 rounded-full text-white transition-all shadow-md hover:shadow-lg"
                style={{ backgroundColor: '#EE6B8D' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#C04267'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#EE6B8D'}
              >
                Ir a Checkout
              </Link>
            </div>
          </>
        )}
      </div>

      <ExtrasModal />
    </>
  );
}
