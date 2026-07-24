import { supabase } from '@/lib/supabase/client'

export interface CarritoAbandonado {
  id?: number
  created_at?: string
  updated_at?: string
  usuario_id?: string
  email?: string
  items: any
  total: number
  recuperado?: boolean
}

export async function upsertCarritoAbandonado(data: CarritoAbandonado) {
  const { error } = await supabase.from('carritos_abandonados').upsert(
    [data],
    { onConflict: 'usuario_id', ignoreDuplicates: false }
  )
  if (error) throw error
}

export async function getCarritosAbandonados(): Promise<CarritoAbandonado[]> {
  const { data, error } = await supabase
    .from('carritos_abandonados')
    .select('*')
    .eq('recuperado', false)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}