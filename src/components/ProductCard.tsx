'use client';

import Image from "next/image";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/Toast";
import { slugify } from "@/lib/utils";

interface ProductCardProps {
  producto: any;
  onQuickView?: (producto: any) => void;
  accentColor?: string;
  accentHover?: string;
  priceColor?: string;
}

function getCategoryBySku(sku: string): string {
  if (sku.startsWith('Ramos-') || ['Caja-001', 'Caja-002', 'Caja-003'].includes(sku)) return 'San Valentín';
  if (['Caja-004', 'Caja-005', 'Cua-001', 'Carr-001'].includes(sku)) return 'Día HotWheels';
  if (sku.startsWith('Madre-')) return 'Día de la Madre';
  if (sku.startsWith('Mujer-')) return 'Día de la Mujer';
  if (sku.startsWith('Amigu-')) return 'Personalizados';
  return 'Otros';
}

export default function ProductCard({
  producto,
  onQuickView,
  accentColor = '#EE6B8D',
  accentHover = '#C04267',
  priceColor = '#8F2C48',
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { showToast } = useToast();

  const isAmigurumiOrCaja = producto.sku.startsWith('Amigu-') || producto.sku.startsWith('Caja-');
  const soldOut = producto.stock === 0;
  const lowStock = producto.stock > 0 && producto.stock <= 5;
  const category = getCategoryBySku(producto.sku);

  const stockLabel = soldOut
    ? (isAmigurumiOrCaja ? 'A pedido' : 'Agotado')
    : lowStock
      ? `Últimas ${producto.stock} unidades`
      : null;

  const disabled = soldOut && !isAmigurumiOrCaja;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (soldOut && isAmigurumiOrCaja) {
      if (onQuickView) {
        onQuickView(producto);
      }
      return;
    }
    if (soldOut) return;

    addToCart(producto);
    showToast("Agregado al carrito!", "success");
  };

  const handleClick = () => {
    if (onQuickView) {
      onQuickView(producto);
    }
  };

  const cardContent = (
    <>
      <div className={`relative aspect-[4/5] rounded-xl overflow-hidden bg-[#F3EFE9] ${disabled ? 'opacity-50' : ''}`}>
        <Image
          src={producto.imagen}
          alt={producto.nombre}
          fill
          className="object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          unoptimized
        />

        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center pointer-events-none">
          <span className="font-lato text-sm font-semibold text-white opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0 bg-white/20 backdrop-blur-sm px-5 py-2 rounded-full">
            ver más
          </span>
        </div>

        {stockLabel && (
          <span
            className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-lato font-medium bg-white/90 backdrop-blur-sm"
            style={{ color: soldOut ? '#6B5D54' : '#C99A3E' }}
          >
            {stockLabel}
          </span>
        )}
      </div>

      <div className="pt-3">
        <p className="font-lato text-[11px] uppercase tracking-[0.12em] mb-1" style={{ color: '#6B5D54' }}>
          {category}
        </p>

        <h3
          className="font-playfair text-[16px] sm:text-[17px] leading-snug font-medium mb-2 line-clamp-1"
          style={{ color: disabled ? '#6B5D54' : '#2E2422' }}
        >
          {producto.nombre}
        </h3>

        <div className="flex items-center justify-between gap-2">
          <span
            className="font-lato text-base font-semibold whitespace-nowrap"
            style={{ color: disabled ? '#6B5D54' : priceColor }}
          >
            S/ {producto.precio.toFixed(2)}
          </span>

          <button
            onClick={handleAddToCart}
            disabled={disabled}
            className="flex items-center gap-1 font-lato text-xs font-semibold pl-2.5 pr-3 py-1.5 rounded-full transition-colors shrink-0"
            style={{
              backgroundColor: disabled ? '#F1EAE2' : accentColor,
              color: disabled ? '#B8AC9F' : 'white',
              cursor: disabled ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = accentHover; }}
            onMouseLeave={(e) => { if (!disabled) e.currentTarget.style.backgroundColor = accentColor; }}
          >
            {!disabled && <Plus size={13} strokeWidth={2.5} />}
            {disabled ? 'Agotado' : soldOut ? 'Pedir' : 'Agregar'}
          </button>
        </div>
      </div>
    </>
  );

  if (onQuickView) {
    return (
      <div className="group cursor-pointer" onClick={handleClick}>
        {cardContent}
      </div>
    );
  }

  return (
    <Link href={`/product/${slugify(producto.nombre)}`} className="group block">
      {cardContent}
    </Link>
  );
}
