'use client';

import Image from "next/image";
import { X, Plus, Minus, ChevronRight, Sparkles, Ruler, Calendar } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Product } from "@/lib/ventify";
import { useCart } from "@/context/CartContext";

const TAMANOS = [
  { valor: "pequeno", label: "Pequeño", desc: "10–15 cm" },
  { valor: "mediano", label: "Mediano", desc: "16–25 cm" },
  { valor: "grande", label: "Grande", desc: "26 cm a más" },
];

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
}

interface LocalExtra {
  producto: Product;
  cantidad: number;
}

function cleanDescription(desc: string | undefined | null): string {
  if (!desc) return 'Producto artesanal tejido a mano con amor';
  const cleaned = desc.replace(/product image/i, '').trim();
  return cleaned || 'Producto artesanal tejido a mano con amor';
}

export default function QuickViewDrawer({ product, onClose }: QuickViewDrawerProps) {
  const [quantity, setQuantity] = useState(1);
  const [availableExtras, setAvailableExtras] = useState<Product[]>([]);
  const [localExtras, setLocalExtras] = useState<LocalExtra[]>([]);
  const [tamano, setTamano] = useState("mediano");
  const [fechaEntrega, setFechaEntrega] = useState("");
  const drawerRef = useRef<HTMLDivElement>(null);
  const { addToCart, removeFromCart, addExtraToItem } = useCart();

  const fechaMinima = (() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  })();

  useEffect(() => {
    if (!product) return;
    setQuantity(1);
    setTamano("mediano");
    setFechaEntrega("");
    setLocalExtras([]);
    (async () => {
      const { loadExtras } = await import("@/lib/extras-cache");
      loadExtras(setAvailableExtras);
    })();
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
  const canAdd = true;

  const extrasTotal = localExtras.reduce((sum, e) => sum + (e.producto.precio * e.cantidad), 0);
  const totalConExtras = (product.precio * quantity) + extrasTotal;

  const handleAddExtra = (extraProduct: Product) => {
    setLocalExtras(prev => {
      const existing = prev.find(e => e.producto.id === extraProduct.id);
      if (existing) {
        if (existing.cantidad >= extraProduct.stock) return prev;
        return prev.map(e =>
          e.producto.id === extraProduct.id ? { ...e, cantidad: e.cantidad + 1 } : e
        );
      }
      if (extraProduct.stock === 0) return prev;
      return [...prev, { producto: extraProduct, cantidad: 1 }];
    });
  };

  const handleRemoveExtra = (extraId: string) => {
    setLocalExtras(prev => {
      const existing = prev.find(e => e.producto.id === extraId);
      if (!existing) return prev;
      if (existing.cantidad <= 1) return prev.filter(e => e.producto.id !== extraId);
      return prev.map(e =>
        e.producto.id === extraId ? { ...e, cantidad: e.cantidad - 1 } : e
      );
    });
  };

  const handleAdd = () => {
    removeFromCart(product.id);
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    localExtras.forEach(extra => {
      for (let i = 0; i < extra.cantidad; i++) {
        addExtraToItem(product.id, extra.producto);
      }
    });
    handleClose();
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
            const localExtra = localExtras.find(e => e.producto.id === extra.id);
            const qty = localExtra ? localExtra.cantidad : 0;
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
                      <button onClick={() => handleRemoveExtra(extra.id)} className="flex-1 flex items-center justify-center text-gray-600">
                        <Minus size={11} />
                      </button>
                      <span className="font-lato text-[11px] font-bold text-center min-w-[16px]">{qty}</span>
                      <button onClick={() => handleAddExtra(extra)} className="flex-1 flex items-center justify-center text-[#C04267]">
                        <Plus size={11} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAddExtra(extra)}
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

          {product.stock === 0 && (
            <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-lato font-medium bg-white/90 backdrop-blur-sm shadow-sm" style={{ color: BRAND.clay }}>
              A pedido (1-2 semanas)
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

              {product.stock === 0 && (
                <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-lato font-medium bg-white/90 backdrop-blur-sm shadow-sm" style={{ color: BRAND.clay }}>
                  A pedido (1-2 semanas)
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
                {isSoldOut && (
                  <span className="font-lato text-sm font-medium" style={{ color: BRAND.clay }}>
                    A pedido (1-2 semanas)
                  </span>
                )}
              </div>
            </div>

            {/* Personalización para Amigurumis */}
            {product.sku.startsWith('Amigu-') && (
              <div className="px-6 pb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles size={16} style={{ color: '#EE6B8D' }} />
                  <span className="font-lato text-sm font-semibold" style={{ color: BRAND.ink }}>
                    Personaliza tu pedido
                  </span>
                </div>

                <div className="space-y-4">
                  {/* Tamaño */}
                  <div>
                    <label className="flex items-center gap-1.5 font-lato text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                      <Ruler size={14} />
                      Tamaño
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {TAMANOS.map((t) => (
                        <button
                          type="button"
                          key={t.valor}
                          onClick={() => setTamano(t.valor)}
                          className={`rounded-xl border-2 px-3 py-2.5 text-center transition-all ${
                            tamano === t.valor
                              ? "border-[#EE6B8D] bg-[#FDF4F7] shadow-sm"
                              : "border-gray-100 bg-white hover:border-gray-200"
                          }`}
                        >
                          <p className="font-quicksand text-sm font-bold text-[#4A4A4A]">{t.label}</p>
                          <p className="font-quicksand text-[11px] text-gray-400 mt-0.5">{t.desc}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Fecha de entrega */}
                  <div>
                    <label className="flex items-center gap-1.5 font-lato text-xs font-bold text-gray-700 uppercase tracking-wider mb-2.5">
                      <Calendar size={14} />
                      ¿Para cuándo lo quieres?
                    </label>
                    <input
                      type="date"
                      value={fechaEntrega}
                      min={fechaMinima}
                      onChange={(e) => setFechaEntrega(e.target.value)}
                      className="w-full rounded-lg border border-gray-200 px-4 py-2.5 font-quicksand text-sm text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] transition-shadow"
                    />
                    <p className="font-quicksand text-[11px] text-gray-400 mt-1">
                      Mínimo 1 semana de producción. Te confirmaremos la fecha exacta.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Extras — solo para productos no personalizados */}
            {!product.sku.startsWith('Amigu-') && availableExtras.length > 0 && (
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

            {/* Resumen de extras seleccionados */}
            {localExtras.length > 0 && (
              <div className="px-6 pb-4">
                <div className="bg-[#FDF4F7] rounded-xl p-4 border border-[#FDE8EF]">
                  <p className="font-lato text-xs font-bold text-[#C04267] uppercase tracking-wider mb-2">Extras seleccionados</p>
                  <div className="space-y-1.5">
                    {localExtras.map(e => (
                      <div key={e.producto.id} className="flex justify-between text-sm font-lato text-gray-700">
                        <span>{e.cantidad}x {e.producto.nombre}</span>
                        <span className="font-medium">S/ {(e.producto.precio * e.cantidad).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="h-4" />
          </div>

          {/* Sticky Bottom Bar */}
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
                {isSoldOut
                  ? 'Solicitar a pedido'
                  : `Agregar — S/ ${totalConExtras.toFixed(2)}`}
                {canAdd && !isSoldOut && <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
