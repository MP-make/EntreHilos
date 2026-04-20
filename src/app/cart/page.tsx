"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, CheckCircle, Sparkles, ChevronRight, X, Gift } from "lucide-react";
import { useState, useEffect } from "react";
import { getVentifyProducts, Product } from "@/lib/ventify";

export default function CartPage() {
  const { 
    items, 
    removeFromCart, 
    updateQuantity, 
    totalPrice, 
    clearCart,
    getWhatsAppMessage,
    addExtraToItem,
    removeExtraFromItem,
    updateExtraQuantity
  } = useCart();

  const [availableExtras, setAvailableExtras] = useState<Product[]>([]);
  const [activeItemForExtras, setActiveItemForExtras] = useState<string | null>(null);

  // Cargar productos de Ventify y filtrar solo los que son extras
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

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    const whatsappUrl = `https://wa.me/51902578295?text=${getWhatsAppMessage()}`;
    window.open(whatsappUrl, "_blank");
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDF4F7] to-white flex items-center justify-center px-4">
        <div className="text-center py-8 sm:py-16">
          <ShoppingBag size={48} className="sm:w-16 sm:h-16 mx-auto text-[#EE6B8D] mb-4 opacity-50" />
          <h2 className="font-playfair text-2xl sm:text-3xl md:text-4xl text-[#C04267] mb-4">
            Tu carrito está vacío
          </h2>
          <p className="font-lato text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
            ¡Agrega productos y empieza a crear tu detalle perfecto! 💖
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#EE6B8D] text-white px-6 sm:px-8 py-3 rounded-xl hover:bg-[#C04267] transition-all font-lato font-medium text-sm sm:text-base shadow-lg hover:shadow-xl hover:-translate-y-1"
          >
            <ArrowLeft size={20} />
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  // ================= MODAL DE EXTRAS =================
  const ExtrasModal = () => {
    if (!activeItemForExtras) return null;
    const currentItem = items.find(i => i.id === activeItemForExtras);
    if (!currentItem) return null;

    const extrasLucesGlobos = availableExtras.filter(e => !e.categoriaOriginal?.toLowerCase().includes('dulces') && !e.categoriaOriginal?.toLowerCase().includes('flores'));
    const extrasDulces = availableExtras.filter(e => e.categoriaOriginal?.toLowerCase().includes('dulces'));
    const extrasFlores = availableExtras.filter(e => e.categoriaOriginal?.toLowerCase().includes('flores'));

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
          <div className="p-4 sm:p-6 bg-gradient-to-r from-[#FDE8EF] to-white border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#C04267] flex items-center gap-2">
                <Sparkles size={20} className="text-[#EE6B8D]" /> Personaliza tu regalo
              </h3>
              <p className="font-lato text-xs sm:text-sm text-gray-500 mt-1">Agregando detalles a: <strong>{currentItem.nombre}</strong></p>
            </div>
            <button onClick={() => setActiveItemForExtras(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <X size={24} className="text-gray-400" />
            </button>
          </div>

          <div className="overflow-y-auto p-4 sm:p-6 bg-gray-50/50 space-y-6 sm:space-y-8">
            {extrasLucesGlobos.length > 0 && (
              <div>
                <h4 className="font-lato font-bold text-gray-700 uppercase tracking-wider text-xs mb-3 sm:mb-4">🌟 Luces & Globos</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {extrasLucesGlobos.map(extra => (
                    <ExtraOptionCard key={extra.id} extra={extra} currentItem={currentItem} />
                  ))}
                </div>
              </div>
            )}
            {extrasDulces.length > 0 && (
              <div>
                <h4 className="font-lato font-bold text-gray-700 uppercase tracking-wider text-xs mb-3 sm:mb-4">🍫 Chocolates & Dulces</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {extrasDulces.map(extra => (
                    <ExtraOptionCard key={extra.id} extra={extra} currentItem={currentItem} />
                  ))}
                </div>
              </div>
            )}
            {extrasFlores.length > 0 && (
              <div>
                <h4 className="font-lato font-bold text-gray-700 uppercase tracking-wider text-xs mb-3 sm:mb-4">💐 Flores Adicionales</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {extrasFlores.map(extra => (
                    <ExtraOptionCard key={extra.id} extra={extra} currentItem={currentItem} />
                  ))}
                </div>
              </div>
            )}
            {availableExtras.length === 0 && (
              <p className="text-center text-gray-500 font-lato italic py-8">Cargando opciones de personalización...</p>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-white">
            <button 
              onClick={() => setActiveItemForExtras(null)}
              className="w-full py-3 bg-[#EE6B8D] text-white font-bold rounded-xl hover:bg-[#C04267] transition-colors font-lato"
            >
              Listo, guardar cambios
            </button>
          </div>
        </div>
      </div>
    );
  };

  const ExtraOptionCard = ({ extra, currentItem }: { extra: Product, currentItem: any }) => {
    const extraInCart = currentItem.extras?.find((e: any) => e.id === extra.id);
    const qty = extraInCart ? extraInCart.cantidad : 0;

    return (
      <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${qty > 0 ? 'border-[#EE6B8D] bg-[#FDE8EF]/30' : 'border-gray-200 bg-white hover:border-[#EE6B8D]/50'}`}>
        <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
          <Image src={extra.imagen} alt={extra.nombre} fill className="object-cover" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-lato text-xs sm:text-sm font-semibold text-gray-800 truncate">{extra.nombre}</p>
          <p className="font-playfair text-[#EE6B8D] font-medium text-xs sm:text-sm">S/ {extra.precio.toFixed(2)}</p>
        </div>
        <div className="flex flex-col items-center">
          {qty === 0 ? (
            <button 
              onClick={() => addExtraToItem(currentItem.id, extra)}
              disabled={extra.stock === 0}
              className={`p-1.5 sm:p-2 rounded-full transition-colors ${extra.stock === 0 ? 'bg-gray-100 text-gray-300' : 'bg-[#FDE8EF] text-[#C04267] hover:bg-[#EE6B8D] hover:text-white'}`}
            >
              <Plus size={16} />
            </button>
          ) : (
            <div className="flex items-center gap-1 sm:gap-2 bg-white border border-[#EE6B8D] rounded-full p-1 shadow-sm">
              <button onClick={() => updateExtraQuantity(currentItem.id, extra.id, qty - 1)} className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-600">
                <Minus size={12} />
              </button>
              <span className="font-lato text-[10px] sm:text-xs font-bold w-2 sm:w-3 text-center">{qty}</span>
              <button onClick={() => updateExtraQuantity(currentItem.id, extra.id, qty + 1)} className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center rounded-full hover:bg-gray-100 text-[#C04267]">
                <Plus size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF4F7] to-white py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-3">
          <Link href="/" className="flex items-center gap-2 text-[#C04267] hover:text-[#EE6B8D] transition-colors font-lato text-sm sm:text-base">
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" /> Seguir comprando
          </Link>
          <button onClick={clearCart} className="text-xs sm:text-sm text-red-500 hover:text-red-700 font-lato underline">
            Vaciar carrito
          </button>
        </div>

        <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl text-[#C04267] mb-6 sm:mb-8">
          Tu Carrito de Compras
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* COLUMNA IZQUIERDA: Productos */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Producto Principal */}
                <div className="p-3 sm:p-4">
                  <div className="flex gap-3 sm:gap-4 items-start">
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image src={item.imagen} alt={item.nombre} fill className="object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-playfair text-base sm:text-lg md:text-xl text-[#C04267] mb-1 line-clamp-2 pr-4">
                            {item.nombre}
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500 mb-1">S/ {item.precio.toFixed(2)} c/u</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-gray-400 hover:text-red-500 p-1.5 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      {/* Controles de Cantidad */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:text-gray-800 disabled:opacity-30">
                            <Minus size={14} />
                          </button>
                          <span className="font-lato font-bold text-sm sm:text-base w-6 sm:w-8 text-center text-gray-800">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={!item.sku.startsWith('Amigu-') && !item.sku.startsWith('Caja-') && item.quantity >= item.stock} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-gray-500 hover:text-gray-800 disabled:opacity-30">
                            <Plus size={14} />
                          </button>
                        </div>
                        <p className="font-playfair text-lg sm:text-xl text-[#EE6B8D] font-semibold">
                          S/ {(item.precio * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECCIÓN EXTRAS DEL PRODUCTO */}
                <div className="bg-gray-50/80 border-t border-gray-100 p-3 sm:p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-lato font-bold text-gray-600 text-xs sm:text-sm flex items-center gap-1.5">
                      <Gift size={16} className="text-[#EE6B8D]" /> Detalles Adicionales
                    </h4>
                    <button 
                      onClick={() => setActiveItemForExtras(item.id)}
                      className="text-[10px] sm:text-xs font-bold text-[#C04267] hover:text-[#EE6B8D] uppercase tracking-wide flex items-center gap-1 bg-white px-2 py-1 rounded border border-gray-200 shadow-sm"
                    >
                      Personalizar <ChevronRight size={12} />
                    </button>
                  </div>

                  {item.extras && item.extras.length > 0 ? (
                    <div className="space-y-2">
                      {item.extras.map(extra => (
                        <div key={extra.id} className="flex justify-between items-center text-xs sm:text-sm font-lato bg-white px-3 py-2 rounded-lg border border-gray-100 shadow-sm">
                          <div className="flex items-center gap-2">
                            <span className="bg-[#FDE8EF] text-[#C04267] px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-bold">{extra.cantidad}x</span>
                            <span className="text-gray-700 truncate max-w-[150px] sm:max-w-[200px]">{extra.nombre}</span>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                            <span className="text-gray-500 font-medium">S/ {(extra.precio * extra.cantidad).toFixed(2)}</span>
                            <button onClick={() => removeExtraFromItem(item.id, extra.id)} className="text-gray-400 hover:text-red-500 p-1">
                              <X size={14} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] sm:text-xs text-gray-400 italic font-lato">Agrega luces, chocolates o tarjetas a este detalle.</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* COLUMNA DERECHA: Resumen */}
          <div className="lg:col-span-1 mt-2 sm:mt-0">
            <div className="bg-white rounded-xl shadow-sm border border-[#FDE8EF] p-4 sm:p-6 lg:sticky lg:top-24">
              <h2 className="font-playfair text-xl sm:text-2xl text-[#C04267] mb-4 sm:mb-6">
                Resumen del Pedido
              </h2>

              <div className="space-y-3 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-100 font-lato text-sm sm:text-base text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal ({items.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
                  <span className="font-medium text-gray-800">
                    S/ {items.reduce((sum, item) => sum + (item.precio * item.quantity), 0).toFixed(2)}
                  </span>
                </div>
                
                {/* Info de Extras en el resumen */}
                {items.some(i => i.extras && i.extras.length > 0) && (
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Adicionales (Extras)</span>
                    <span className="font-medium text-gray-700">
                      S/ {items.reduce((sum, item) => sum + (item.extras?.reduce((eSum, e) => eSum + (e.precio * e.cantidad), 0) || 0), 0).toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between pt-2">
                  <span>Envío</span>
                  <span className="text-green-600 font-medium">Por coordinar</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6">
                <span className="font-lato font-bold text-gray-800">Total</span>
                <span className="font-playfair text-2xl sm:text-3xl text-[#EE6B8D] font-bold">
                  S/ {totalPrice.toFixed(2)}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-[#25D366] text-white py-3.5 sm:py-4 rounded-xl font-lato font-bold text-base sm:text-lg hover:bg-[#20BD5A] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 flex items-center justify-center gap-2 mb-4"
              >
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                Comprar por WhatsApp
              </button>

              <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-5 border-t border-gray-100">
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="font-lato text-xs sm:text-sm text-gray-600">Entrega en 24-48 horas</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="font-lato text-xs sm:text-sm text-gray-600">Pago contraentrega disponible</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <p className="font-lato text-xs sm:text-sm text-gray-600">Tarjeta personalizada incluida</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ExtrasModal />
    </div>
  );
}