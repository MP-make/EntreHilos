"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, Clock, CreditCard, Gift, CheckCircle } from "lucide-react";

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
      <div className="min-h-screen bg-gradient-to-b from-[#FDF4F7] to-white flex items-center justify-center px-4">
        <div className="text-center py-8 sm:py-16">
          <ShoppingBag size={48} className="sm:w-16 sm:h-16 mx-auto text-[#9F86C0] mb-4 opacity-50" />
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl text-[#5E548E] mb-4">
            Tu carrito está vacío
          </h2>
          <p className="font-lato text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
            ¡Agrega productos y empieza a crear tu pedido! 💜
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#9F86C0] text-white px-6 sm:px-8 py-3 rounded-xl hover:bg-[#8A72B0] transition-all font-lato font-medium text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <ArrowLeft size={20} />
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF4F7] to-white py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#5E548E] hover:text-[#9F86C0] transition-colors font-lato text-sm sm:text-base"
          >
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            Seguir comprando
          </Link>
          <button
            onClick={clearCart}
            className="text-xs sm:text-sm text-red-500 hover:text-red-700 font-lato underline"
          >
            Vaciar carrito
          </button>
        </div>

        <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl text-[#5E548E] mb-6 sm:mb-8">
          Tu Carrito de Compras
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* COLUMNA IZQUIERDA: Productos */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm p-3 sm:p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-3 sm:gap-4 items-center">
                  {/* Imagen */}
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.imagen}
                      alt={item.nombre}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Info del producto - Layout responsivo */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-playfair text-sm sm:text-base md:text-lg text-[#5E548E] mb-1 line-clamp-2">
                      {item.nombre}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                      S/ {item.precio.toFixed(2)} c/u
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-400">
                      Stock disponible: {item.stock}
                    </p>

                    {/* Controles de cantidad - Mobile */}
                    <div className="flex items-center gap-2 mt-2 sm:hidden">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="font-lato font-medium text-sm w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        disabled={item.quantity >= item.stock}
                        className="p-1.5 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Plus size={14} />
                      </button>
                      <div className="ml-auto flex items-center gap-2">
                        <p className="font-playfair text-base text-[#9F86C0] font-medium">
                          S/ {(item.precio * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 p-1.5 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Controles de cantidad - Desktop */}
                  <div className="hidden sm:flex items-center gap-2 md:gap-3">
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

                  {/* Subtotal y eliminar - Desktop */}
                  <div className="hidden sm:block text-right flex-shrink-0">
                    <p className="font-playfair text-lg md:text-xl text-[#9F86C0] font-medium mb-2">
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
              </div>
            ))}
          </div>

          {/* COLUMNA DERECHA: Resumen */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="font-playfair text-xl sm:text-2xl text-[#5E548E] mb-4 sm:mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                <div className="flex justify-between font-lato text-sm sm:text-base text-gray-600">
                  <span>Subtotal</span>
                  <span>S/ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-lato text-sm sm:text-base text-gray-600">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">
                    {totalPrice >= 100 ? "GRATIS" : "Por coordinar"}
                  </span>
                </div>
              </div>

              <div className="flex justify-between font-playfair text-lg sm:text-xl text-[#5E548E] font-semibold mb-4 sm:mb-6">
                <span>Total</span>
                <span>S/ {totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#25D366] text-white py-3 sm:py-4 rounded-xl font-lato font-medium text-base sm:text-lg hover:bg-[#20BD5A] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 mb-3 sm:mb-4"
              >
                <svg
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Comprar por WhatsApp
              </button>

              <p className="text-[10px] sm:text-xs text-gray-500 text-center mb-4 sm:mb-6 font-lato leading-relaxed">
                Te redirigiremos a WhatsApp para finalizar tu pedido de forma segura
              </p>

              {/* Beneficios adicionales */}
              <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-t border-gray-200">
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="font-lato text-xs sm:text-sm text-gray-700">
                    Entrega en 24-48 horas
                  </p>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="font-lato text-xs sm:text-sm text-gray-700">
                    Pago contraentrega disponible
                  </p>
                </div>
                <div className="flex items-start gap-2 sm:gap-3">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="font-lato text-xs sm:text-sm text-gray-700">
                    Tarjeta personalizada incluida
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}