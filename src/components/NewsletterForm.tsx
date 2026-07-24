"use client"
import { useState, FormEvent } from "react"
import { insertSuscriptor } from "@/lib/db/suscriptores"
import { Heart, CheckCircle } from "lucide-react"

export default function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus("loading")
    try {
      const result = await insertSuscriptor({ email, fuente: "newsletter" })
      setStatus(result === "duplicate" ? "duplicate" : "success")
    } catch {
      setStatus("error")
    }
  }

  if (status === "success" || status === "duplicate") {
    return (
      <div className="text-center">
        <CheckCircle className="w-5 h-5 text-[#22C55E] mx-auto mb-1" />
        <p className="font-quicksand text-sm text-[#C04267] font-medium">
          {status === "success" ? "¡Gracias por suscribirte!" : "Ya estás registrada/o"}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        required
        placeholder="tu@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-3 py-2 rounded-lg border border-gray-200 bg-white font-quicksand text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]/30 focus:border-[#EE6B8D] transition-all"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="px-4 py-2 bg-[#EE6B8D] hover:bg-[#C04267] disabled:opacity-50 text-white font-quicksand font-semibold text-sm rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5"
      >
        {status === "loading" ? (
          <span className="animate-pulse">Enviando...</span>
        ) : (
          <>
            <Heart size={14} />
            Suscribirme
          </>
        )}
      </button>
      {status === "error" && (
        <p className="font-quicksand text-xs text-red-500 absolute mt-10">Error al suscribirte</p>
      )}
    </form>
  )
}
