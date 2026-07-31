-- ============================================================
-- MIGRACIÓN 008: HOME SECTIONS (editable homepage content)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.home_sections (
  id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
  section_key TEXT NOT NULL UNIQUE,
  tipo TEXT NOT NULL DEFAULT 'content' CHECK (tipo IN ('content', 'showcase', 'faq')),
  titulo TEXT,
  subtitulo TEXT,
  descripcion TEXT,
  imagen_url TEXT,
  link_url TEXT,
  link_text TEXT,
  items JSONB,
  orden INTEGER DEFAULT 0,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT home_sections_pkey PRIMARY KEY (id)
);

COMMENT ON TABLE public.home_sections IS 'Secciones editables de la página de inicio';

ALTER TABLE public.home_sections ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (admin)
CREATE POLICY "Service role full access"
  ON public.home_sections
  USING (true)
  WITH CHECK (true);

-- Allow public read for active sections
CREATE POLICY "Public read active"
  ON public.home_sections FOR SELECT
  USING (activo = true);

-- Seed initial sections
INSERT INTO public.home_sections (section_key, tipo, titulo, subtitulo, descripcion, imagen_url, link_url, link_text, items, orden) VALUES
('about_us', 'content', '¿Quiénes Somos?', 'Arte tejido a mano con amor', 'En Entre Hilos creamos detalles únicos tejidos a crochet con hilos de algodón premium. Cada pieza es elaborada artesanalmente, pensada para regalar momentos especiales que perduren en el tiempo. Desde ramos de flores eternas hasta amigurumis personalizados, convertimos tus ideas en realidad.', NULL, '/nosotros', 'Conoce más', NULL, 1),
('showcase', 'showcase', 'Lo que Hacemos', 'Creaciones únicas para cada ocasión', 'Descubre nuestra variedad de productos artesanales, todos tejidos a mano con los mejores materiales.', NULL, '/catalogo', 'Ver Catálogo', '[
  {"titulo": "Ramos de Flores", "descripcion": "Ramos eternos tejidos a crochet que nunca se marchitan. Perfectos para regalar en cualquier ocasión especial.", "imagen": null, "sku": null},
  {"titulo": "Amigurumis", "descripcion": "Muñecos tejidos a mano, personalizables con el diseño de tus personajes favoritos.", "imagen": null, "sku": null},
  {"titulo": "Cajas Regalo", "descripcion": "Cajas decoradas con detalles en crochet, ideales para sorprender a alguien especial.", "imagen": null, "sku": null},
  {"titulo": "HotWheels", "descripcion": "Autitos tejidos a crochet, perfectos para los pequeños (y no tan pequeños) coleccionistas.", "imagen": null, "sku": null}
]'::jsonb, 2),
('custom_amigurumi', 'content', 'Tu Personaje Favorito Tejido', 'Convertimos tus ideas en realidad', '¿Imaginas tener a tu personaje favorito tejido a crochet? Nosotros lo hacemos posible. Envíanos una foto o descripción y creamos un amigurumi único y personalizado. El límite es tu imaginación.', NULL, '/personalizados', 'Pedir el mío', NULL, 3),
('faq', 'faq', 'Preguntas Frecuentes', 'Todo lo que necesitas saber', 'Resuelve tus dudas sobre nuestros productos, envíos y más.', NULL, NULL, NULL, '[
  {"pregunta": "¿Hacen envíos a todo el Perú?", "respuesta": "Sí, realizamos envíos a todo el Perú a través de empresas de courier. El tiempo de entrega varía según la ubicación, generalmente de 3 a 7 días hábiles."},
  {"pregunta": "¿Trabajan con empresas para regalos corporativos?", "respuesta": "¡Sí! Trabajamos con empresas haciendo regalos en cantidad para sus trabajadores, campañas y ocasiones especiales. Contáctanos para cotizar tu pedido corporativo."},
  {"pregunta": "¿Cuánto tiempo toma hacer un pedido personalizado?", "respuesta": "Dependiendo de la complejidad, los pedidos personalizados pueden tomar de 1 a 2 semanas. Contáctanos para darte un plazo exacto según tu diseño."},
  {"pregunta": "¿Cómo cuido mi producto de crochet?", "respuesta": "Recomendamos limpiar suavemente con un paño húmedo y evitar la exposición directa al sol por largos periodos para mantener los colores vibrantes."},
  {"pregunta": "¿Cómo puedo pagar mi pedido?", "respuesta": "Aceptamos transferencias bancarias, Yape, Plin y efectivo. Una vez confirmado tu pedido, te enviaremos los datos de pago."},
  {"pregunta": "¿Puedo personalizar un producto existente?", "respuesta": "¡Claro! Muchos de nuestros productos pueden personalizarse con colores, detalles y mensajes especiales. Contáctanos para coordinar."}
]'::jsonb, 4)
ON CONFLICT (section_key) DO NOTHING;
