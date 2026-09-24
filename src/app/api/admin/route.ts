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
  precios: "precios_tamanos",
};

const ORDER_COLUMN: Record<string, string> = {
  heroes: "updated_at",
  inicio: "orden",
};

const DEFAULT_EVENTOS = [
  { id: -1, nombre: "Flores Amarillas", slug: "flores-amarillas", featured: true, activo: true },
  { id: -2, nombre: "Día de la Madre", slug: "dia-de-la-madre", featured: false, activo: true },
  { id: -3, nombre: "Día de la Mujer", slug: "dia-de-la-mujer", featured: false, activo: true },
  { id: -4, nombre: "Día de la Novia", slug: "dia-de-la-novia", featured: false, activo: true },
  { id: -5, nombre: "HotWheels", slug: "hotwheels", featured: false, activo: true },
  { id: -6, nombre: "Personalizados", slug: "personalizados", featured: false, activo: true },
  { id: -7, nombre: "San Valentín", slug: "san-valentin", featured: false, activo: true },
];

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
      return NextResponse.json(tab === "eventos" ? DEFAULT_EVENTOS : []);
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (tab === "eventos") {
    const dbEvents = data || [];
    const dbSlugs = new Set(dbEvents.map((e: any) => e.slug));
    const missingDefaults = DEFAULT_EVENTOS.filter((d) => !dbSlugs.has(d.slug));
    return NextResponse.json([...dbEvents, ...missingDefaults]);
  }

  if (tab === "inicio") {
    const sections = data || [];
    const hasRotonda = sections.some((s: any) => s.section_key === "campana_rotonda");
    if (!hasRotonda) {
      const defaultRotonda = {
        id: -99,
        section_key: "campana_rotonda",
        tipo: "content",
        titulo: "Así se vivieron nuestras campañas",
        subtitulo: "Momentos y Entregas Reales",
        descripcion: "Fotos de clientes y pedidos que llevaron felicidad en nuestras fechas más especiales.",
        items: [
          {
            imagen: "https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1000&q=80",
            etiqueta: "Flores Amarillas",
            titulo: "Así floreció la alegría",
            descripcion: "Ramos eternos entregados con dedicatorias especiales a personas que iluminan la vida.",
          },
          {
            imagen: "/dia-de-la-madre-horizontal.png",
            etiqueta: "Día de la Madre",
            titulo: "Sonrisas inolvidables para Mamá",
            descripcion: "Cajas decoradas, tulipanes y detalles tejidos que celebraron al ser más especial.",
          },
          {
            imagen: "/Dia-de-la-mujer-8M.png",
            etiqueta: "Día de la Mujer 8M",
            titulo: "Conmemorando con amor y admiración",
            descripcion: "Hermosos arreglos entregados en colegios, empresas y familias en toda la región.",
          },
          {
            imagen: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=1000&q=80",
            etiqueta: "San Valentín",
            titulo: "Historias de amor tejidas a mano",
            descripcion: "Sorpresas románticas personalizadas que hicieron latir corazones más fuerte.",
          },
        ],
        orden: 1,
        activo: true,
      };
      return NextResponse.json([defaultRotonda, ...sections]);
    }
    return NextResponse.json(sections);
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
    if (typeof id === "number" && id < 0) {
      const { error } = await supabaseAdmin
        .from("home_sections")
        .upsert({ ...updates, updated_at: new Date().toISOString() }, { onConflict: "section_key" });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }
    const { error } = await supabaseAdmin
      .from("home_sections")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  if (action === "actualizar-evento") {
    if (typeof id === "number" && id < 0) {
      const { error } = await supabaseAdmin
        .from("eventos")
        .upsert({ ...updates, updated_at: new Date().toISOString() }, { onConflict: "slug" });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ success: true });
    }
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

    if (typeof id === "number" && id < 0 && updates.slug) {
      await supabaseAdmin.from("eventos").upsert({ slug: updates.slug, nombre: updates.nombre || updates.slug, featured: true }, { onConflict: "slug" });
      return NextResponse.json({ success: true });
    }

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

  if (action === "actualizar-precios-tamanos") {
    const { sku, precio_pequeno, precio_mediano, precio_grande } = updates;
    if (!sku) return NextResponse.json({ error: "sku requerido" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from("precios_tamanos")
      .upsert(
        {
          sku,
          precio_pequeno: precio_pequeno ?? null,
          precio_mediano: precio_mediano ?? null,
          precio_grande: precio_grande ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "sku" }
      );
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
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
    const {
      descripcion,
      imagen_url,
      imagen_url_mobile,
      fecha_inicio,
      fecha_fin,
      mostrar_en_hero,
      activo,
      featured,
    } = body;

    if (featured) {
      await supabaseAdmin.from("eventos").update({ featured: false }).eq("featured", true);
    }

    const { data, error } = await supabaseAdmin
      .from("eventos")
      .insert({
        nombre,
        slug,
        descripcion: descripcion || null,
        imagen_url: imagen_url || null,
        imagen_url_mobile: imagen_url_mobile || null,
        fecha_inicio: fecha_inicio || null,
        fecha_fin: fecha_fin || null,
        mostrar_en_hero: mostrar_en_hero !== false,
        activo: activo !== false,
        featured: Boolean(featured),
        fotos_campana: body.fotos_campana || [],
      })
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  return NextResponse.json({ error: "nombre and slug required" }, { status: 400 });
}
