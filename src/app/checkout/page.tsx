"use client";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { ArrowLeft, Trash2, Plus, Minus, ShoppingBag, CheckCircle2, MapPin, Phone, User, Mail, Truck, Lock, ShieldCheck, ChevronDown } from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import { useToast } from "@/components/Toast";
import { getUsuarioId } from "@/lib/anon-id";
import { getDepartamentos, getProvincias, getDistritos } from "@/lib/ubigeo";

export default function CartPage() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [clienteNombre, setClienteNombre] = useState("");
  const [clienteTelefono, setClienteTelefono] = useState("");
  const [clienteEmail, setClienteEmail] = useState("");
  const [departamento, setDepartamento] = useState("");
  const [provincia, setProvincia] = useState("");
  const [distrito, setDistrito] = useState("");
  const [direccionCalle, setDireccionCalle] = useState("");
  const [referencia, setReferencia] = useState("");
  const [enviando, setEnviando] = useState(false);

  const departamentos = useMemo(() => getDepartamentos(), []);
  const provincias = useMemo(() => getProvincias(departamento), [departamento]);
  const distritos = useMemo(() => getDistritos(departamento, provincia), [departamento, provincia]);

  const direccionEnvio = [direccionCalle, distrito, provincia, departamento]
    .filter(Boolean)
    .join(", ") + (referencia ? ` (${referencia})` : "");
  const {
    items,
    removeFromCart,
    updateQuantity,
    totalPrice,
    clearCart,
    getWhatsAppMessage,
  } = useCart();

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
        const supabase = getSupabaseBrowserClient();
        const { data: profile } = await supabase
          .from("profiles")
          .select("nombre, telefono, direccion")
          .eq("id", user.id)
          .maybeSingle();
        if (profile) {
          if (profile.nombre) setClienteNombre(profile.nombre);
          if (profile.telefono) setClienteTelefono(profile.telefono);
          if (profile.direccion) setDireccionCalle(profile.direccion);
        }
        if (user.email) setClienteEmail(user.email);
      } catch (e) {
        console.error("Error fetching profile:", e);
      }
    })();
  }, [user]);

  const handleConfirmCheckout = async () => {
    if (!clienteNombre.trim() || !clienteTelefono.trim()) {
      showToast("Completa tu nombre y teléfono", "warning");
      return;
    }
    if (!departamento || !provincia || !distrito || !direccionCalle.trim()) {
      showToast("Completa tu departamento, provincia, distrito y dirección", "warning");
      return;
    }

    setEnviando(true);

    // Guardamos el pedido en Supabase. Si falla, avisamos pero igual
    // dejamos continuar a WhatsApp para no bloquear la venta.
    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "pedido",
          data: {
            usuario_id: getUsuarioId(),
            cliente_nombre: clienteNombre.trim(),
            cliente_telefono: clienteTelefono.trim(),
            cliente_email: clienteEmail.trim() || undefined,
            direccion_envio: direccionEnvio.trim(),
            items: items.map(function (i) {
              return { id: i.id, nombre: i.nombre, precio: i.precio, cantidad: i.quantity, extras: i.extras };
            }),
            total: totalPrice,
            estado: "pendiente",
          },
        }),
      });
      if (!res.ok) {
        showToast("No pudimos guardar tu pedido en el sistema, pero puedes continuar por WhatsApp", "warning");
      }
    } catch (e) {
      console.error("Error saving order:", e);
      showToast("No pudimos guardar tu pedido en el sistema, pero puedes continuar por WhatsApp", "warning");
    }

    // Si el usuario está logueado, guardamos sus datos de envío en su perfil
    if (user) {
      try {
        const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
        const supabase = getSupabaseBrowserClient();
        await supabase.from("profiles").upsert({
          id: user.id,
          nombre: clienteNombre.trim(),
          telefono: clienteTelefono.trim(),
          email: clienteEmail.trim() || user.email,
          direccion: direccionEnvio.trim(),
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.error("Error updating profile:", e);
      }
    }

    // El mensaje base y los datos de entrega se codifican juntos para que
    // tildes, ñ, saltos de línea y emojis lleguen correctos a WhatsApp.
    const mensajeBase = getWhatsAppMessage();
    const datosEntrega = `\n\n*Datos de entrega:*\nNombre: ${clienteNombre}\nTeléfono: ${clienteTelefono}\nDirección: ${direccionEnvio}`;
    const whatsappUrl = `https://wa.me/51902578295?text=${encodeURIComponent(mensajeBase + datosEntrega)}`;
    window.open(whatsappUrl, "_blank");

    // El pedido ya se envió (a Supabase y/o WhatsApp): limpiamos el carrito
    // para que el cliente no vuelva a encontrarlo lleno y reenvíe el mismo pedido.
    clearCart();
    setEnviando(false);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF9F8] flex items-center justify-center px-4">
        <div className="text-center py-8 sm:py-16">
          <ShoppingBag size={48} className="sm:w-16 sm:h-16 mx-auto text-[#EE6B8D] mb-4 opacity-50" />
          <h2 className="font-fredoka text-2xl sm:text-3xl md:text-4xl text-[#C04267] mb-4">
            Tu carrito está vacío
          </h2>
          <p className="font-quicksand text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto">
            ¡Agrega productos y empieza a crear tu detalle perfecto!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-[#EE6B8D] text-white px-6 sm:px-8 py-3 rounded-lg hover:bg-[#C04267] transition-colors font-quicksand font-semibold text-sm sm:text-base"
          >
            <ArrowLeft size={20} />
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const isLoggedIn = !!user;
  const cantidadItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalProductos = items.reduce((sum, item) => sum + item.precio * item.quantity, 0);
  const totalExtras = items.reduce(
    (sum, item) => sum + (item.extras?.reduce((eSum, e) => eSum + e.precio * e.cantidad, 0) || 0),
    0
  );
  const hayExtras = items.some((i) => i.extras && i.extras.length > 0);

  return (
    <div className="min-h-screen bg-[#FAF9F8] py-6 sm:py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Cabecera */}
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <Link
            href="/"
            className="group flex items-center gap-2 text-gray-500 hover:text-[#C04267] transition-colors font-quicksand text-sm font-medium"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            Seguir comprando
          </Link>
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-gray-400 hover:text-red-500 transition-colors font-quicksand text-xs sm:text-sm"
          >
            <Trash2 size={14} />
            <span>Vaciar carrito</span>
          </button>
        </div>

        <h1 className="font-fredoka text-2xl sm:text-3xl text-[#2A2A2A] mb-8 sm:mb-10">
          Finalizar compra
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
          {/* COLUMNA IZQUIERDA: pedido + formulario */}
          <div className="lg:col-span-3 space-y-10">
            {/* SECCIÓN 1 — TU PEDIDO */}
            <section>
              <div className="flex items-center gap-2.5 mb-5">
                <span className="w-6 h-6 rounded-full bg-[#C04267] text-white text-[11px] font-quicksand font-bold flex items-center justify-center shrink-0">
                  1
                </span>
                <h2 className="font-quicksand text-sm font-bold uppercase tracking-wide text-[#2A2A2A]">
                  Tu pedido · {cantidadItems} {cantidadItems === 1 ? "producto" : "productos"}
                </h2>
              </div>

              <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 bg-white overflow-hidden">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-5">
                    <div className="flex gap-4 items-start">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-100">
                        <Image src={item.imagen} alt={item.nombre} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-3">
                          <div className="min-w-0">
                            <h3 className="font-quicksand font-semibold text-sm sm:text-base text-[#2A2A2A] line-clamp-2">
                              {item.nombre}
                            </h3>
                            <p className="font-quicksand text-xs text-gray-400 mt-0.5">
                              S/ {item.precio.toFixed(2)} c/u
                            </p>
                            {item.stock === 0 && (
                              <p className="font-quicksand text-[11px] mt-1 font-semibold text-[#C04267]">
                                A pedido (1-2 semanas)
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Quitar producto"
                            className="text-gray-300 hover:text-red-500 p-1 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-gray-200 rounded-md">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-500 hover:text-[#2A2A2A] disabled:opacity-30"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="font-quicksand font-semibold text-sm w-6 text-center text-[#2A2A2A]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.stock > 0 && item.quantity >= item.stock}
                              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center text-gray-500 hover:text-[#2A2A2A] disabled:opacity-30"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <p className="font-quicksand font-bold text-sm sm:text-base text-[#2A2A2A]">
                            S/ {(item.precio * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {item.extras && item.extras.length > 0 && (
                      <div className="mt-3 ml-0 sm:ml-24 space-y-1.5">
                        {item.extras.map((extra) => (
                          <div
                            key={extra.id}
                            className="flex justify-between items-center text-xs font-quicksand text-gray-500 bg-gray-50 px-3 py-1.5 rounded-md"
                          >
                            <span>
                              <span className="text-gray-400">{extra.cantidad}×</span> {extra.nombre}
                            </span>
                            <span className="text-gray-600 font-medium">
                              S/ {(extra.precio * extra.cantidad).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* SECCIÓN 2 — DATOS DE ENTREGA */}
            <section>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="w-6 h-6 rounded-full bg-[#C04267] text-white text-[11px] font-quicksand font-bold flex items-center justify-center shrink-0">
                  2
                </span>
                <h2 className="font-quicksand text-sm font-bold uppercase tracking-wide text-[#2A2A2A]">
                  Datos de entrega
                </h2>
              </div>
              <p className="font-quicksand text-xs text-gray-400 mb-5 ml-8">
                {isLoggedIn
                  ? "Precargamos los datos de tu cuenta. Puedes editarlos si este pedido es para otra persona."
                  : "Con esto armamos tu pedido para enviarlo por WhatsApp."}
              </p>

              {!isLoggedIn && (
                <p className="font-quicksand text-xs text-gray-500 mb-4 ml-8">
                  ¿Ya tienes una cuenta?{" "}
                  <Link href="/login" className="text-[#C04267] font-semibold hover:underline">
                    Inicia sesión
                  </Link>{" "}
                  para agilizar tu pedido.
                </p>
              )}

              <div className="ml-0 sm:ml-8 bg-white border border-gray-200 rounded-xl p-5 sm:p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-quicksand text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <User size={13} className="text-gray-400" /> Nombre completo *
                    </label>
                    <input
                      type="text"
                      value={clienteNombre}
                      onChange={(e) => setClienteNombre(e.target.value)}
                      placeholder="Ej: María Pérez"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] focus:border-transparent font-quicksand text-sm text-[#2A2A2A]"
                    />
                  </div>
                  <div>
                    <label className="font-quicksand text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                      <Phone size={13} className="text-gray-400" /> Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={clienteTelefono}
                      onChange={(e) => setClienteTelefono(e.target.value)}
                      placeholder="Ej: 999888777"
                      className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] focus:border-transparent font-quicksand text-sm text-[#2A2A2A]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-quicksand text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <Mail size={13} className="text-gray-400" /> Email
                  </label>
                  <input
                    type="email"
                    value={clienteEmail}
                    onChange={(e) => setClienteEmail(e.target.value)}
                    placeholder="Ej: maria@email.com"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] focus:border-transparent font-quicksand text-sm text-[#2A2A2A]"
                  />
                </div>

                {/* DEPARTAMENTO */}
                <div>
                  <label className="font-quicksand text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={13} className="text-gray-400" /> Departamento *
                  </label>
                  <div className="relative">
                    <select
                      value={departamento}
                      onChange={(e) => { setDepartamento(e.target.value); setProvincia(""); setDistrito(""); }}
                      className="w-full appearance-none px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] focus:border-transparent font-quicksand text-sm text-[#2A2A2A] bg-white pr-10"
                    >
                      <option value="">Seleccionar departamento</option>
                      {departamentos.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* PROVINCIA */}
                <div>
                  <label className="font-quicksand text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={13} className="text-gray-400" /> Provincia *
                  </label>
                  <div className="relative">
                    <select
                      value={provincia}
                      onChange={(e) => { setProvincia(e.target.value); setDistrito(""); }}
                      disabled={!departamento}
                      className="w-full appearance-none px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] focus:border-transparent font-quicksand text-sm text-[#2A2A2A] bg-white pr-10 disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      <option value="">Seleccionar provincia</option>
                      {provincias.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* DISTRITO */}
                <div>
                  <label className="font-quicksand text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={13} className="text-gray-400" /> Distrito *
                  </label>
                  <div className="relative">
                    <select
                      value={distrito}
                      onChange={(e) => setDistrito(e.target.value)}
                      disabled={!provincia}
                      className="w-full appearance-none px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] focus:border-transparent font-quicksand text-sm text-[#2A2A2A] bg-white pr-10 disabled:bg-gray-50 disabled:text-gray-400"
                    >
                      <option value="">Seleccionar distrito</option>
                      {distritos.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* CALLE / DIRECCIÓN */}
                <div>
                  <label className="font-quicksand text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={13} className="text-gray-400" /> Dirección (calle, av., nro) *
                  </label>
                  <input
                    type="text"
                    value={direccionCalle}
                    onChange={(e) => setDireccionCalle(e.target.value)}
                    placeholder="Ej: Av. Principal 123, Mz A Lt 5"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] focus:border-transparent font-quicksand text-sm text-[#2A2A2A]"
                  />
                </div>

                {/* REFERENCIA */}
                <div>
                  <label className="font-quicksand text-xs font-semibold text-gray-600 mb-1.5 flex items-center gap-1.5">
                    <MapPin size={13} className="text-gray-400" /> Referencia (opcional)
                  </label>
                  <input
                    type="text"
                    value={referencia}
                    onChange={(e) => setReferencia(e.target.value)}
                    placeholder="Ej: Frente al parque, color verde"
                    className="w-full px-3.5 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] focus:border-transparent font-quicksand text-sm text-[#2A2A2A]"
                  />
                </div>

                <div className="flex items-start gap-2 bg-[#FDF4F7] border border-[#FDE8EF] rounded-lg px-3.5 py-2.5">
                  <Truck size={14} className="text-[#C04267] flex-shrink-0 mt-0.5" />
                  <p className="font-quicksand text-xs text-[#8a5a68] leading-relaxed">
                    Enviamos a todo el Perú. El costo varía según tu ubicación y te lo
                    confirmamos por WhatsApp antes de coordinar el envío.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* COLUMNA DERECHA: resumen fijo con el pedido y el botón de compra */}
          <div className="lg:col-span-2">
            <div className="lg:sticky lg:top-8 bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-gray-100">
                <h2 className="font-fredoka text-lg text-[#2A2A2A]">Resumen</h2>
              </div>

              {/* Mini lista de productos, siempre visible junto al total */}
              <div className="max-h-64 overflow-y-auto px-5 sm:px-6 py-4 space-y-3 border-b border-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 border border-gray-100 flex-shrink-0">
                      <Image src={item.imagen} alt={item.nombre} fill className="object-cover" />
                      <span className="absolute -top-1.5 -right-1.5 bg-[#C04267] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <p className="flex-1 min-w-0 font-quicksand text-xs text-gray-600 line-clamp-1">
                      {item.nombre}
                    </p>
                    <p className="font-quicksand text-xs font-semibold text-[#2A2A2A] flex-shrink-0">
                      S/ {(item.precio * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="px-5 sm:px-6 py-4 space-y-2.5 font-quicksand text-sm text-gray-600 border-b border-gray-100">
                <div className="flex justify-between">
                  <span>Subtotal ({cantidadItems} items)</span>
                  <span className="text-[#2A2A2A] font-medium">S/ {subtotalProductos.toFixed(2)}</span>
                </div>
                {hayExtras && (
                  <div className="flex justify-between">
                    <span>Adicionales</span>
                    <span className="text-[#2A2A2A] font-medium">S/ {totalExtras.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span className="text-amber-600 font-medium">A coordinar</span>
                </div>
              </div>

              <div className="px-5 sm:px-6 py-4 flex justify-between items-center">
                <span className="font-quicksand font-bold text-[#2A2A2A]">Total</span>
                <span className="font-fredoka text-2xl text-[#C04267] font-bold">
                  S/ {totalPrice.toFixed(2)}
                </span>
              </div>

              <div className="px-5 sm:px-6 pb-5 sm:pb-6">
                <button
                  onClick={handleConfirmCheckout}
                  disabled={enviando}
                  className="w-full bg-[#25D366] hover:bg-[#20BA5A] text-white py-3.5 rounded-lg font-quicksand font-bold text-sm sm:text-base transition-colors flex items-center justify-center gap-2.5 disabled:opacity-60"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  {enviando ? "Enviando..." : "Confirmar y enviar por WhatsApp"}
                </button>
                <p className="font-quicksand text-[11px] text-gray-400 text-center mt-2.5">
                  Se abrirá WhatsApp con el detalle de tu pedido para coordinar el pago y el envío.
                </p>
              </div>

              {/* Confianza — franja compacta, no bloques sueltos */}
              <div className="border-t border-gray-100 px-5 sm:px-6 py-4 grid grid-cols-1 gap-2.5">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <p className="font-quicksand text-xs text-gray-500">Pago contraentrega disponible</p>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <p className="font-quicksand text-xs text-gray-500">Tarjeta personalizada incluida</p>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <p className="font-quicksand text-xs text-gray-500">Tus datos solo se usan para coordinar tu pedido</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}