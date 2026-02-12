"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock, MessageCircle, CheckCircle } from "lucide-react";

function PedidoPersonalizadoContent() {
  const searchParams = useSearchParams();
  const [producto, setProducto] = useState<any>(null);
  const [formData, setFormData] = useState({
    detalles: "",
    fechaEntrega: "",
    colores: "",
    tamano: "",
    extras: "",
  });

  useEffect(() => {
    // Obtener datos del producto desde URL params
    const productoData = searchParams.get("producto");
    if (productoData) {
      try {
        const parsed = JSON.parse(decodeURIComponent(productoData));
        setProducto(parsed);
        console.log("Producto cargado:", parsed);
      } catch (error) {
        console.error("Error al parsear producto:", error);
      }
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fechaEntrega) {
      alert("Por favor indica la fecha de entrega deseada");
      return;
    }

    // Validar que la fecha sea al menos 2 semanas adelante
    const fechaSeleccionada = new Date(formData.fechaEntrega);
    const fechaMinima = new Date();
    fechaMinima.setDate(fechaMinima.getDate() + 14); // 14 días = 2 semanas

    if (fechaSeleccionada < fechaMinima) {
      alert("⚠️ El tiempo mínimo de producción es de 1-2 semanas. Por favor selecciona una fecha posterior.");
      return;
    }

    // Construir mensaje de WhatsApp
    const mensaje = `
🎨 *PEDIDO PERSONALIZADO - Entre Hilos* 💜

📦 *Producto:* ${producto?.nombre || "Producto personalizado"}
💰 *Precio:* S/ ${producto?.precio?.toFixed(2) || "0.00"}

✨ *DETALLES DEL PEDIDO:*
${formData.detalles ? `📝 Especificaciones: ${formData.detalles}` : ""}
${formData.colores ? `🎨 Colores: ${formData.colores}` : ""}
${formData.tamano ? `📏 Tamaño: ${formData.tamano}` : ""}
${formData.extras ? `➕ Extras: ${formData.extras}` : ""}

📅 *Fecha de entrega deseada:* ${new Date(formData.fechaEntrega).toLocaleDateString("es-PE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}

⏱️ *Tiempo de producción:* 1-2 semanas mínimo

---
Deseo confirmar este pedido personalizado. ¡Gracias! 😊
    `.trim();

    const whatsappUrl = `https://wa.me/51927005798?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, "_blank");
  };

  if (!producto) {
    return (
      <div className="min-h-screen bg-[#FDF4F7] flex items-center justify-center">
        <div className="text-center">
          <p className="font-lato text-lg text-[#6B6B6B]">Cargando...</p>
        </div>
      </div>
    );
  }

  // Calcular fecha mínima (HOY + 14 días)
  const hoy = new Date();
  const fechaMinima = new Date(hoy);
  fechaMinima.setDate(hoy.getDate() + 14);
  const fechaMinimaString = fechaMinima.toISOString().split("T")[0];

  // Calcular fecha máxima (31 de diciembre de 2027)
  const fechaMaxima = new Date("2027-12-31");
  const fechaMaximaString = fechaMaxima.toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#FDF4F7] py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <h1 className="font-playfair text-3xl md:text-4xl font-bold text-[#5E548E] mb-2">
            Pedido Personalizado
          </h1>
          <p className="font-lato text-base text-[#6B6B6B] font-light">
            Completa los detalles de tu pedido y te contactaremos por WhatsApp
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna Izquierda - Información del Producto */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="font-playfair text-xl font-semibold text-[#5E548E] mb-4">
              Producto Seleccionado
            </h2>

            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden mb-4">
              {producto.imagen && (
                <Image
                  src={producto.imagen}
                  alt={producto.nombre || "Producto"}
                  fill
                  className="object-cover"
                  unoptimized
                />
              )}
              <div className="absolute top-3 right-3 px-3 py-1 bg-[#9F86C0] text-white text-xs font-lato font-bold rounded">
                A pedido
              </div>
            </div>

            <h3 className="font-playfair text-2xl font-semibold text-[#5E548E] mb-2">
              {producto.nombre}
            </h3>

            <p className="font-playfair text-3xl font-bold text-[#9F86C0] mb-4">
              S/ {producto.precio?.toFixed(2) || "0.00"}
            </p>

            <div className="bg-[#FDF4F7] rounded-lg p-4 space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-[#9F86C0] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-lato text-sm font-semibold text-[#5E548E]">
                    Tiempo de producción
                  </p>
                  <p className="font-lato text-xs text-[#6B6B6B]">
                    Mínimo 1-2 semanas desde la confirmación
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-[#9F86C0] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-lato text-sm font-semibold text-[#5E548E]">
                    100% Personalizable
                  </p>
                  <p className="font-lato text-xs text-[#6B6B6B]">
                    Adaptamos el diseño según tus preferencias
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-[#9F86C0] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-lato text-sm font-semibold text-[#5E548E]">
                    Confirmación por WhatsApp
                  </p>
                  <p className="font-lato text-xs text-[#6B6B6B]">
                    Te contactaremos para confirmar todos los detalles
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Formulario */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="font-playfair text-xl font-semibold text-[#5E548E] mb-6">
              Detalles de Personalización
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Fecha de Entrega */}
              <div>
                <label className="flex items-center gap-2 font-lato text-sm font-semibold text-[#5E548E] mb-2">
                  <Calendar size={18} />
                  Fecha de entrega deseada *
                </label>
                <input
                  type="date"
                  required
                  min={fechaMinimaString}
                  max={fechaMaximaString}
                  value={formData.fechaEntrega}
                  onChange={(e) =>
                    setFormData({ ...formData, fechaEntrega: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9F86C0] focus:border-transparent font-lato text-sm"
                />
                <p className="font-lato text-xs text-[#6B6B6B] mt-1">
                  Fecha mínima: {fechaMinima.toLocaleDateString("es-PE", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              {/* Detalles/Especificaciones */}
              <div>
                <label className="font-lato text-sm font-semibold text-[#5E548E] mb-2 block">
                  Especificaciones del pedido *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe los detalles de tu pedido: tamaño, colores, estilo, etc."
                  value={formData.detalles}
                  onChange={(e) =>
                    setFormData({ ...formData, detalles: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9F86C0] focus:border-transparent font-lato text-sm resize-none"
                />
              </div>

              {/* Colores preferidos */}
              <div>
                <label className="font-lato text-sm font-semibold text-[#5E548E] mb-2 block">
                  Colores preferidos (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: Morado, blanco, rosa"
                  value={formData.colores}
                  onChange={(e) =>
                    setFormData({ ...formData, colores: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9F86C0] focus:border-transparent font-lato text-sm"
                />
              </div>

              {/* Tamaño */}
              <div>
                <label className="font-lato text-sm font-semibold text-[#5E548E] mb-2 block">
                  Tamaño deseado (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej: 30cm de alto"
                  value={formData.tamano}
                  onChange={(e) =>
                    setFormData({ ...formData, tamano: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9F86C0] focus:border-transparent font-lato text-sm"
                />
              </div>

              {/* Extras */}
              <div>
                <label className="font-lato text-sm font-semibold text-[#5E548E] mb-2 block">
                  Detalles adicionales (opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Cualquier otra información relevante..."
                  value={formData.extras}
                  onChange={(e) =>
                    setFormData({ ...formData, extras: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#9F86C0] focus:border-transparent font-lato text-sm resize-none"
                />
              </div>

              {/* Botón de envío */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-3 font-lato px-8 py-4 bg-[#25D366] hover:bg-[#20BA5A] text-white font-semibold text-base tracking-wide transition-all duration-300 rounded-lg shadow-lg hover:shadow-xl"
              >
                <MessageCircle size={22} />
                Enviar pedido por WhatsApp
              </button>

              <p className="font-lato text-xs text-center text-[#6B6B6B] leading-relaxed">
                Al enviar, serás redirigido a WhatsApp donde podremos confirmar
                todos los detalles de tu pedido personalizado
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PedidoPersonalizadoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FDF4F7] flex items-center justify-center">
        <div className="text-center">
          <p className="font-lato text-lg text-[#6B6B6B]">Cargando...</p>
        </div>
      </div>
    }>
      <PedidoPersonalizadoContent />
    </Suspense>
  );
}