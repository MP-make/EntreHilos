"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/ventify";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/components/Toast";
import ProductCard from "@/components/ProductCard";
import QuickViewDrawer from "@/components/QuickViewDrawer";

const CATEGORIES = ["Todos", "Amigurumis", "Carritos"] as const;

function getCategory(sku: string) {
  if (sku.startsWith("Amigu-")) return "Amigurumis";
  if (sku.startsWith("Carr-")) return "Carritos";
  return null;
}

interface Props {
  products: Product[];
}

export default function Gallery({ products }: Props) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [active, setActive] = useState<(typeof CATEGORIES)[number]>("Todos");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    if (active === "Todos") return products;
    return products.filter((p) => getCategory(p.sku) === active);
  }, [products, active]);

  function handleQuickView(producto: any) {
    setSelectedProduct(producto);
  }

  function handleCloseDrawer() {
    setSelectedProduct(null);
  }

  function handleDrawerAddToCart(product: any, quantity: number) {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    showToast("Agregado al carrito — La entrega mínima es de 1 semana", "success");
    handleCloseDrawer();
  }

  return (
    <section id="galeria" className="py-20 bg-[#FDF4F7]">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="font-fredoka text-3xl md:text-4xl font-bold text-[#C04267] mb-3">
            Trabajos recientes
          </h2>
          <p className="font-quicksand text-base text-[#6B6B6B]">
            Inspírate con proyectos que ya hemos realizado
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActive(cat)}
              className={`font-quicksand text-sm px-5 py-2 rounded-full border transition-all ${
                active === cat
                  ? "bg-[#EE6B8D] border-[#EE6B8D] text-white font-semibold shadow-sm"
                  : "bg-white border-gray-200 text-[#6B6B6B] hover:border-[#EE6B8D] hover:text-[#C04267]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {filtered.slice(0, 9).map((producto) => (
              <ProductCard
                key={producto.id}
                producto={producto}
                onQuickView={handleQuickView}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#FDE8EF]">
            <p className="font-quicksand text-base text-[#6B6B6B]">
              {active === "Todos"
                ? "Galería próximamente"
                : `No hay ${active.toLowerCase()} disponibles aún`}
            </p>
          </div>
        )}
      </div>

      {selectedProduct && (
        <QuickViewDrawer
          product={selectedProduct}
          onClose={handleCloseDrawer}
          onAddToCart={handleDrawerAddToCart}
        />
      )}
    </section>
  );
}
