import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export const DEFAULT_EVENTOS = [
  { id: -1, nombre: "Flores Amarillas", slug: "flores-amarillas", featured: true, activo: true },
  { id: -2, nombre: "Día de la Madre", slug: "dia-de-la-madre", featured: false, activo: true },
  { id: -3, nombre: "Día de la Mujer", slug: "dia-de-la-mujer", featured: false, activo: true },
  { id: -4, nombre: "Día de la Novia", slug: "dia-de-la-novia", featured: false, activo: true },
  { id: -5, nombre: "HotWheels", slug: "hotwheels", featured: false, activo: true },
  { id: -6, nombre: "Personalizados", slug: "personalizados", featured: false, activo: true },
  { id: -7, nombre: "San Valentín", slug: "san-valentin", featured: false, activo: true },
];

export async function GET() {
  try {
    const { data } = await supabaseAdmin
      .from("eventos")
      .select("*")
      .order("featured", { ascending: false })
      .order("nombre", { ascending: true });

    const dbEvents = (data || []).filter((e: any) => e.activo !== false);

    // Si la BD no tiene algunos de los eventos predeterminados, los incorporamos
    const dbSlugs = new Set((data || []).map((e: any) => e.slug));
    const missingDefaults = DEFAULT_EVENTOS.filter((d) => !dbSlugs.has(d.slug));

    const allEventos = [...dbEvents, ...missingDefaults];

    return NextResponse.json(allEventos);
  } catch {
    return NextResponse.json(DEFAULT_EVENTOS);
  }
}
