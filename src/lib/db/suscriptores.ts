import { supabase } from '@/lib/supabase/client'

export interface Suscriptor {
  id?: number
  created_at?: string
  email: string
  nombre?: string
  activo?: boolean
  fuente?: string
}

export async function insertSuscriptor(data: { email: string; nombre?: string; fuente?: string }) {
  const { error } = await supabase
    .from('suscriptores')
    .insert([{ email: data.email, nombre: data.nombre || null, fuente: data.fuente || 'newsletter' }])

  if (error && error.code !== '23505') throw error
  return error?.code === '23505' ? 'duplicate' : 'success'
}