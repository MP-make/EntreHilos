import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

const TABLES: Record<string, string> = {
  suscriptores: "suscriptores",
  pedidos: "pedidos",
  mensajes: "mensajes_contacto",
  reclamaciones: "libro_reclamaciones",
  personalizados: "pedidos_personalizados",
  heroes: "hero_config",
  usuarios: "profiles",
  inicio: "home_sections",
  eventos: "eventos",
  resenas: "resenas",
  productos: "productos_inactivos",
};

const ORDER_COLUMN: Record<string, string> = {
  heroes: "updated_at",
  inicio: "orden",
};

export async function GET(request: NextRequest) {
  const tab = request.nextUrl.searchParams.get("tab") || "suscriptores";
  const table = TABLES[tab];
  if (!table) return NextResponse.json({ error: "Invalid tab" }, { status: 400 });

  const orderCol = ORDER_COLUMN[tab] || "created_at";

  const { data, error } = await supabaseAdmin
    .from(table)
    .select("*")
    .order(orderCol, { ascending: false });

  if (error) {
    if (error.message?.includes("does not exist")) {
      console.warn(`Tabla '${table}' no existe aún.`);
      return NextResponse.json([]);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { action, id, ...updates } = body;

  if (action === "marcar-leido") {
    const { error } = await supabaseAdmin
      .from("mensajes_contacto")
      .update({ leido: true })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "cambiar-estado") {
    const { error } = await supabaseAdmin
      .from("pedidos")
      .update({ estado: updates.estado })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "actualizar-hero") {
    const { error } = await supabaseAdmin
      .from("hero_config")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "personalizado-estado") {
    const { error } = await supabaseAdmin
      .from("pedidos_personalizados")
      .update({ estado: updates.estado })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "actualizar-seccion") {
    const { error } = await supabaseAdmin
      .from("home_sections")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "actualizar-evento") {
    const { error } = await supabaseAdmin
      .from("eventos")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "destacar-evento") {
    const { error: err1 } = await supabaseAdmin
      .from("eventos")
      .update({ featured: false })
      .eq("featured", true);
    if (err1) return NextResponse.json({ error: err1.message }, { status: 500 });
    const { error: err2 } = await supabaseAdmin
      .from("eventos")
      .update({ featured: true, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (err2) return NextResponse.json({ error: err2.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "eliminar-evento") {
    const { error } = await supabaseAdmin
      .from("eventos")
      .delete()
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "aprobar-resena") {
    const { error } = await supabaseAdmin
      .from("resenas")
      .update({ aprobado: updates.aprobado, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "eliminar-resena") {
    const { error } = await supabaseAdmin
      .from("resenas")
      .delete()
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "set-producto-activo") {
    const { producto_id, activo } = updates;
    if (!producto_id) return NextResponse.json({ error: "producto_id requerido" }, { status: 400 });

    if (activo) {
      const { error } = await supabaseAdmin
        .from("productos_inactivos")
        .delete()
        .eq("producto_id", producto_id);
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      const { error } = await supabaseAdmin
        .from("productos_inactivos")
        .upsert({ producto_id }, { onConflict: "producto_id" });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { clave, titulo, subtitulo, descripcion, badge, precio, producto_sku, tipo, imagen_url, imagen_url_mobile, link_url, nombre, slug, resena } = body;

  if (resena) {
    const { data, error } = await supabaseAdmin
      .from("resenas")
      .insert({
        producto_id: resena.producto_id,
        producto_sku: resena.producto_sku || null,
        producto_nombre: resena.producto_nombre || null,
        nombre_cliente: (resena.nombre_cliente || "Admin").toString().trim().slice(0, 60),
        calificacion: resena.calificacion,
        comentario: resena.comentario || null,
        aprobado: true,
        es_manual: true,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (clave) {
    const { data, error } = await supabaseAdmin
      .from("hero_config")
      .insert({
        clave,
        titulo: titulo || "",
        subtitulo: subtitulo || null,
        descripcion: descripcion || null,
        badge: badge || null,
        precio: precio || null,
        producto_sku: producto_sku || null,
        tipo: tipo || "flyer",
        imagen_url: imagen_url || "",
        imagen_url_mobile: imagen_url_mobile || null,
        link_url: link_url || null,
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  if (nombre && slug) {
    const { data, error } = await supabaseAdmin
      .from("eventos")
      .insert({ nombre, slug, descripcion: descripcion || null, imagen_url: imagen_url || null })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "nombre and slug required" }, { status: 400 });
}
