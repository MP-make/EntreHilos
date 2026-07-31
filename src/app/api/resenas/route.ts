import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("resenas")
      .select("*")
      .eq("aprobado", true)
      .order("created_at", { ascending: false });

    if (error) {
      if (error.message?.includes("does not exist")) {
        console.warn("Tabla 'resenas' no existe aún. Ejecuta la migración 012_resenas.sql.");
        return NextResponse.json([]);
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("Error obteniendo reseñas:", e);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { producto_id, producto_sku, producto_nombre, nombre_cliente, calificacion, comentario } = body;

  if (!producto_id) {
    return NextResponse.json({ error: "producto_id es requerido" }, { status: 400 });
  }

  const stars = Number(calificacion);
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
    return NextResponse.json({ error: "La calificación debe ser un número entre 1 y 5" }, { status: 400 });
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("resenas")
      .insert({
        producto_id,
        producto_sku: producto_sku || null,
        producto_nombre: producto_nombre || null,
        nombre_cliente: (nombre_cliente || "Cliente").toString().trim().slice(0, 60),
        calificacion: stars,
        comentario: comentario ? comentario.toString().trim().slice(0, 500) : null,
        aprobado: false,
        es_manual: false,
      })
      .select()
      .single();

    if (error) {
      if (error.message?.includes("does not exist")) {
        return NextResponse.json({ error: "El sistema de calificaciones aún no está configurado. Intenta más tarde." }, { status: 503 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(data);
  } catch (e) {
    console.error("Error guardando reseña:", e);
    return NextResponse.json({ error: "Error guardando la calificación" }, { status: 500 });
  }
}
