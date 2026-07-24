import { getSupabaseBrowserClient } from '@/lib/supabase/client'

export interface MensajeContacto {
  id?: number
  created_at?: string
  nombre: string
  email: string
  telefono?: string
  asunto?: string
  mensaje: string
  leido?: boolean
}

export async function insertMensajeContacto(data: MensajeContacto) {
  const { error } = await getSupabaseBrowserClient().from('mensajes_contacto').insert([data])
  if (error) throw error
}