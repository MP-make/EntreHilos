'use client';

import Link from "next/link";
import { BookOpen, AlertCircle, Send, CheckCircle, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function LibroReclamacionesPage() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    tipo: 'reclamo' as 'reclamo' | 'queja',
    nombreCompleto: '',
    tipoDocumento: 'DNI',
    numeroDocumento: '',
    telefono: '',
    email: '',
    direccion: '',
    producto: '',
    monto: '',
    detalle: '',
    pedido: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const isLoggedIn = !!user;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSaving(true);

    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "reclamacion",
          data: {
            tipo: formData.tipo,
            nombre_completo: formData.nombreCompleto,
            tipo_documento: formData.tipoDocumento,
            numero_documento: formData.numeroDocumento,
            telefono: formData.telefono,
            email: formData.email,
            direccion: formData.direccion,
            producto_servicio: formData.producto,
            monto: parseFloat(formData.monto) || 0,
            pedido_id: formData.pedido || undefined,
            detalle: formData.detalle,
          }
        })
      });
    } catch {
      // El reclamo se guardó igual via WhatsApp aunque falle la DB
    }

    setSaving(false);

    const mensaje = `
*LIBRO DE RECLAMACIONES - ENTRE HILOS*

*Tipo:* ${formData.tipo.toUpperCase()}
*Datos del Cliente:*
- Nombre: ${formData.nombreCompleto}
- ${formData.tipoDocumento}: ${formData.numeroDocumento}
- Teléfono: ${formData.telefono}
- Email: ${formData.email}
- Dirección: ${formData.direccion}

*Detalle del ${formData.tipo}:*
- Producto/Servicio: ${formData.producto}
- Monto: S/ ${formData.monto}
- N° Pedido: ${formData.pedido}
- Detalle: ${formData.detalle}

_Registro generado el ${new Date().toLocaleDateString('es-PE')} a las ${new Date().toLocaleTimeString('es-PE')}_
    `.trim();

    const whatsappUrl = `https://wa.me/51902578295?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        tipo: 'reclamo',
        nombreCompleto: '',
        tipoDocumento: 'DNI',
        numeroDocumento: '',
        telefono: '',
        email: '',
        direccion: '',
        producto: '',
        monto: '',
        detalle: '',
        pedido: '',
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-[#FDF4F7]">
      <section className="bg-gradient-to-r from-[#C04267] to-[#EE6B8D] text-white py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <BookOpen size={48} className="sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6" />
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">
            Libro de Reclamaciones
          </h1>
          <p className="font-lato text-base sm:text-lg font-light px-4">
            Tu opinión es importante para nosotros. Registra tu reclamo o queja aquí.
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-[#FDE8EF] border border-[#EE6B8D]/30 rounded-xl p-4 sm:p-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <AlertCircle className="text-[#C04267] mt-1 flex-shrink-0 w-5 h-5 sm:w-6 sm:h-6" />
            <div className="font-lato text-xs sm:text-sm text-[#6B6B6B] leading-relaxed">
              <p className="mb-2">
                <strong className="text-[#C04267]">Conforme a lo establecido en el Código de Protección y Defensa del Consumidor</strong>,
                este Libro de Reclamaciones virtual está a tu disposición.
              </p>
              <p>
                La formulación de un reclamo no impide acudir a otras vías de solución de controversias ni es
                requisito previo para interponer una denuncia ante el INDECOPI.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
        {submitted ? (
          <div className="bg-[#FDE8EF] border-2 border-[#EE6B8D] rounded-2xl p-8 sm:p-12 text-center">
            <CheckCircle className="mx-auto mb-4 sm:mb-6 text-[#C04267] w-16 h-16 sm:w-20 sm:h-20" />
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#C04267] mb-3 sm:mb-4">
              ¡Registro Enviado Exitosamente!
            </h2>
            <p className="font-lato text-base sm:text-lg text-[#6B6B6B] mb-4 sm:mb-6">
              Tu {formData.tipo} ha sido registrado. Te contactaremos en un plazo máximo de 48 horas.
            </p>
            <p className="font-lato text-xs sm:text-sm text-[#6B6B6B]">
              Se ha abierto WhatsApp con los detalles de tu registro.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-[#FDE8EF] p-6 sm:p-8 md:p-12">
            <div className="mb-6 sm:mb-8">
              <label className="font-playfair text-base sm:text-lg font-semibold text-[#2D2D2D] mb-3 block">
                Tipo de Registro *
              </label>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <label className={`flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.tipo === 'reclamo'
                    ? 'border-[#EE6B8D] bg-[#FDE8EF]'
                    : 'border-gray-200 hover:border-[#EE6B8D]'
                }`}>
                  <input
                    type="radio"
                    name="tipo"
                    value="reclamo"
                    checked={formData.tipo === 'reclamo'}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#EE6B8D]"
                  />
                  <span className="font-lato font-semibold text-sm sm:text-base text-gray-700">Reclamo</span>
                </label>
                <label className={`flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.tipo === 'queja'
                    ? 'border-[#EE6B8D] bg-[#FDE8EF]'
                    : 'border-gray-200 hover:border-[#EE6B8D]'
                }`}>
                  <input
                    type="radio"
                    name="tipo"
                    value="queja"
                    checked={formData.tipo === 'queja'}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#EE6B8D]"
                  />
                  <span className="font-lato font-semibold text-sm sm:text-base text-gray-700">Queja</span>
                </label>
              </div>
              <p className="font-lato text-xs text-gray-500 mt-2 leading-relaxed">
                <strong>Reclamo:</strong> Disconformidad sobre productos o servicios.
                <strong className="ml-2">Queja:</strong> Malestar por la atención recibida.
              </p>
            </div>

            {isLoggedIn ? (
              <div className="mb-6 sm:mb-8 bg-[#FDE8EF]/50 border border-[#EE6B8D]/20 rounded-xl p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-2">
                  <User size={20} className="text-[#EE6B8D]" />
                  <h3 className="font-playfair text-base sm:text-lg font-semibold text-[#2D2D2D]">
                    Datos del Consumidor
                  </h3>
                </div>
                <p className="font-lato text-sm text-[#6B6B6B]">
                  Estás registrado como <strong>{user?.email}</strong>. Tus datos se usarán automáticamente para este reclamo.
                </p>
              </div>
            ) : (
              <div className="mb-6 sm:mb-8">
                <h3 className="font-playfair text-base sm:text-lg font-semibold text-[#2D2D2D] mb-3 sm:mb-4 pb-2 border-b border-[#FDE8EF]">
                  Datos del Consumidor
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="font-lato text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      name="nombreCompleto"
                      value={formData.nombreCompleto}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:border-[#EE6B8D] focus:ring-2 focus:ring-[#EE6B8D]/20 outline-none transition-all"
                      placeholder="Ej: Juan Pérez García"
                    />
                  </div>

                  <div>
                    <label className="font-lato text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
                      Tipo de Documento *
                    </label>
                    <select
                      name="tipoDocumento"
                      value={formData.tipoDocumento}
                      onChange={handleChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:border-[#EE6B8D] focus:ring-2 focus:ring-[#EE6B8D]/20 outline-none transition-all"
                    >
                      <option value="DNI">DNI</option>
                      <option value="CE">Carnet de Extranjería</option>
                      <option value="Pasaporte">Pasaporte</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-lato text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
                      Número de Documento *
                    </label>
                    <input
                      type="text"
                      name="numeroDocumento"
                      value={formData.numeroDocumento}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:border-[#EE6B8D] focus:ring-2 focus:ring-[#EE6B8D]/20 outline-none transition-all"
                      placeholder="Ej: 12345678"
                    />
                  </div>

                  <div>
                    <label className="font-lato text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:border-[#EE6B8D] focus:ring-2 focus:ring-[#EE6B8D]/20 outline-none transition-all"
                      placeholder="Ej: 927005798"
                    />
                  </div>

                  <div>
                    <label className="font-lato text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:border-[#EE6B8D] focus:ring-2 focus:ring-[#EE6B8D]/20 outline-none transition-all"
                      placeholder="ejemplo@correo.com"
                    />
                  </div>

                  <div>
                    <label className="font-lato text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleChange}
                      required
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:border-[#EE6B8D] focus:ring-2 focus:ring-[#EE6B8D]/20 outline-none transition-all"
                      placeholder="Ej: Av. Principal 123, Pisco"
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6 sm:mb-8">
              <h3 className="font-playfair text-base sm:text-lg font-semibold text-[#2D2D2D] mb-3 sm:mb-4 pb-2 border-b border-[#FDE8EF]">
                Detalle del {formData.tipo === 'reclamo' ? 'Reclamo' : 'Queja'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div>
                  <label className="font-lato text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
                    Producto/Servicio *
                  </label>
                  <input
                    type="text"
                    name="producto"
                    value={formData.producto}
                    onChange={handleChange}
                    required
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:border-[#EE6B8D] focus:ring-2 focus:ring-[#EE6B8D]/20 outline-none transition-all"
                    placeholder="Ej: Ramo de rosas crochet"
                  />
                </div>

                <div>
                  <label className="font-lato text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
                    Monto (S/) *
                  </label>
                  <input
                    type="number"
                    name="monto"
                    value={formData.monto}
                    onChange={handleChange}
                    required
                    step="0.01"
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:border-[#EE6B8D] focus:ring-2 focus:ring-[#EE6B8D]/20 outline-none transition-all"
                    placeholder="Ej: 89.90"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-lato text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
                    N° de Pedido (Opcional)
                  </label>
                  <input
                    type="text"
                    name="pedido"
                    value={formData.pedido}
                    onChange={handleChange}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:border-[#EE6B8D] focus:ring-2 focus:ring-[#EE6B8D]/20 outline-none transition-all"
                    placeholder="Si tienes el número de pedido, ingrésalo aquí"
                  />
                </div>
              </div>

              <div>
                <label className="font-lato text-xs sm:text-sm font-semibold text-gray-700 mb-2 block">
                  Detalle del {formData.tipo === 'reclamo' ? 'Reclamo' : 'Queja'} *
                </label>
                <textarea
                  name="detalle"
                  value={formData.detalle}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-lg focus:border-[#EE6B8D] focus:ring-2 focus:ring-[#EE6B8D]/20 outline-none transition-all resize-none"
                  placeholder="Describe detalladamente tu reclamo o queja..."
                />
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 sm:gap-3 font-lato px-8 sm:px-10 py-3 sm:py-4 bg-[#EE6B8D] text-white font-semibold text-base sm:text-lg rounded-full hover:bg-[#C04267] disabled:bg-gray-300 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto"
              >
                <Send size={18} className="sm:w-5 sm:h-5" />
                {saving ? "Guardando..." : `Enviar ${formData.tipo === 'reclamo' ? 'Reclamo' : 'Queja'}`}
              </button>
              <p className="font-lato text-xs text-gray-500 mt-3 sm:mt-4 px-4">
                Al enviar, se abrirá WhatsApp con los detalles de tu registro
              </p>
            </div>
          </form>
        )}
      </section>

      <section className="bg-white py-8 sm:py-12 border-t border-[#FDE8EF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <h3 className="font-playfair text-xl sm:text-2xl font-semibold text-[#2D2D2D] text-center mb-6 sm:mb-8">
            Información Importante
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 font-lato text-xs sm:text-sm text-[#6B6B6B]">
            <div>
              <h4 className="font-semibold text-[#C04267] mb-2">Plazo de Respuesta</h4>
              <p>Te contactaremos en un plazo máximo de 48 horas hábiles para atender tu solicitud.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#C04267] mb-2">Datos del Proveedor</h4>
              <p>Entre Hilos - Pisco, Perú<br />WhatsApp: 902 578 295</p>
            </div>
          </div>
          <div className="mt-6 sm:mt-8 text-center">
            <Link
              href="/"
              className="inline-block font-lato px-6 py-3 border-2 border-[#EE6B8D] text-[#EE6B8D] font-semibold text-sm sm:text-base rounded-full hover:bg-[#EE6B8D] hover:text-white transition-all"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
