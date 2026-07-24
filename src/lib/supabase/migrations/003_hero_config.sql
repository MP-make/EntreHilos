-- Hero configuration — editable image URLs for each page/section
CREATE TABLE public.hero_config (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  clave text NOT NULL UNIQUE,
  titulo text,
  imagen_url text NOT NULL,
  imagen_url_mobile text,
  link_url text,
  activo boolean DEFAULT true,
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT hero_config_pkey PRIMARY KEY (id)
);

COMMENT ON TABLE public.hero_config IS 'Hero images editable from admin panel';
COMMENT ON COLUMN public.hero_config.clave IS 'Unique key like home_hero_1, evento_dia_de_la_madre, etc.';

-- Seed default hero configs
INSERT INTO public.hero_config (clave, titulo, imagen_url, link_url) VALUES
  ('home_hero_1', 'Hero principal — Inicio', '/dia-de-la-madre-horizontal.png', '/evento/dia-de-la-madre'),
  ('evento_dia_de_la_madre', 'Día de la Madre', '/dia de las madres tarjeta.png', NULL),
  ('evento_dia_de_la_mujer', 'Día de la Mujer', '/Dia-de-la-mujer-8M.webp', NULL)
ON CONFLICT (clave) DO NOTHING;

ALTER TABLE public.hero_config ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (admin)
CREATE POLICY "Service role full access"
  ON public.hero_config
  USING (true)
  WITH CHECK (true);

-- Allow public read for active heroes
CREATE POLICY "Public read active"
  ON public.hero_config FOR SELECT
  USING (activo = true);

-- Update profiles table to ensure telefono column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS direccion text;
