'use client';

import Image from "next/image";
import { X, Plus, Minus, ChevronRight, Sparkles } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { getVentifyProducts, Product } from "@/lib/ventify";
import { useCart } from "@/context/CartContext";

const BRAND = {
  ink: '#2E2422',
  inkSoft: '#6B5D54',
  rose: '#B23A5C',
  roseDark: '#8F2C48',
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

export default function QuickViewDrawer({ product, onClose, onAddToCart }: QuickViewDrawerProps) {
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [availableExtras, setAvailableExtras] = useState<Product[]>([]);
  const drawerRef = useRef<HTMLDivElement>(null);
  const { items, addToCart, addExtraToItem, removeExtraFromItem, updateExtraQuantity } = useCart();

  useEffect(() => {
    requestAnimationFrame(() => setIsOpen(true));
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchExtras = async () => {
      const allProducts = await getVentifyProducts();
      const extras = allProducts.filter(p =>
        p.categoriaOriginal?.toLowerCase().includes('extras') ||
        p.sku.startsWith('Extra-')
      );
      setAvailableExtras(extras);
    };
    fetchExtras();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(onClose, 300);
  };

  const isSoldOut = product.stock === 0;
  const isAmigurumiOrCaja = product.sku.startsWith('Amigu-') || product.sku.startsWith('Caja-');
  const canAdd = !isSoldOut || isAmigurumiOrCaja;

  const handleAdd = () => {
    onAddToCart(product, quantity);
    handleClose();
  };

  const cartItem = items.find(i => i.id === product.id);

  const handleAddExtra = (extra: Product) => {
    if (!items.find(i => i.id === product.id)) {
      addToCart(product);
    }
    addExtraToItem(product.id, extra);
  };

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

  const ExtraOptionCard = ({ extra }: { extra: Product }) => {
    const extraInCart = cartItem?.extras?.find((e: any) => e.id === extra.id);
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
            <button
              onClick={() => handleAddExtra(extra)}
              disabled={extra.stock === 0}
              className={`p-1.5 rounded-full transition-colors ${extra.stock === 0 ? 'bg-gray-100 text-gray-300' : 'bg-[#FDE8EF] text-[#C04267] hover:bg-[#EE6B8D] hover:text-white'}`}
            >
              <Plus size={16} />
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-white border border-[#EE6B8D] rounded-full p-1 shadow-sm">
              <button
                onClick={() => updateExtraQuantity(product.id, extra.id, qty - 1)}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600"
              >
                <Minus size={12} />
              </button>
              <span className="font-lato text-[10px] font-bold w-2 text-center">{qty}</span>
              <button
                onClick={() => updateExtraQuantity(product.id, extra.id, qty + 1)}
                className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#C04267]"
              >
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
        className={`fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
        onClick={handleClose}
      />

      <div
        ref={drawerRef}
        className={`fixed top-0 left-0 z-[70] h-full w-full sm:w-[720px] md:w-[860px] lg:w-[960px] bg-white shadow-2xl transition-transform duration-300 ease-out flex flex-col sm:flex-row ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* ===== LEFT: Photo (desktop only) ===== */}
        <div className="hidden sm:block sm:w-1/2 relative bg-[#F3EFE9]">
          <Image
            src={product.imagen}
            alt={product.nombre}
            fill
            className="object-cover"
            sizes="360px"
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
        <div className="flex-1 flex flex-col min-w-0">
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-[#2E2422]" />
          </button>

          {/* Mobile photo (sm only) */}
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

          {/* Scrollable content — sin scrollbar visible */}
          <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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
                {product.descripcion || 'Producto artesanal tejido a mano con amor'}
              </p>

              <div className="flex items-baseline gap-3 mb-6">
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

            {/* Extras */}
            {availableExtras.length > 0 && (
              <div className="px-6 pb-4">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} style={{ color: '#EE6B8D' }} />
                  <span className="font-lato text-sm font-semibold" style={{ color: BRAND.ink }}>
                    Personaliza tu regalo
                  </span>
                </div>

                <div className="space-y-4">
                  {extrasLucesGlobos.length > 0 && (
                    <div>
                      <h4 className="font-lato font-bold text-gray-700 uppercase tracking-wider text-xs mb-3">🌟 Luces & Globos</h4>
                      <div className="space-y-2">
                        {extrasLucesGlobos.map(extra => <ExtraOptionCard key={extra.id} extra={extra} />)}
                      </div>
                    </div>
                  )}

                  {extrasDulces.length > 0 && (
                    <div>
                      <h4 className="font-lato font-bold text-gray-700 uppercase tracking-wider text-xs mb-3">🍫 Chocolates & Dulces</h4>
                      <div className="space-y-2">
                        {extrasDulces.map(extra => <ExtraOptionCard key={extra.id} extra={extra} />)}
                      </div>
                    </div>
                  )}

                  {extrasFlores.length > 0 && (
                    <div>
                      <h4 className="font-lato font-bold text-gray-700 uppercase tracking-wider text-xs mb-3">💐 Flores Adicionales</h4>
                      <div className="space-y-2">
                        {extrasFlores.map(extra => <ExtraOptionCard key={extra.id} extra={extra} />)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="h-4" />
          </div>

          {/* Sticky Bottom Bar */}
          <div className="sticky bottom-0 left-0 right-0 bg-white border-t px-6 py-4" style={{ borderColor: BRAND.line }}>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-full" style={{ borderColor: BRAND.line }}>
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-l-full transition-colors"
                  disabled={quantity <= 1}
                >
                  <Minus size={16} className={quantity <= 1 ? 'text-gray-300' : ''} style={{ color: quantity <= 1 ? undefined : BRAND.ink }} />
                </button>
                <span className="w-12 text-center font-lato text-base font-semibold" style={{ color: BRAND.ink }}>
                  {String(quantity).padStart(2, '0')}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 rounded-r-full transition-colors"
                >
                  <Plus size={16} style={{ color: BRAND.ink }} />
                </button>
              </div>

              <button
                onClick={handleAdd}
                disabled={!canAdd}
                className="flex-1 font-lato text-sm font-semibold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
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
                {canAdd && !isSoldOut && <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
