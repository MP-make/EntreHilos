-- ============================================================
-- MIGRACIÓN 016: SECCIÓN ROTONDA 3D DE CAMPAÑAS Y EXPERIENCIAS
-- ============================================================

INSERT INTO public.home_sections (
  section_key,
  tipo,
  titulo,
  subtitulo,
  descripcion,
  items,
  orden,
  activo
) VALUES (
  'campana_rotonda',
  'content',
  'Así se vivieron nuestras campañas',
  'Momentos y Entregas Reales',
  'Fotos de clientes y pedidos que llevaron felicidad en nuestras fechas más especiales.',
  '[
    {
      "imagen": "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1000&q=80",
      "etiqueta": "Flores Amarillas",
      "titulo": "Así floreció la alegría",
      "descripcion": "Ramos eternos entregados con dedicatorias especiales a personas que iluminan la vida."
    },
    {
      "imagen": "/dia-de-la-madre-horizontal.png",
      "etiqueta": "Día de la Madre",
      "titulo": "Sonrisas inolvidables para Mamá",
      "descripcion": "Cajas decoradas, tulipanes y detalles tejidos que celebraron al ser más especial."
    },
    {
      "imagen": "/Dia-de-la-mujer-8M.png",
      "etiqueta": "Día de la Mujer 8M",
      "titulo": "Conmemorando con amor y admiración",
      "descripcion": "Hermosos arreglos entregados en colegios, empresas y familias en toda la región."
    },
    {
      "imagen": "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1000&q=80",
      "etiqueta": "San Valentín",
      "titulo": "Historias de amor tejidas a mano",
      "descripcion": "Sorpresas románticas personalizadas que hicieron latir corazones más fuerte."
    }
  ]'::jsonb,
  1,
  true
)
ON CONFLICT (section_key) DO NOTHING;
