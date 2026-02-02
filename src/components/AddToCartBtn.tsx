"use client"; // 👈 Esto permite la interactividad
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { Product } from "@/lib/ventify";

export default function AddToCartBtn({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const hasStock = product.stock > 0;

  const handleAddToCart = () => {
    if (!hasStock) return;
    addToCart(product);
    alert('¡Agregado al carrito! 💜');
  };

  return (
    <button
      disabled={!hasStock}
      onClick={handleAddToCart}
      className={`w-full py-4 px-8 rounded-xl flex items-center justify-center gap-2 text-lg font-medium transition-all ${
        hasStock
          ? "bg-[#9F86C0] text-white hover:bg-[#8A72B0] shadow-lg shadow-purple-100 hover:-translate-y-1"
          : "bg-gray-200 text-gray-400 cursor-not-allowed"
      }`}
    >
      <ShoppingCart className="w-5 h-5" />
      {hasStock ? "Añadir al Carrito ❤️" : "Agotado Temporalmente"}
    </button>
  );
}