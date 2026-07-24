import { supabaseAdmin } from '@/lib/supabase/server'

export async function getAdminSuscriptores() {
  const { data, error } = await supabaseAdmin
    .from('suscriptores')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getAdminPedidos() {
  const { data, error } = await supabaseAdmin
    .from('pedidos')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getAdminMensajes() {
  const { data, error } = await supabaseAdmin
    .from('mensajes_contacto')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getAdminReclamaciones() {
  const { data, error } = await supabaseAdmin
    .from('libro_reclamaciones')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function getAdminPedidosPersonalizados() {
  const { data, error } = await supabaseAdmin
    .from('pedidos_personalizados')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}

export async function marcarMensajeLeido(id: number) {
  const { error } = await supabaseAdmin
    .from('mensajes_contacto')
    .update({ leido: true })
    .eq('id', id)
  if (error) throw error
}

export async function actualizarEstadoPedido(id: number, estado: string) {
  const { error } = await supabaseAdmin
    .from('pedidos')
    .update({ estado })
    .eq('id', id)
  if (error) throw error
}

// Heroes
export async function getAdminHeroes() {
  const { data, error } = await supabaseAdmin
    .from('hero_config')
    .select('*')
    .order('clave', { ascending: true })
  if (error) throw error
  return data || []
}

export async function actualizarHero(id: number, updates: Record<string, any>) {
  const { error } = await supabaseAdmin
    .from('hero_config')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

// Profiles (usuarios)
export async function getAdminUsuarios() {
  const { data, error } = await supabaseAdmin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}