import { supabase } from '@/lib/supabase/client'

export interface DireccionEnvio {
  id?: number
  created_at?: string
  usuario_id?: string
  nombre_completo: string
  telefono: string
  direccion: string
  ciudad: string
  distrito?: string
  referencia?: string
  es_principal?: boolean
}

export async function insertDireccion(data: DireccionEnvio) {
  const { error } = await supabase.from('direcciones_envio').insert([data])
  if (error) throw error
}

export async function getDirecciones(usuario_id?: string): Promise<DireccionEnvio[]> {
  let query = supabase.from('direcciones_envio').select('*').order('created_at', { ascending: false })
  if (usuario_id) query = query.eq('usuario_id', usuario_id)
  const { data, error } = await query
  if (error) throw error
  return data || []
}