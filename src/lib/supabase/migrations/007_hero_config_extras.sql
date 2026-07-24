-- ============================================================
-- MIGRACIÓN 007: EXTRA COLUMNS FOR hero_config
-- ============================================================

ALTER TABLE hero_config
  ADD COLUMN IF NOT EXISTS subtitulo TEXT,
  ADD COLUMN IF NOT EXISTS descripcion TEXT,
  ADD COLUMN IF NOT EXISTS badge TEXT,
  ADD COLUMN IF NOT EXISTS precio NUMERIC(10,2),
  ADD COLUMN IF NOT EXISTS producto_sku TEXT;

-- Seed data for home hero slides 2, 3, 4
INSERT INTO hero_config (clave, titulo, subtitulo, descripcion, badge, precio, link_url, imagen_url)
VALUES
  ('home_hero_2', 'Haz que su corazón', 'lata más fuerte', 'Arreglos personalizados, globos y detalles únicos en Pisco.', 'Especial', 80, '/category/cajas', ''),
  ('home_hero_3', 'Imagina tu personaje favorito', 'tejido a crochet', 'Creamos el amigurumi de tus sueños', 'Tus Personajes Favoritos', 115, '/category/amigurumis', ''),
  ('home_hero_4', 'Crea algo especial', 'para alguien especial', 'Cajas decoradas, tulipanes y diseños únicos hechos para ti', 'A Tu Medida', 50, '/personalizados', '')
ON CONFLICT (clave) DO NOTHING;
