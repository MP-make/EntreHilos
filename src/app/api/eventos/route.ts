import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { data } = await supabaseAdmin
      .from("eventos")
      .select("*")
      .eq("activo", true)
      .order("featured", { ascending: false })
      .order("nombre", { ascending: true });
    return NextResponse.json(data || []);
  } catch {
    return NextResponse.json([]);
  }
}
