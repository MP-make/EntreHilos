"use client"
import { useState } from "react"
import { Send, Mail, Phone, User, MessageSquare } from "lucide-react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" })
  const [status, setStatus] = useState("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nombre || !form.email || !form.mensaje) return
    setStatus("loading")
    try {
      await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "mensaje",
          data: {
            nombre: form.nombre,
            email: form.email,
            telefono: form.telefono || undefined,
            asunto: form.asunto || undefined,
            mensaje: form.mensaje
          }
        })
      });
      setStatus("success");
      setForm({ nombre: "", email: "", telefono: "", asunto: "", mensaje: "" })
    } catch {
      setStatus("error")
    }
  }

  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#FDF4F7] to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-8 h-8 text-green-500" />
          </div>
          <h1 className="font-fredoka text-3xl text-[#C04267] mb-2">Gracias por escribirnos</h1>
          <p className="font-quicksand text-gray-600 mb-6">Te responderemos a la brevedad</p>
          <Link href="/" className="inline-flex items-center gap-2 bg-[#EE6B8D] text-white px-6 py-3 rounded-full hover:bg-[#C04267] transition-all font-quicksand font-medium shadow-md">
            <ArrowLeft size={18} /> Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF4F7] to-white py-12">
      <div className="max-w-2xl mx-auto px-4">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#EE6B8D] transition-colors font-quicksand text-sm mb-8">
          <ArrowLeft size={16} /> Volver
        </Link>

        <div className="bg-white rounded-3xl shadow-sm border border-[#FDE8EF] p-8">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="w-6 h-6 text-[#EE6B8D]" />
            <h1 className="font-fredoka text-3xl text-[#C04267]">Contacto</h1>
          </div>
          <p className="font-quicksand text-gray-600 mb-8">
            Escríbenos y te responderemos lo antes posible
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-quicksand text-sm text-gray-700 mb-1.5">Nombre *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="text" required value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]/30 focus:border-[#EE6B8D]" placeholder="Tu nombre" />
              </div>
            </div>

            <div>
              <label className="block font-quicksand text-sm text-gray-700 mb-1.5">Email *</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]/30 focus:border-[#EE6B8D]" placeholder="tu@email.com" />
              </div>
            </div>

            <div>
              <label className="block font-quicksand text-sm text-gray-700 mb-1.5">Teléfono</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input type="tel" value={form.telefono} onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]/30 focus:border-[#EE6B8D]" placeholder="999 888 777" />
              </div>
            </div>

            <div>
              <label className="block font-quicksand text-sm text-gray-700 mb-1.5">Asunto</label>
              <input type="text" value={form.asunto} onChange={(e) => setForm({ ...form, asunto: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]/30 focus:border-[#EE6B8D]" placeholder="Ej: Consulta sobre un producto" />
            </div>

            <div>
              <label className="block font-quicksand text-sm text-gray-700 mb-1.5">Mensaje *</label>
              <div className="relative">
                <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                <textarea required rows={5} value={form.mensaje} onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]/30 focus:border-[#EE6B8D] resize-none" placeholder="Escribe tu mensaje..." />
              </div>
            </div>

            <button type="submit" disabled={status === "loading"}
              className="w-full bg-gradient-to-r from-[#EE6B8D] to-[#C04267] text-white py-3.5 rounded-full font-quicksand font-bold text-base hover:shadow-lg hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {status === "loading" ? "Enviando..." : (
                <><Send className="w-4 h-4" /> Enviar mensaje</>
              )}
            </button>

            {status === "error" && (
              <p className="text-center font-quicksand text-sm text-red-500">Error al enviar. Intenta de nuevo.</p>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
