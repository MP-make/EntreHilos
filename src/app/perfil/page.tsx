"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  UserCircle, Package, Bell, LogOut, Home,
  Clock, CheckCircle2, XCircle, Loader2, ChevronRight,
  Mail, Phone, Calendar, Ruler
} from "lucide-react";

type Tab = "perfil" | "pedidos" | "notificaciones";

interface Pedido {
  id: number;
  created_at: string;
  cliente_nombre: string;
  items: any;
  total: number;
  estado: string;
}

interface PedidoPersonalizado {
  id: number;
  created_at: string;
  producto_nombre: string | null;
  detalles: string;
  tamano: string | null;
  extras: string | null;
  estado: string;
  fecha_entrega: string | null;
}

const menuItems: { id: Tab; label: string; icon: any }[] = [
  { id: "perfil", label: "Mi perfil", icon: UserCircle },
  { id: "pedidos", label: "Mis pedidos", icon: Package },
  { id: "notificaciones", label: "Notificaciones", icon: Bell },
];

const estados: Record<string, { label: string; color: string; icon: any }> = {
  pendiente: { label: "Pendiente", color: "text-amber-600 bg-amber-50", icon: Clock },
  confirmado: { label: "Confirmado", color: "text-blue-600 bg-blue-50", icon: CheckCircle2 },
  enviado: { label: "Enviado", color: "text-purple-600 bg-purple-50", icon: Package },
  entregado: { label: "Entregado", color: "text-green-600 bg-green-50", icon: CheckCircle2 },
  cancelado: { label: "Cancelado", color: "text-red-600 bg-red-50", icon: XCircle },
};

export default function PerfilPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("perfil");
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [personalizados, setPersonalizados] = useState<PedidoPersonalizado[]>([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user || tab !== "pedidos") return;
    (async () => {
      setLoadingPedidos(true);
      try {
        const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
        const supabase = getSupabaseBrowserClient();
        const email = user.email;

        const [pedidosRes, personalizadosRes] = await Promise.all([
          supabase.from("pedidos").select("*").eq("cliente_email", email).order("created_at", { ascending: false }),
          supabase.from("pedidos_personalizados").select("*").eq("email", email).order("created_at", { ascending: false }),
        ]);

        if (pedidosRes.data) setPedidos(pedidosRes.data);
        if (personalizadosRes.data) setPersonalizados(personalizadosRes.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingPedidos(false);
      }
    })();
  }, [user, tab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF4F7]">
        <Loader2 size={32} className="animate-spin text-[#EE6B8D]" />
      </div>
    );
  }

  if (!user) return null;

  const nombre = user.user_metadata?.full_name || user.email?.split("@")[0] || "Usuario";
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* User info */}
      <div className="p-6 border-b border-[#FDE8EF]">
        <div className="flex items-center gap-3">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={nombre}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#EE6B8D]"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EE6B8D] to-[#C04267] flex items-center justify-center text-white font-fredoka font-bold text-lg">
              {nombre.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-fredoka text-sm font-bold text-[#4A4A4A] truncate">{nombre}</p>
            <p className="font-quicksand text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-quicksand text-sm font-semibold transition-all text-left ${
                active
                  ? "bg-[#FDF4F7] text-[#EE6B8D] shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Icon size={20} strokeWidth={active ? 2.5 : 1.5} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-3 border-t border-[#FDE8EF] space-y-1">
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-quicksand text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
        >
          <Home size={20} strokeWidth={1.5} />
          Ir a inicio
        </Link>
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-quicksand text-sm font-semibold text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut size={20} strokeWidth={1.5} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF4F7] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 sm:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed sm:sticky top-0 left-0 z-50 h-screen w-72 bg-white shadow-lg border-r border-[#FDE8EF] transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile hamburger */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 sm:hidden w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {/* Main content */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 pt-20 sm:pt-8">
        <div className="max-w-3xl mx-auto">
          {tab === "perfil" && (
            <div className="space-y-6">
              <h2 className="font-fredoka text-xl font-bold text-[#C04267]">Información personal</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#FDE8EF]">
                  <UserCircle size={20} className="text-[#EE6B8D]" />
                  <div>
                    <p className="font-quicksand text-xs text-gray-400">Nombre</p>
                    <p className="font-quicksand text-sm font-semibold text-gray-800">{nombre}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#FDE8EF]">
                  <Mail size={20} className="text-[#EE6B8D]" />
                  <div>
                    <p className="font-quicksand text-xs text-gray-400">Correo electrónico</p>
                    <p className="font-quicksand text-sm font-semibold text-gray-800">{user.email}</p>
                  </div>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-[#FDE8EF]">
                    <Phone size={20} className="text-[#EE6B8D]" />
                    <div>
                      <p className="font-quicksand text-xs text-gray-400">Teléfono</p>
                      <p className="font-quicksand text-sm font-semibold text-gray-800">{user.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === "pedidos" && (
            <div>
              <h2 className="font-fredoka text-xl font-bold text-[#C04267] mb-6">Mis pedidos</h2>
              {loadingPedidos ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 size={24} className="animate-spin text-[#EE6B8D]" />
                </div>
              ) : pedidos.length === 0 && personalizados.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-[#FDE8EF]">
                  <Package size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="font-quicksand text-sm text-gray-500">No tienes pedidos aún</p>
                  <Link
                    href="/"
                    className="inline-block mt-4 font-quicksand text-sm text-white bg-gradient-to-r from-[#EE6B8D] to-[#C04267] px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Empezar a comprar
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {personalizados.map((p) => {
                    const EstadoIcon = estados[p.estado]?.icon || Clock;
                    return (
                      <div key={`pc-${p.id}`} className="bg-white rounded-xl border border-[#FDE8EF] p-4 hover:border-[#EE6B8D] transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-fredoka text-sm font-bold text-[#C04267] truncate">
                              {p.producto_nombre || "Pedido personalizado"}
                            </p>
                            <p className="font-quicksand text-xs text-gray-400 mt-1">
                              {new Date(p.created_at).toLocaleDateString("es-PE", {
                                day: "numeric", month: "long", year: "numeric",
                              })}
                            </p>
                            {p.detalles && (
                              <p className="font-quicksand text-xs text-gray-500 mt-2 line-clamp-2">{p.detalles}</p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-2">
                              {p.tamano && (
                                <span className="font-quicksand text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full capitalize flex items-center gap-1">
                                  <Ruler size={10} /> {p.tamano}
                                </span>
                              )}
                              {p.fecha_entrega && (
                                <span className="font-quicksand text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1">
                                  <Calendar size={10} /> {new Date(p.fecha_entrega).toLocaleDateString("es-PE")}
                                </span>
                              )}
                              {p.extras && (
                                <span className="font-quicksand text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                  {p.extras}
                                </span>
                              )}
                            </div>
                          </div>
                          <span className={`flex items-center gap-1 font-quicksand text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${estados[p.estado]?.color || "text-gray-500 bg-gray-100"}`}>
                            <EstadoIcon size={12} />
                            {estados[p.estado]?.label || p.estado}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  {pedidos.map((p) => {
                    const EstadoIcon = estados[p.estado]?.icon || Clock;
                    return (
                      <div key={`pd-${p.id}`} className="bg-white rounded-xl border border-[#FDE8EF] p-4 hover:border-[#EE6B8D] transition-colors">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <p className="font-fredoka text-sm font-bold text-[#C04267]">Pedido #{p.id}</p>
                            <p className="font-quicksand text-xs text-gray-400 mt-1">
                              {new Date(p.created_at).toLocaleDateString("es-PE", {
                                day: "numeric", month: "long", year: "numeric",
                              })}
                            </p>
                            <p className="font-quicksand text-xs text-gray-700 mt-1 font-semibold">S/ {p.total.toFixed(2)}</p>
                          </div>
                          <span className={`flex items-center gap-1 font-quicksand text-[11px] font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ${estados[p.estado]?.color || "text-gray-500 bg-gray-100"}`}>
                            <EstadoIcon size={12} />
                            {estados[p.estado]?.label || p.estado}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === "notificaciones" && (
            <div>
              <h2 className="font-fredoka text-xl font-bold text-[#C04267] mb-6">Notificaciones</h2>
              <div className="text-center py-16 bg-white rounded-2xl border border-[#FDE8EF]">
                <Bell size={48} className="mx-auto text-gray-200 mb-4" />
                <p className="font-quicksand text-sm text-gray-500">No tienes notificaciones</p>
                <p className="font-quicksand text-xs text-gray-400 mt-1">Te avisaremos cuando tus pedidos tengan actualizaciones</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
