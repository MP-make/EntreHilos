"use client"; //  Esto permite la interactividad
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/ventify";
import { useToast } from "@/components/Toast";

export default function AddToCartBtn({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const hasStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!hasStock) return;
    addToCart(product);
    showToast("¡Agregado al carrito!", "success");
  };

  return (
    <button
      disabled={!hasStock}
      onClick={handleAddToCart}
      className={`w-full py-3.5 px-8 rounded-full flex items-center justify-center gap-2 font-lato font-semibold text-sm tracking-wide transition-all ${
        hasStock
          ? "bg-[#EE6B8D] text-white hover:bg-[#C04267] shadow-lg shadow-[#EE6B8D]/20 hover:-translate-y-1"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
      }`}
    >
      <ShoppingCart className="w-5 h-5" />
      {hasStock ? "Añadir al Carrito " : "Agotado Temporalmente"}
    </button>
  );
}