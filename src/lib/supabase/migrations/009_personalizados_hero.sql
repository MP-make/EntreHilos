-- ============================================================
-- MIGRACIÓN 009: PERSONALIZADOS HERO (editable hero content)
-- ============================================================

ALTER TABLE public.home_sections
  DROP CONSTRAINT IF EXISTS home_sections_tipo_check;

ALTER TABLE public.home_sections
  ADD CONSTRAINT home_sections_tipo_check
  CHECK (tipo IN ('content', 'showcase', 'faq', 'personalizados'));

INSERT INTO public.home_sections (section_key, tipo, titulo, subtitulo, descripcion, items, orden, activo)
VALUES (
  'personalizados_hero',
  'personalizados',
  'Tú lo imaginas, nosotros lo tejemos',
  'Convertimos tus ideas en amigurumis únicos. Personajes, mascotas o diseños personalizados tejidos a mano con algodón premium.',
  NULL,
  '{
    "badge": "Hecho 100% a mano en Perú",
    "titulo_linea1": "Tú lo imaginas,",
    "titulo_linea2": "nosotros lo tejemos",
    "boton_primario": "Iniciar sesión",
    "boton_primario_logged": "Personalizar",
    "boton_secundario": "Ver trabajos",
    "estadistica": "+200 diseños entregados",
    "etiqueta_precio": "Desde",
    "valor_precio": "S/ 80"
  }'::jsonb,
  0,
  true
)
ON CONFLICT (section_key) DO NOTHING;
