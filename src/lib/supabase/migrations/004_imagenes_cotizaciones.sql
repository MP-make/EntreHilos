-- Agregar columna para imágenes de referencia en pedidos personalizados
ALTER TABLE pedidos_personalizados ADD COLUMN IF NOT EXISTS imagenes_url TEXT[] DEFAULT '{}';

-- Bucket de storage para imágenes de cotizaciones
-- Ejecutar en Supabase SQL Editor:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('cotizaciones', 'cotizaciones', true);
-- CREATE POLICY "Subir imágenes cotizaciones" ON storage.objects FOR INSERT TO anon WITH CHECK (bucket_id = 'cotizaciones');
-- CREATE POLICY "Leer imágenes cotizaciones" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'cotizaciones');
