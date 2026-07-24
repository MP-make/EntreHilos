import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { type, data } = body;

  if (!type || !data) {
    return NextResponse.json({ error: "type and data are required" }, { status: 400 });
  }

  const TABLE_MAP: Record<string, string> = {
    pedido: "pedidos",
    mensaje: "mensajes_contacto",
    reclamacion: "libro_reclamaciones",
    personalizado: "pedidos_personalizados",
  };

  const table = TABLE_MAP[type];
  if (!table) {
    return NextResponse.json({ error: `Invalid type: ${type}` }, { status: 400 });
  }

  const { error } = await supabaseAdmin.from(table).insert([data]);

  if (error) {
    console.error(`Error inserting ${type}:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
