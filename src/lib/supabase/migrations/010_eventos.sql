-- ============================================================
-- MIGRACIÓN 010: EVENTOS (admin-managed events)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.eventos (
  id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  nombre TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  descripcion TEXT,
  imagen_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT eventos_pkey PRIMARY KEY (id)
);

COMMENT ON TABLE public.eventos IS 'Eventos administrables desde el panel';

ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access eventos"
  ON public.eventos
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read active eventos"
  ON public.eventos FOR SELECT
  USING (activo = true);

-- Seed existing events
INSERT INTO public.eventos (nombre, slug, descripcion, featured, activo) VALUES
  ('Día de la Novia', 'dia-de-la-novia', 'Encuentra el regalo perfecto para celebrar el amor', true, true),
  ('Día de la Madre', 'dia-de-la-madre', 'Regalos especiales para mamá', false, true),
  ('Día de la Mujer', 'dia-de-la-mujer', 'Celebra su fuerza y dedicación', false, true),
  ('San Valentín', 'san-valentin', 'El amor se celebra con detalles únicos', false, true),
  ('Flores Amarillas', 'flores-amarillas', 'La tradición de regalar flores amarillas', false, true),
  ('Personalizados', 'personalizados', 'Diseños únicos tejidos a mano', false, true),
  ('HotWheels', 'hotwheels', 'Para los coleccionistas más exigentes', false, true)
ON CONFLICT (slug) DO NOTHING;
