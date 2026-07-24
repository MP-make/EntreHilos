-- Storage bucket for hero images
-- Ejecuta esto en el SQL Editor de Supabase:

-- INSERT INTO storage.buckets (id, name, public) VALUES ('heroes', 'heroes', true)
-- ON CONFLICT (id) DO NOTHING;

-- CREATE POLICY "Heroes public select" ON storage.objects
--   FOR SELECT TO public USING (bucket_id = 'heroes');

-- CREATE POLICY "Heroes authenticated insert" ON storage.objects
--   FOR INSERT TO authenticated WITH CHECK (bucket_id = 'heroes');

-- CREATE POLICY "Heroes authenticated update" ON storage.objects
--   FOR UPDATE TO authenticated USING (bucket_id = 'heroes') WITH CHECK (bucket_id = 'heroes');
