import { supabase } from '@/lib/supabase/client'

export interface LibroReclamacion {
  id?: number
  created_at?: string
  tipo: 'reclamo' | 'queja'
  nombre_completo: string
  tipo_documento: string
  numero_documento: string
  telefono: string
  email: string
  direccion: string
  producto_servicio: string
  monto: number
  pedido_id?: string
  detalle: string
}

export async function insertReclamacion(data: LibroReclamacion) {
  const { error } = await supabase
    .from('libro_reclamaciones')
    .insert([data])

  if (error) throw error
}
