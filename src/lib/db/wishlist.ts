import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export interface WishlistItem {
  id?: number
  created_at?: string
  usuario_id: string
  producto_id: string
  producto_nombre: string
  producto_precio: number
  producto_imagen?: string
}

export async function addToWishlist(data: WishlistItem) {
  const { error } = await getSupabaseBrowserClient().from('wishlist').insert([data])
  if (error && error.code !== '23505') throw error
  return error?.code === '23505' ? 'exists' : 'added'
}

export async function removeFromWishlist(usuario_id: string, producto_id: string) {
  const { error } = await getSupabaseBrowserClient()
    .from('wishlist')
    .delete()
    .eq('usuario_id', usuario_id)
    .eq('producto_id', producto_id)
  if (error) throw error
}

export async function getWishlist(usuario_id: string): Promise<WishlistItem[]> {
  const { data, error } = await getSupabaseBrowserClient()
    .from('wishlist')
    .select('*')
    .eq('usuario_id', usuario_id)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function isInWishlist(usuario_id: string, producto_id: string): Promise<boolean> {
  const { data, error } = await getSupabaseBrowserClient()
    .from('wishlist')
    .select('id')
    .eq('usuario_id', usuario_id)
    .eq('producto_id', producto_id)
    .maybeSingle()
  if (error) throw error
  return !!data
}