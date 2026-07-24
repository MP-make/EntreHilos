"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, ShoppingBag, MessageSquare, ClipboardList, Mail,
  Image as ImageIcon, Users, LogOut, Home, Loader2, Eye, ExternalLink,
  UserCheck, Upload, X, Check, ChevronRight, Search,
} from "lucide-react";
import { getVentifyProducts } from "@/lib/ventify";

type Tab = "dashboard" | "pedidos" | "mensajes" | "reclamaciones" | "personalizados" | "heroes" | "suscriptores" | "usuarios";

const menuItems: { id: Tab; label: string; icon: any }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "pedidos", label: "Pedidos", icon: ShoppingBag },
  { id: "personalizados", label: "Personalizados", icon: Mail },
  { id: "mensajes", label: "Mensajes", icon: MessageSquare },
  { id: "reclamaciones", label: "Reclamaciones", icon: ClipboardList },
  { id: "heroes", label: "Heroes", icon: ImageIcon },
  { id: "suscriptores", label: "Suscriptores", icon: Users },
  { id: "usuarios", label: "Usuarios", icon: UserCheck },
];

const ALL_HERO_KEYS: { clave: string; label: string }[] = [
  { clave: "home_hero_1", label: "Inicio - Slide 1 (Flyer)" },
  { clave: "home_hero_2", label: "Inicio - Slide 2 (Especial)" },
  { clave: "home_hero_3", label: "Inicio - Slide 3 (Personajes)" },
  { clave: "home_hero_4", label: "Inicio - Slide 4 (A tu medida)" },
  { clave: "evento_dia_de_la_madre", label: "Día de la Madre" },
  { clave: "evento_dia_de_la_mujer", label: "Día de la Mujer" },
  { clave: "evento_san_valentin", label: "San Valentín" },
  { clave: "evento_dia_de_la_novia", label: "Día de la Novia" },
  { clave: "evento_flores_amarillas", label: "Flores Amarillas" },
  { clave: "evento_personalizados", label: "Personalizados" },
  { clave: "evento_hotwheels", label: "HotWheels" },
];

const PRODUCT_SLIDES = ['home_hero_2', 'home_hero_3', 'home_hero_4'];

function isProductSlide(clave: string) {
  return PRODUCT_SLIDES.includes(clave);
}

function formatDate(v: string | null | undefined) {
  if (!v) return "-";
  return new Date(v).toLocaleDateString("es-PE", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatValue(key: string, value: any) {
  if (value === null || value === undefined) return "-";
  if (key === "created_at" || key === "updated_at") return formatDate(value);
  if (key === "leido") return value ? "Sí" : "No";
  if (key === "activo") return value ? "Activo" : "Inactivo";
  if (typeof value === "object") {
    const s = JSON.stringify(value);
    return s.length > 80 ? s.substring(0, 80) + "…" : s;
  }
  return String(value);
}

function getColumns(data: any[]): string[] {
  if (data.length === 0) return [];
  return Object.keys(data[0]).filter((k) => k !== "id");
}

export default function AdminPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [tempUploading, setTempUploading] = useState(false);
  const [tempUploadingMobile, setTempUploadingMobile] = useState(false);
  const [heroDragOver, setHeroDragOver] = useState<number | null>(null);
  const [editingHero, setEditingHero] = useState<{ clave: string; label: string } | undefined>(undefined);
  const [editUrl, setEditUrl] = useState("");
  const [editUrlMobile, setEditUrlMobile] = useState("");
  const [editTitulo, setEditTitulo] = useState("");
  const [editSubtitulo, setEditSubtitulo] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editBadge, setEditBadge] = useState("");
  const [editPrecio, setEditPrecio] = useState("");
  const [editProductoSku, setEditProductoSku] = useState("");
  const [editTipo, setEditTipo] = useState("flyer");
  const [editLinkUrl, setEditLinkUrl] = useState("");
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [productSearch, setProductSearch] = useState("");
  const [showProductPicker, setShowProductPicker] = useState(false);
  const tempFileRef = useRef<HTMLInputElement | null>(null);
  const tempFileRefMobile = useRef<HTMLInputElement | null>(null);

  const selectedClave = editingHero?.clave ?? "";
  const existingHero = data.find((h: any) => h.clave === selectedClave);
  const isNewHero = !existingHero;

  function esUrlImagen(text: string): boolean {
    const t = text.trim();
    if (!t.startsWith("http://") && !t.startsWith("https://") && !t.startsWith("/")) return false;
    if (/\.(jpe?g|png|gif|webp|bmp|avif|svg)(\?\S*)?$/i.test(t)) return true;
    if (/^https?:\/\//.test(t)) return true;
    return false;
  }

  async function subirHeroFileTemp(file: File) {
    setTempUploading(true);
    try {
      const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
      const supabase = getSupabaseBrowserClient();
      const ext = file.name.split(".").pop() || "jpg";
      const nombre = `hero-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("heroes").upload(nombre, file, { upsert: true });
      if (error) { console.error(error); return; }
      const { data: pub } = supabase.storage.from("heroes").getPublicUrl(nombre);
      setEditUrl(pub.publicUrl);
    } catch (e) { console.error(e); }
    finally { setTempUploading(false); }
  }

  async function subirHeroFileTempMobile(file: File) {
    setTempUploadingMobile(true);
    try {
      const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
      const supabase = getSupabaseBrowserClient();
      const ext = file.name.split(".").pop() || "jpg";
      const nombre = `hero-mobile-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("heroes").upload(nombre, file, { upsert: true });
      if (error) { console.error(error); return; }
      const { data: pub } = supabase.storage.from("heroes").getPublicUrl(nombre);
      setEditUrlMobile(pub.publicUrl);
    } catch (e) { console.error(e); }
    finally { setTempUploadingMobile(false); }
  }

  async function handleHeroSave() {
    const heroData = {
      imagen_url: editUrl,
      imagen_url_mobile: editUrlMobile,
      titulo: editTitulo,
      subtitulo: editSubtitulo || null,
      descripcion: editDescripcion || null,
      badge: editBadge || null,
      precio: editPrecio ? parseFloat(editPrecio) : null,
      producto_sku: editProductoSku || null,
      tipo: editTipo,
      link_url: editLinkUrl || null,
    };
    if (isNewHero) {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clave: selectedClave, ...heroData }),
      });
      if (res.ok) { fetchData(); setEditingHero(undefined); }
    } else {
      const ok = await apiPatch({ action: "actualizar-hero", id: existingHero.id, ...heroData });
      if (ok) { fetchData(); setEditingHero(undefined); }
    }
  }

  useEffect(() => {
    (async () => {
      const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
      const supabase = getSupabaseBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/"); return; }
      const { data: profile } = await supabase
        .from("profiles")
        .select("rol")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.rol !== "admin") { router.push("/"); return; }
      setAuthorized(true);
    })();
  }, [router]);

  const fetchData = useCallback(async () => {
    if (tab === "dashboard") { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin?tab=${tab}`);
      const json = await res.json();
      setData(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error(e);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (editingHero) {
      const hero = data.find((h: any) => h.clave === editingHero.clave);
      setEditUrl(hero?.imagen_url || "");
      setEditUrlMobile(hero?.imagen_url_mobile || "");
      setEditTitulo(hero?.titulo || editingHero.label);
      setEditSubtitulo(hero?.subtitulo || "");
      setEditDescripcion(hero?.descripcion || "");
      setEditBadge(hero?.badge || "");
      setEditPrecio(hero?.precio?.toString() || "");
      setEditProductoSku(hero?.producto_sku || "");
      setEditTipo(hero?.tipo || "flyer");
      setEditLinkUrl(hero?.link_url || "");
      setProductSearch("");
      if (isProductSlide(editingHero.clave) && allProducts.length === 0) {
        getVentifyProducts().then(setAllProducts).catch(() => {});
      }
    }
  }, [editingHero, data]);

  async function apiPatch(body: Record<string, any>) {
    const res = await fetch("/api/admin", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.ok;
  }

  const handleMarcarLeido = async (id: number) => {
    const ok = await apiPatch({ action: "marcar-leido", id });
    if (ok) setData((prev) => prev.map((item: any) => item.id === id ? { ...item, leido: true } : item));
  };

  const handleCambiarEstado = async (id: number, estado: string) => {
    const ok = await apiPatch({ action: "cambiar-estado", id, estado });
    if (ok) setData((prev) => prev.map((item: any) => item.id === id ? { ...item, estado } : item));
  };

  const handlePersonalizadoEstado = async (id: number, estado: string) => {
    const ok = await apiPatch({ action: "personalizado-estado", id, estado });
    if (ok) fetchData();
  };

  async function handleSignOut() {
    const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
    const supabase = getSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/");
  }

  function whatsappLink(row: any) {
    const text = encodeURIComponent(
      `*Pedido #${row.id}*\nCliente: ${row.cliente_nombre || "-"}\nTel: ${row.cliente_telefono || "-"}\nTotal: S/ ${row.total || "0"}\nEstado: ${row.estado || "pendiente"}`
    );
    return `https://wa.me/51902578295?text=${text}`;
  }

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF4F7]">
        <Loader2 size={32} className="animate-spin text-[#EE6B8D]" />
      </div>
    );
  }

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-5 border-b border-[#FDE8EF]">
        <h1 className="font-fredoka text-lg font-bold text-[#C04267]">Admin</h1>
        <p className="font-quicksand text-xs text-gray-400">Entre Hilos</p>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = tab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-quicksand text-sm font-semibold transition-all text-left ${
                active
                  ? "bg-[#FDF4F7] text-[#EE6B8D] shadow-sm"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 1.5} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#FDE8EF] space-y-1">
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-quicksand text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-all"
        >
          <Home size={18} strokeWidth={1.5} />
          Ir a inicio
        </Link>
        <button onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-quicksand text-sm font-semibold text-red-400 hover:bg-red-50 hover:text-red-500 transition-all"
        >
          <LogOut size={18} strokeWidth={1.5} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDF4F7] flex">
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 sm:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed sm:sticky top-0 left-0 z-50 h-screen w-64 bg-white shadow-lg border-r border-[#FDE8EF] transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        }`}
      >
        {sidebarContent}
      </aside>

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

      <main className="flex-1 min-w-0 p-4 sm:p-8 pt-20 sm:pt-8">
        {tab === "dashboard" && (
          <div>
            <h2 className="font-fredoka text-xl font-bold text-[#C04267] mb-6">Dashboard</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {menuItems.filter(m => m.id !== "dashboard").map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setTab(item.id)}
                    className="bg-white rounded-xl border border-[#FDE8EF] p-5 text-left hover:border-[#EE6B8D] transition-all hover:shadow-sm"
                  >
                    <Icon size={24} className="text-[#EE6B8D] mb-3" />
                    <p className="font-quicksand text-sm font-semibold text-gray-700">{item.label}</p>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tab !== "dashboard" && loading && (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-[#EE6B8D]" />
          </div>
        )}

        {tab !== "dashboard" && !loading && data.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-[#FDE8EF]">
            <p className="font-quicksand text-gray-400">No hay datos</p>
          </div>
        )}

        {tab === "heroes" && !loading && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-fredoka text-xl font-bold text-[#C04267]">Heroes</h2>
              <button onClick={() => setEditingHero(ALL_HERO_KEYS[0])}
                className="flex items-center gap-2 text-xs text-white bg-[#EE6B8D] hover:bg-[#C04267] px-4 py-2.5 rounded-lg font-quicksand font-semibold transition-colors shadow-sm"
              >
                <Upload size={14} />
                Agregar / Editar
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {ALL_HERO_KEYS.map((hk) => {
                const hero = data.find((h: any) => h.clave === hk.clave);
                const imgUrl = hero?.imagen_url;
                return (
                  <button key={hk.clave}
                    onClick={() => setEditingHero(hk)}
                    className={`group relative aspect-video rounded-xl overflow-hidden border-2 transition-all bg-gray-50 ${
                      hero ? "border-transparent hover:border-[#EE6B8D]" : "border-dashed border-gray-200 hover:border-[#EE6B8D]"
                    }`}
                  >
                    {imgUrl ? (
                      <img src={imgUrl} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon size={28} className="text-gray-200" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                      <p className="font-quicksand text-xs font-semibold text-white">{hk.label}</p>
                    </div>
                    {hero?.imagen_url_mobile && (
                      <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-[9px] font-quicksand font-semibold text-gray-600 shadow-sm">
                        Móvil ✓
                      </div>
                    )}
                    {!hero && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="font-quicksand text-[10px] text-gray-300 bg-white/80 px-2 py-0.5 rounded-full">Sin imagen</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal de edición de heroe */}
        {editingHero !== undefined && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setEditingHero(undefined)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-fredoka text-lg font-bold text-[#C04267]">Editar heroe</h3>
                <button onClick={() => setEditingHero(undefined)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Selector de heroe */}
              <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Heroe</label>
              <select
                value={selectedClave}
                onChange={(e) => {
                  const hk = ALL_HERO_KEYS.find((k) => k.clave === e.target.value);
                  if (hk) setEditingHero(hk);
                }}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4"
              >
                {ALL_HERO_KEYS.map((hk) => (
                  <option key={hk.clave} value={hk.clave}>
                    {hk.label}
                  </option>
                ))}
              </select>

              {/* Título */}
              <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Título</label>
              <input
                value={editTitulo}
                onChange={(e) => setEditTitulo(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4"
              />

              {isProductSlide(selectedClave) ? (
                <>
                  {/* Subtítulo (highlight) */}
                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Subtítulo (texto resaltado)</label>
                  <input
                    value={editSubtitulo}
                    onChange={(e) => setEditSubtitulo(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4"
                  />

                  {/* Badge */}
                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Badge / Etiqueta</label>
                  <input
                    value={editBadge}
                    onChange={(e) => setEditBadge(e.target.value)}
                    placeholder="Ej: Especial, Tus Personajes Favoritos, A Tu Medida"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4"
                  />

                  {/* Descripción */}
                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Descripción</label>
                  <textarea
                    value={editDescripcion}
                    onChange={(e) => setEditDescripcion(e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4 resize-none"
                  />

                  {/* Precio */}
                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Precio (S/)</label>
                  <input
                    value={editPrecio}
                    onChange={(e) => setEditPrecio(e.target.value)}
                    type="number"
                    step="0.01"
                    placeholder="Ej: 80"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4"
                  />

                  {/* Link URL */}
                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Link del botón "Ver Colección"</label>
                  <input
                    value={editLinkUrl}
                    onChange={(e) => setEditLinkUrl(e.target.value)}
                    placeholder="Ej: /category/cajas, /category/amigurumis, /personalizados"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4"
                  />

                  <hr className="border-gray-100 my-5" />
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-4 bg-[#EE6B8D] rounded-full" />
                    <h4 className="font-quicksand text-sm font-bold text-gray-700">Producto a mostrar</h4>
                  </div>

                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">SKU del producto</label>
                  <input
                    value={editProductoSku}
                    onChange={(e) => setEditProductoSku(e.target.value)}
                    placeholder="Ej: Amigu-001, Caja-001, Ramos-003"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-3"
                  />

                  <button
                    onClick={() => setShowProductPicker(!showProductPicker)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-dashed border-[#EE6B8D] rounded-lg font-quicksand text-sm font-semibold text-[#EE6B8D] hover:bg-[#FDF4F7] transition-colors mb-4"
                  >
                    <Search size={16} />
                    {showProductPicker ? "Ocultar productos" : "Buscar productos"}
                  </button>

                  {showProductPicker && (
                    <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
                      <div className="p-3 bg-gray-50 border-b border-gray-200">
                        <input
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Filtrar productos por nombre o SKU..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]"
                          autoFocus
                        />
                      </div>
                      <div className="max-h-60 overflow-y-auto divide-y divide-gray-100">
                        {allProducts
                          .filter((p: any) =>
                            !productSearch || p.nombre?.toLowerCase().includes(productSearch.toLowerCase()) || p.sku?.toLowerCase().includes(productSearch.toLowerCase())
                          )
                          .slice(0, 50)
                          .map((p: any) => (
                            <button
                              key={p.id}
                              onClick={() => {
                                setEditProductoSku(p.sku);
                                if (!editPrecio) setEditPrecio(p.precio?.toString() || "");
                                setShowProductPicker(false);
                              }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[#FDF4F7] transition-colors ${
                                editProductoSku === p.sku ? 'bg-[#FDF4F7] border-l-4 border-[#EE6B8D]' : ''
                              }`}
                            >
                              {p.imagen && (
                                <img src={p.imagen} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />
                              )}
                              <div className="min-w-0 flex-1">
                                <p className="font-quicksand text-xs font-semibold text-gray-800 truncate">{p.nombre}</p>
                                <p className="font-quicksand text-[10px] text-gray-400">{p.sku} · S/ {p.precio?.toFixed(2)}</p>
                              </div>
                              {editProductoSku === p.sku && (
                                <Check size={16} className="text-[#EE6B8D] flex-shrink-0" />
                              )}
                            </button>
                          ))}
                        {allProducts.length === 0 && (
                          <p className="p-4 text-center font-quicksand text-xs text-gray-400">Cargando productos...</p>
                        )}
                      </div>
                    </div>
                  )}

                  {editProductoSku && (
                    <div className="bg-[#FDE8EF] rounded-xl p-3 flex items-center gap-3">
                      <Check size={18} className="text-[#C04267] flex-shrink-0" />
                      <p className="font-quicksand text-xs text-gray-700">
                        Producto seleccionado: <strong>{editProductoSku}</strong>
                        {editPrecio && `. Precio: S/ ${editPrecio}`}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {/* Link URL - only for home_hero_1 */}
                  {selectedClave === 'home_hero_1' && (
                    <>
                      <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Link del banner</label>
                      <input
                        value={editLinkUrl}
                        onChange={(e) => setEditLinkUrl(e.target.value)}
                        placeholder="Ej: /evento/dia-de-la-novia"
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4"
                      />
                    </>
                  )}

                  {/* URL input */}
                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">URL de imagen</label>
                  <input
                    value={editUrl}
                    onChange={(e) => setEditUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-3"
                  />

                  {/* Drop zone */}
                  <div
                    onDragOver={(e) => { e.preventDefault(); setHeroDragOver(1); }}
                    onDragLeave={() => setHeroDragOver(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setHeroDragOver(null);
                      const file = e.dataTransfer.files?.[0];
                      if (file?.type.startsWith("image/")) subirHeroFileTemp(file);
                      const text = e.dataTransfer.getData("text");
                      if (text && esUrlImagen(text)) setEditUrl(text.trim());
                    }}
                    onPaste={(e) => {
                      const items = e.clipboardData?.items;
                      if (!items) return;
                      for (const item of Array.from(items)) {
                        if (item.type.startsWith("image/")) {
                          const file = item.getAsFile();
                          if (file) { e.preventDefault(); subirHeroFileTemp(file); return; }
                        }
                        if (item.type === "text/plain") {
                          const text = e.clipboardData.getData("text");
                          if (esUrlImagen(text)) { e.preventDefault(); setEditUrl(text.trim()); return; }
                        }
                      }
                    }}
                    onClick={() => tempFileRef.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all mb-4 ${
                      heroDragOver === 1 ? "border-[#EE6B8D] bg-[#FDF4F7]" : "border-gray-200 hover:border-[#EE6B8D] hover:bg-[#FDF4F7]/50"
                    }`}
                  >
                    <input
                      ref={tempFileRef}
                      type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) subirHeroFileTemp(f); }}
                    />
                    {tempUploading ? (
                      <Loader2 size={24} className="mx-auto animate-spin text-[#EE6B8D]" />
                    ) : (
                      <>
                        <Upload size={28} className="mx-auto text-[#EE6B8D] mb-2" />
                        <p className="font-quicksand text-sm font-semibold text-gray-700">Click, arrastra o pega (Ctrl+V)</p>
                        <p className="font-quicksand text-xs text-gray-400 mt-1">Reemplazará la imagen actual</p>
                      </>
                    )}
                  </div>

                  {/* Preview */}
                  {editUrl && (
                    <div className="relative aspect-video rounded-xl bg-gray-50 border border-gray-200 overflow-hidden mb-4 group">
                      <img src={editUrl} alt="" className="w-full h-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                      />
                      <button onClick={() => setEditUrl("")}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded font-quicksand">
                        Desktop
                      </div>
                    </div>
                  )}

                  <hr className="border-gray-100 my-5" />

                  {/* Mobile image */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-4 bg-[#EE6B8D] rounded-full" />
                    <h4 className="font-quicksand text-sm font-bold text-gray-700">Imagen Móvil (vertical)</h4>
                  </div>

                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">URL imagen móvil</label>
                  <input
                    value={editUrlMobile}
                    onChange={(e) => setEditUrlMobile(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-3"
                  />

                  <div
                    onDragOver={(e) => { e.preventDefault(); setHeroDragOver(2); }}
                    onDragLeave={() => setHeroDragOver(null)}
                    onDrop={(e) => {
                      e.preventDefault();
                      setHeroDragOver(null);
                      const file = e.dataTransfer.files?.[0];
                      if (file?.type.startsWith("image/")) subirHeroFileTempMobile(file);
                      const text = e.dataTransfer.getData("text");
                      if (text && esUrlImagen(text)) setEditUrlMobile(text.trim());
                    }}
                    onPaste={(e) => {
                      const items = e.clipboardData?.items;
                      if (!items) return;
                      for (const item of Array.from(items)) {
                        if (item.type.startsWith("image/")) {
                          const file = item.getAsFile();
                          if (file) { e.preventDefault(); subirHeroFileTempMobile(file); return; }
                        }
                        if (item.type === "text/plain") {
                          const text = e.clipboardData.getData("text");
                          if (esUrlImagen(text)) { e.preventDefault(); setEditUrlMobile(text.trim()); return; }
                        }
                      }
                    }}
                    onClick={() => tempFileRefMobile.current?.click()}
                    className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all mb-4 ${
                      heroDragOver === 2 ? "border-[#EE6B8D] bg-[#FDF4F7]" : "border-gray-200 hover:border-[#EE6B8D] hover:bg-[#FDF4F7]/50"
                    }`}
                  >
                    <input
                      ref={tempFileRefMobile}
                      type="file" accept="image/*" className="hidden"
                      onChange={(e) => { const f = e.target.files?.[0]; if (f) subirHeroFileTempMobile(f); }}
                    />
                    {tempUploadingMobile ? (
                      <Loader2 size={20} className="mx-auto animate-spin text-[#EE6B8D]" />
                    ) : (
                      <>
                        <Upload size={22} className="mx-auto text-[#EE6B8D] mb-1" />
                        <p className="font-quicksand text-xs font-semibold text-gray-700">Imagen vertical para móvil</p>
                        <p className="font-quicksand text-[11px] text-gray-400 mt-0.5">Arrastra, pega o selecciona</p>
                      </>
                    )}
                  </div>

                  {editUrlMobile && (
                    <div className="relative aspect-[3/4] max-w-[180px] rounded-xl bg-gray-50 border border-gray-200 overflow-hidden mb-4 group mx-auto">
                      <img src={editUrlMobile} alt="" className="w-full h-full object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                      />
                      <button onClick={() => setEditUrlMobile("")}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={() => setEditingHero(undefined)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button onClick={handleHeroSave}
                  className="flex-1 py-2.5 bg-[#EE6B8D] hover:bg-[#C04267] text-white rounded-lg font-quicksand text-sm font-semibold transition-colors"
                >
                  {isNewHero ? "Crear" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab !== "dashboard" && tab !== "heroes" && !loading && data.length > 0 && (
          <div>
            <h2 className="font-fredoka text-xl font-bold text-[#C04267] mb-6 capitalize">
              {menuItems.find(m => m.id === tab)?.label || tab}
            </h2>
            <div className="bg-white rounded-2xl border border-[#FDE8EF] shadow-sm overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-[#FDE8EF] bg-gray-50/50">
                    {getColumns(data).map((key) => (
                      <th key={key} className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">
                        {key.replace(/_/g, " ")}
                      </th>
                    ))}
                    <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((row: any) => {
                    const cols = getColumns(data);
                    return (
                      <tr key={row.id} className="border-b border-gray-50 hover:bg-[#FDF4F7]/50 transition-colors">
                        {cols.map((key) => {
                          const value = row[key];

                          if (key === "estado" && tab === "pedidos") {
                            return (
                              <td key={key} className="px-3 py-3">
                                <select value={value || "pendiente"}
                                  onChange={(e) => handleCambiarEstado(row.id, e.target.value)}
                                  className="font-quicksand text-xs px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#EE6B8D]"
                                >
                                  <option value="pendiente">Pendiente</option>
                                  <option value="confirmado">Confirmado</option>
                                  <option value="enviado">Enviado</option>
                                  <option value="entregado">Entregado</option>
                                  <option value="cancelado">Cancelado</option>
                                </select>
                              </td>
                            );
                          }

                          if (key === "estado" && tab === "personalizados") {
                            return (
                              <td key={key} className="px-3 py-3">
                                <select value={value || "pendiente"}
                                  onChange={(e) => handlePersonalizadoEstado(row.id, e.target.value)}
                                  className="font-quicksand text-xs px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#EE6B8D]"
                                >
                                  <option value="pendiente">Pendiente</option>
                                  <option value="confirmado">Confirmado</option>
                                  <option value="en_produccion">En producción</option>
                                  <option value="listo">Listo</option>
                                  <option value="entregado">Entregado</option>
                                  <option value="cancelado">Cancelado</option>
                                </select>
                              </td>
                            );
                          }

                          if ((key.includes("imagen") || key.includes("image")) && value && typeof value === "string") {
                            return (
                              <td key={key} className="px-3 py-3">
                                <img src={value} alt="" className="w-10 h-10 rounded object-cover border" />
                              </td>
                            );
                          }

                          return (
                            <td key={key} className="px-3 py-3 font-quicksand text-xs text-gray-700 max-w-[200px] truncate" title={String(value ?? "-")}>
                              {formatValue(key, value)}
                            </td>
                          );
                        })}

                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {tab === "mensajes" && !row.leido && (
                              <button onClick={() => handleMarcarLeido(row.id)}
                                className="flex items-center gap-1 text-xs text-[#EE6B8D] hover:text-[#C04267] font-quicksand font-medium"
                              >
                                <Eye size={14} /> Leído
                              </button>
                            )}

                            {(tab === "pedidos" || tab === "personalizados") && (
                              <a href={whatsappLink(row)} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-[#25D366] hover:text-[#20BA5A] font-quicksand font-medium"
                              >
                                <ExternalLink size={14} /> WhatsApp
                              </a>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
