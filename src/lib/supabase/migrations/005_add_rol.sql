-- Add rol column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS rol text NOT NULL DEFAULT 'user';

-- Para asignarte como admin, ejecuta en el SQL Editor de Supabase:
-- UPDATE public.profiles SET rol = 'admin' WHERE email = 'tu-email@gmail.com';
