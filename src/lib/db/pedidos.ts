import { supabase } from '@/lib/supabase/client'

export interface Pedido {
  id?: number
  created_at?: string
  usuario_id?: string
  cliente_nombre: string
  cliente_telefono: string
  cliente_email?: string
  direccion_envio?: string
  items: any
  total: number
  estado?: string
  metodo_pago?: string
  notas?: string
}

export async function insertPedido(data: Pedido) {
  const { error } = await supabase.from('pedidos').insert([data])
  if (error) throw error
}

export async function getPedidos(usuario_id?: string): Promise<Pedido[]> {
  let query = supabase.from('pedidos').select('*').order('created_at', { ascending: false })
  if (usuario_id) query = query.eq('usuario_id', usuario_id)
  const { data, error } = await query
  if (error) throw error
  return data || []
}