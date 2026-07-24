import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { getUsuarioId } from "@/lib/anon-id"
import { addToWishlist, removeFromWishlist, isInWishlist } from "@/lib/db/wishlist"

interface WishlistButtonProps {
  productoId: string
  productoNombre: string
  productoPrecio: number
  productoImagen?: string
}

export default function WishlistButton({ productoId, productoNombre, productoPrecio, productoImagen }: WishlistButtonProps) {
  const [isFav, setIsFav] = useState(false)
  const [loading, setLoading] = useState(false)
  const usuarioId = typeof window !== "undefined" ? getUsuarioId() : ""

  useEffect(() => {
    if (!usuarioId) return
    isInWishlist(usuarioId, productoId).then(setIsFav).catch(() => {})
  }, [usuarioId, productoId])

  const toggleWishlist = async () => {
    if (loading) return
    setLoading(true)
    try {
      if (isFav) {
        await removeFromWishlist(usuarioId, productoId)
        setIsFav(false)
      } else {
        await addToWishlist({
          usuario_id: usuarioId,
          producto_id: productoId,
          producto_nombre: productoNombre,
          producto_precio: productoPrecio,
          producto_imagen: productoImagen
        })
        setIsFav(true)
      }
    } catch {
      console.error("Error toggling wishlist")
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={toggleWishlist}
      disabled={loading}
      className="p-2 hover:bg-[#FDF4F7] rounded-full transition-colors"
    >
      <Heart
        size={24}
        className={`transition-all duration-300 ${
          isFav
            ? "fill-[#EE6B8D] text-[#EE6B8D] scale-110"
            : "text-[#9F86C0] hover:text-[#EE6B8D]"
        } ${loading ? "animate-pulse" : ""}`}
      />
    </button>
  )
}