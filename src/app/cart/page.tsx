"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();

  // Generar mensaje para WhatsApp
  const generateWhatsAppMessage = () => {
    if (items.length === 0) return "";

    let message = "¡Hola Entre Hilos! 💜 Quiero hacer el siguiente pedido:\n\n";
    
    items.forEach((item) => {
      message += `• ${item.quantity}x ${item.nombre} - S/ ${(item.precio * item.quantity).toFixed(2)}\n`;
    });
    
    message += `\n*Total: S/ ${totalPrice.toFixed(2)}*\n\n`;
    message += "¿Podrían confirmarme la disponibilidad? Gracias 😊";
    
    return encodeURIComponent(message);
  };

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    
    const whatsappUrl = `https://wa.me/51927005798?text=${generateWhatsAppMessage()}`;
    window.open(whatsappUrl, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF4F7] flex items-center justify-center">
        <div className="text-center py-16 px-4">
          <ShoppingBag size={64} className="mx-auto text-[#9F86C0] mb-4 opacity-50" />
          <h2 className="font-playfair text-3xl text-[#5E548E] mb-4">
            Tu carrito está vacío
          </h2>
          <p className="font-lato text-gray-600 mb-8">
            ¡Agrega productos y empieza a crear tu pedido! 💜
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#9F86C0] text-white px-8 py-3 rounded-xl hover:bg-[#8A72B0] transition-all font-lato font-medium"
          >
            <ArrowLeft size={20} />
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF4F7] py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#5E548E] hover:text-[#9F86C0] transition-colors font-lato"
          >
            <ArrowLeft size={20} />
            Seguir comprando
          </Link>
          <button
            onClick={clearCart}
            className="text-sm text-red-500 hover:text-red-700 font-lato underline"
          >
            Vaciar carrito
          </button>
        </div>

        <h1 className="font-playfair text-4xl text-[#5E548E] mb-8">
          Tu Carrito de Compras
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* COLUMNA IZQUIERDA: Productos */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm p-4 flex gap-4 items-center hover:shadow-md transition-shadow"
              >
                {/* Imagen */}
                <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                  <Image
                    src={item.imagen}
                    alt={item.nombre}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info del producto */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-playfair text-lg text-[#5E548E] mb-1 truncate">
                    {item.nombre}
                  </h3>
                  <p className="text-sm text-gray-500 mb-2">
                    S/ {item.precio.toFixed(2)} c/u
                  </p>
                  <p className="text-xs text-gray-400">
                    Stock disponible: {item.stock}
                  </p>
                </div>

                {/* Controles de cantidad */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="font-lato font-medium w-8 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.stock}
                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {/* Subtotal y eliminar */}
                <div className="text-right flex-shrink-0">
                  <p className="font-playfair text-xl text-[#9F86C0] font-medium mb-2">
                    S/ {(item.precio * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition-colors"
                    title="Eliminar producto"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* COLUMNA DERECHA: Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h2 className="font-playfair text-2xl text-[#5E548E] mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between font-lato text-gray-600">
                  <span>Subtotal</span>
                  <span>S/ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-lato text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">GRATIS</span>
                </div>
              </div>

              <div className="flex justify-between font-playfair text-xl text-[#5E548E] font-semibold mb-6">
                <span>Total</span>
                <span>S/ {totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#25D366] text-white py-4 rounded-xl font-lato font-medium text-lg hover:bg-[#20BD5A] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                <svg
                  className="w-6 h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Comprar por WhatsApp
              </button>

              <p className="text-xs text-gray-500 text-center mt-4 font-lato">
                Serás redirigido a WhatsApp para confirmar tu pedido
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}