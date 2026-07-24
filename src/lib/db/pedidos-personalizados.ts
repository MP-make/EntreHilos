import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export interface PedidoPersonalizado {
  id?: number
  created_at?: string
  nombre_cliente: string
  telefono: string
  email?: string
  producto_id?: string
  producto_nombre?: string
  producto_precio?: number
  detalles: string
  colores?: string
  tamano?: string
  extras?: string
  fecha_entrega: string
  estado?: string
}

export async function insertPedidoPersonalizado(data: PedidoPersonalizado) {
  const { error } = await getSupabaseBrowserClient()
    .from('pedidos_personalizados')
    .insert([data])

  if (error) throw error
}
