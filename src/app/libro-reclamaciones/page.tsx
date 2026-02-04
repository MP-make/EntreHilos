'use client';

import Link from "next/link";
import { BookOpen, AlertCircle, Send, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function LibroReclamacionesPage() {
  const [formData, setFormData] = useState({
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

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Crear mensaje para WhatsApp
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

    const whatsappUrl = `https://wa.me/51927005798?text=${encodeURIComponent(mensaje)}`;
    window.open(whatsappUrl, '_blank');
    
    setSubmitted(true);
    
    // Reset form después de 3 segundos
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
    <div className="min-h-screen bg-gradient-to-b from-[#FDF4F7] to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#5E548E] to-[#9F86C0] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <BookOpen size={64} className="mx-auto mb-6" />
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Libro de Reclamaciones
          </h1>
          <p className="font-lato text-lg font-light">
            Tu opinión es importante para nosotros. Regístrate tu reclamo o queja aquí.
          </p>
        </div>
      </section>

      {/* Información Legal */}
      <section className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="text-blue-600 mt-1 flex-shrink-0" size={24} />
            <div className="font-lato text-sm text-gray-700 leading-relaxed">
              <p className="mb-2">
                <strong>Conforme a lo establecido en el Código de Protección y Defensa del Consumidor</strong>, 
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

      {/* Formulario */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        {submitted ? (
          <div className="bg-green-50 border-2 border-green-500 rounded-2xl p-12 text-center">
            <CheckCircle className="mx-auto mb-6 text-green-600" size={80} />
            <h2 className="font-playfair text-3xl font-bold text-green-800 mb-4">
              ¡Registro Enviado Exitosamente!
            </h2>
            <p className="font-lato text-lg text-gray-700 mb-6">
              Tu {formData.tipo} ha sido registrado. Te contactaremos en un plazo máximo de 48 horas.
            </p>
            <p className="font-lato text-sm text-gray-600">
              Se ha abierto WhatsApp con los detalles de tu registro.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            {/* Tipo de Registro */}
            <div className="mb-8">
              <label className="font-playfair text-lg font-semibold text-[#5E548E] mb-3 block">
                Tipo de Registro *
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`flex items-center justify-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.tipo === 'reclamo' 
                    ? 'border-[#9F86C0] bg-[#9F86C0]/10' 
                    : 'border-gray-300 hover:border-[#9F86C0]'
                }`}>
                  <input
                    type="radio"
                    name="tipo"
                    value="reclamo"
                    checked={formData.tipo === 'reclamo'}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#9F86C0]"
                  />
                  <span className="font-lato font-semibold text-gray-700">Reclamo</span>
                </label>
                <label className={`flex items-center justify-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                  formData.tipo === 'queja' 
                    ? 'border-[#9F86C0] bg-[#9F86C0]/10' 
                    : 'border-gray-300 hover:border-[#9F86C0]'
                }`}>
                  <input
                    type="radio"
                    name="tipo"
                    value="queja"
                    checked={formData.tipo === 'queja'}
                    onChange={handleChange}
                    className="w-4 h-4 text-[#9F86C0]"
                  />
                  <span className="font-lato font-semibold text-gray-700">Queja</span>
                </label>
              </div>
              <p className="font-lato text-xs text-gray-500 mt-2">
                <strong>Reclamo:</strong> Disconformidad sobre productos o servicios. 
                <strong className="ml-2">Queja:</strong> Malestar por la atención.
              </p>
            </div>

            {/* Datos del Consumidor */}
            <div className="mb-8">
              <h3 className="font-playfair text-xl font-semibold text-[#5E548E] mb-4 pb-2 border-b">
                Datos del Consumidor
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="font-lato text-sm font-semibold text-gray-700 mb-2 block">
                    Nombre Completo *
                  </label>
                  <input
                    type="text"
                    name="nombreCompleto"
                    value={formData.nombreCompleto}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#9F86C0] focus:ring-2 focus:ring-[#9F86C0]/20 outline-none transition-all"
                    placeholder="Ej: Juan Pérez García"
                  />
                </div>

                <div>
                  <label className="font-lato text-sm font-semibold text-gray-700 mb-2 block">
                    Tipo de Documento *
                  </label>
                  <select
                    name="tipoDocumento"
                    value={formData.tipoDocumento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#9F86C0] focus:ring-2 focus:ring-[#9F86C0]/20 outline-none transition-all"
                  >
                    <option value="DNI">DNI</option>
                    <option value="CE">Carnet de Extranjería</option>
                    <option value="Pasaporte">Pasaporte</option>
                  </select>
                </div>

                <div>
                  <label className="font-lato text-sm font-semibold text-gray-700 mb-2 block">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    name="numeroDocumento"
                    value={formData.numeroDocumento}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#9F86C0] focus:ring-2 focus:ring-[#9F86C0]/20 outline-none transition-all"
                    placeholder="Ej: 12345678"
                  />
                </div>

                <div>
                  <label className="font-lato text-sm font-semibold text-gray-700 mb-2 block">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#9F86C0] focus:ring-2 focus:ring-[#9F86C0]/20 outline-none transition-all"
                    placeholder="Ej: 927005798"
                  />
                </div>

                <div>
                  <label className="font-lato text-sm font-semibold text-gray-700 mb-2 block">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#9F86C0] focus:ring-2 focus:ring-[#9F86C0]/20 outline-none transition-all"
                    placeholder="ejemplo@correo.com"
                  />
                </div>

                <div>
                  <label className="font-lato text-sm font-semibold text-gray-700 mb-2 block">
                    Dirección *
                  </label>
                  <input
                    type="text"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#9F86C0] focus:ring-2 focus:ring-[#9F86C0]/20 outline-none transition-all"
                    placeholder="Ej: Av. Principal 123, Pisco"
                  />
                </div>
              </div>
            </div>

            {/* Detalle del Reclamo */}
            <div className="mb-8">
              <h3 className="font-playfair text-xl font-semibold text-[#5E548E] mb-4 pb-2 border-b">
                Detalle del {formData.tipo === 'reclamo' ? 'Reclamo' : 'Queja'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="font-lato text-sm font-semibold text-gray-700 mb-2 block">
                    Producto/Servicio *
                  </label>
                  <input
                    type="text"
                    name="producto"
                    value={formData.producto}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#9F86C0] focus:ring-2 focus:ring-[#9F86C0]/20 outline-none transition-all"
                    placeholder="Ej: Ramo de rosas crochet"
                  />
                </div>

                <div>
                  <label className="font-lato text-sm font-semibold text-gray-700 mb-2 block">
                    Monto (S/) *
                  </label>
                  <input
                    type="number"
                    name="monto"
                    value={formData.monto}
                    onChange={handleChange}
                    required
                    step="0.01"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#9F86C0] focus:ring-2 focus:ring-[#9F86C0]/20 outline-none transition-all"
                    placeholder="Ej: 89.90"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="font-lato text-sm font-semibold text-gray-700 mb-2 block">
                    N° de Pedido (Opcional)
                  </label>
                  <input
                    type="text"
                    name="pedido"
                    value={formData.pedido}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#9F86C0] focus:ring-2 focus:ring-[#9F86C0]/20 outline-none transition-all"
                    placeholder="Si tienes el número de pedido, ingrésalo aquí"
                  />
                </div>
              </div>

              <div>
                <label className="font-lato text-sm font-semibold text-gray-700 mb-2 block">
                  Detalle del {formData.tipo === 'reclamo' ? 'Reclamo' : 'Queja'} *
                </label>
                <textarea
                  name="detalle"
                  value={formData.detalle}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#9F86C0] focus:ring-2 focus:ring-[#9F86C0]/20 outline-none transition-all resize-none"
                  placeholder="Describe detalladamente tu reclamo o queja..."
                />
              </div>
            </div>

            {/* Botón de Envío */}
            <div className="text-center">
              <button
                type="submit"
                className="inline-flex items-center gap-3 font-lato px-10 py-4 bg-[#9F86C0] text-white font-semibold text-lg rounded-full hover:bg-[#5E548E] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                <Send size={20} />
                Enviar {formData.tipo === 'reclamo' ? 'Reclamo' : 'Queja'}
              </button>
              <p className="font-lato text-xs text-gray-500 mt-4">
                Al enviar, se abrirá WhatsApp con los detalles de tu registro
              </p>
            </div>
          </form>
        )}
      </section>

      {/* Información Adicional */}
      <section className="bg-white py-12 border-t">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="font-playfair text-2xl font-semibold text-[#5E548E] text-center mb-8">
            Información Importante
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-lato text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-[#5E548E] mb-2">Plazo de Respuesta</h4>
              <p>Te contactaremos en un plazo máximo de 48 horas hábiles para atender tu solicitud.</p>
            </div>
            <div>
              <h4 className="font-semibold text-[#5E548E] mb-2">Datos del Proveedor</h4>
              <p>Entre Hilos - Pisco, Perú<br />WhatsApp: 927 005 798</p>
            </div>
          </div>
          <div className="mt-8 text-center">
            <Link 
              href="/"
              className="inline-block font-lato px-6 py-3 border-2 border-[#9F86C0] text-[#9F86C0] font-semibold rounded-full hover:bg-[#9F86C0] hover:text-white transition-all"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}