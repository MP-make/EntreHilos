"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard, ShoppingBag, MessageSquare, ClipboardList, Mail,
  Image as ImageIcon, Users, LogOut, Home, Loader2, Eye, ExternalLink,
  UserCheck, Upload, X, Check, ChevronRight, Search, Plus, Trash2, Sparkles,
  Star, Package, Tag, Save,
} from "lucide-react";
import { getVentifyProducts, getAllVentifyProducts, getInactiveProductIds } from "@/lib/ventify";

type Tab = "dashboard" | "inicio" | "pedidos" | "mensajes" | "reclamaciones" | "personalizados" | "heroes" | "suscriptores" | "usuarios" | "eventos" | "resenas" | "productos" | "precios";

const menuItems: { id: Tab; label: string; icon: any }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "pedidos", label: "Pedidos", icon: ShoppingBag },
  { id: "productos", label: "Productos", icon: Package },
  { id: "precios", label: "Precios", icon: Tag },
  { id: "personalizados", label: "Personalizados", icon: Mail },
  { id: "eventos", label: "Eventos", icon: Sparkles },
  { id: "resenas", label: "Reseñas", icon: Star },
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

// ===== Filtros de productos (mismo orden/agrupación que la web) =====

const CATALOGO_FILTERS: { key: string; label: string }[] = [
  { key: "cat-ramos", label: "Ramos" },
  { key: "cat-amigurumis", label: "Amigurumis" },
  { key: "cat-cajas", label: "Cajas" },
  { key: "cat-hotwheels", label: "HotWheels" },
  { key: "ver-todo", label: "Ver Todo" },
];

const EVENTO_FILTERS: { key: string; label: string }[] = [
  { key: "evento-dia-de-la-novia", label: "Día de la Novia" },
  { key: "evento-dia-de-la-mujer", label: "Día de la Mujer" },
  { key: "evento-san-valentin", label: "San Valentín" },
  { key: "evento-dia-de-la-madre", label: "Día de la Madre" },
  { key: "evento-flores-amarillas", label: "Flores Amarillas" },
  { key: "evento-personalizados", label: "Personalizados" },
];

function filterByEventSlug(products: any[], slug: string): any[] {
  switch (slug) {
    case "dia-de-la-mujer":
      return products.filter((p) =>
        p.sku?.startsWith("Mujer-") || p.nombre?.toLowerCase().includes("mujer") || p.sku?.startsWith("Ramos-")
      );
    case "san-valentin":
      return products.filter((p) =>
        (p.sku?.startsWith("Ramos-") || ["Caja-001", "Caja-002", "Caja-003"].includes(p.sku)) && p.stock > 0
      ).sort((a, b) => b.stock - a.stock);
    case "dia-de-la-novia":
      return products.filter((p) =>
        p.sku?.startsWith("Ramos-") || ["Caja-001", "Caja-002", "Caja-003"].includes(p.sku)
      ).sort((a, b) => b.stock - a.stock);
    case "dia-de-la-madre":
      return products.filter((p) => p.sku?.startsWith("Madre-") || p.sku?.startsWith("Ramos-"));
    case "flores-amarillas":
      return products.filter((p) =>
        p.categoriaOriginal?.toLowerCase().includes("flores amarillas") ||
        p.nombre?.toLowerCase().includes("flores amarillas") || p.sku?.startsWith("Flores-")
      );
    case "personalizados":
      return products.filter((p) => p.sku?.startsWith("Amigu-"));
    case "hotwheels":
      return products.filter((p) =>
        p.sku?.startsWith("Cua-") || p.sku?.startsWith("Carr-") || ["Caja-004", "Caja-005"].includes(p.sku)
      );
    default:
      return [...products];
  }
}

function filterProductos(products: any[], filter: string): any[] {
  switch (filter) {
    case "cat-ramos":
      return products.filter((p) => p.sku?.startsWith("Ramos-") && p.stock > 0).sort((a, b) => b.stock - a.stock);
    case "cat-amigurumis":
      return products.filter((p) => p.sku?.startsWith("Amigu-"));
    case "cat-cajas":
      return products.filter((p) => ["Caja-001", "Caja-002", "Caja-003", "Caja-004", "Caja-005"].includes(p.sku));
    case "cat-hotwheels":
      return products.filter((p) =>
        p.sku?.startsWith("Cua-") || p.sku?.startsWith("Carr-") || ["Caja-004", "Caja-005"].includes(p.sku)
      );
    case "evento-dia-de-la-mujer":
      return filterByEventSlug(products, "dia-de-la-mujer");
    case "evento-san-valentin":
      return filterByEventSlug(products, "san-valentin");
    case "evento-dia-de-la-novia":
      return filterByEventSlug(products, "dia-de-la-novia");
    case "evento-dia-de-la-madre":
      return filterByEventSlug(products, "dia-de-la-madre");
    case "evento-flores-amarillas":
      return filterByEventSlug(products, "flores-amarillas");
    case "evento-personalizados":
      return filterByEventSlug(products, "personalizados");
    case "page-personalizados":
      return products.filter((p) => p.sku?.startsWith("Amigu-") || p.sku?.startsWith("Carr-"));
    default:
      return [...products];
  }
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
  const [pickingProductFor, setPickingProductFor] = useState<number | null>(null);
  const [rawProducts, setRawProducts] = useState<any[]>([]);
  const [inactiveIds, setInactiveIds] = useState<Set<string>>(new Set());
  const [productosSearch, setProductosSearch] = useState("");
  const [productosFilter, setProductosFilter] = useState("ver-todo");
  const [eventos, setEventos] = useState<any[]>([]);
  const [amiguProducts, setAmiguProducts] = useState<any[]>([]);
  const [preciosRows, setPreciosRows] = useState<Record<string, any>>({});
  const [preciosDraft, setPreciosDraft] = useState<Record<string, { pequeno: string; mediano: string; grande: string }>>({});
  const [preciosSaving, setPreciosSaving] = useState<string | null>(null);
  const tempFileRef = useRef<HTMLInputElement | null>(null);
  const tempFileRefMobile = useRef<HTMLInputElement | null>(null);
  const sectionImgRef = useRef<HTMLInputElement | null>(null);
  const eventoImgRef = useRef<HTMLInputElement | null>(null);
  const [eventoImgUploading, setEventoImgUploading] = useState(false);

  const [editingEvento, setEditingEvento] = useState<any | null>(null);
  const [editEventoNombre, setEditEventoNombre] = useState("");
  const [editEventoSlug, setEditEventoSlug] = useState("");
  const [editEventoDescripcion, setEditEventoDescripcion] = useState("");
  const [editEventoImagen, setEditEventoImagen] = useState("");
  const [isNewEvento, setIsNewEvento] = useState(false);

  const [showResenaForm, setShowResenaForm] = useState(false);
  const [resenaSearch, setResenaSearch] = useState("");
  const [resenaProducto, setResenaProducto] = useState<any | null>(null);
  const [resenaNombre, setResenaNombre] = useState("");
  const [resenaCalificacion, setResenaCalificacion] = useState(0);
  const [resenaComentario, setResenaComentario] = useState("");

  const [editingSection, setEditingSection] = useState<any | null>(null);
  const [sectionTitulo, setSectionTitulo] = useState("");
  const [sectionSubtitulo, setSectionSubtitulo] = useState("");
  const [sectionDescripcion, setSectionDescripcion] = useState("");
  const [sectionImagenUrl, setSectionImagenUrl] = useState("");
  const [sectionLinkUrl, setSectionLinkUrl] = useState("");
  const [sectionLinkText, setSectionLinkText] = useState("");
  const [sectionItems, setSectionItems] = useState("");

  const [persBadge, setPersBadge] = useState("");
  const [persTituloLinea1, setPersTituloLinea1] = useState("");
  const [persTituloLinea2, setPersTituloLinea2] = useState("");
  const [persBotonPrimario, setPersBotonPrimario] = useState("");
  const [persBotonPrimarioLogged, setPersBotonPrimarioLogged] = useState("");
  const [persBotonSecundario, setPersBotonSecundario] = useState("");
  const [persEstadistica, setPersEstadistica] = useState("");
  const [persEtiquetaPrecio, setPersEtiquetaPrecio] = useState("");
  const [persValorPrecio, setPersValorPrecio] = useState("");

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

  async function subirSectionImg(file: File) {
    setTempUploading(true);
    try {
      const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
      const supabase = getSupabaseBrowserClient();
      const ext = file.name.split(".").pop() || "jpg";
      const nombre = `section-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("heroes").upload(nombre, file, { upsert: true });
      if (error) { console.error(error); return; }
      const { data: pub } = supabase.storage.from("heroes").getPublicUrl(nombre);
      setSectionImagenUrl(pub.publicUrl);
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

  async function subirEventoImg(file: File) {
    setEventoImgUploading(true);
    try {
      const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
      const supabase = getSupabaseBrowserClient();
      const ext = file.name.split(".").pop() || "jpg";
      const nombre = `evento-${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("heroes").upload(nombre, file, { upsert: true });
      if (error) { console.error(error); return; }
      const { data: pub } = supabase.storage.from("heroes").getPublicUrl(nombre);
      setEditEventoImagen(pub.publicUrl);
    } catch (e) { console.error(e); }
    finally { setEventoImgUploading(false); }
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
    if ((tab === "heroes" || tab === "resenas") && allProducts.length === 0) {
      getVentifyProducts().then(setAllProducts).catch(() => {});
    }
  }, [tab, allProducts.length]);

  useEffect(() => {
    if (tab === "productos") {
      if (rawProducts.length === 0) {
        getAllVentifyProducts().then(setRawProducts).catch(() => {});
      }
      if (inactiveIds.size === 0) {
        getInactiveProductIds().then((ids) => setInactiveIds(new Set(ids))).catch(() => {});
      }
      if (eventos.length === 0) {
        fetch("/api/eventos").then((r) => r.json()).then(setEventos).catch(() => {});
      }
    }
  }, [tab, rawProducts.length, inactiveIds.size, eventos.length]);

  useEffect(() => {
    if (tab === "precios") {
      if (amiguProducts.length === 0) {
        getAllVentifyProducts()
          .then((all) => setAmiguProducts(all.filter((p) => p.sku?.startsWith("Amigu-"))))
          .catch(() => {});
      }
    }
  }, [tab, amiguProducts.length]);

  useEffect(() => {
    if (tab !== "precios") return;
    const map: Record<string, any> = {};
    (Array.isArray(data) ? data : []).forEach((r: any) => { if (r.sku) map[r.sku] = r; });
    setPreciosRows(map);
    setPreciosDraft((prev) => {
      const next = { ...prev };
      (Array.isArray(data) ? data : []).forEach((r: any) => {
        if (!r.sku) return;
        const current = next[r.sku] || { pequeno: "", mediano: "", grande: "" };
        next[r.sku] = {
          pequeno: current.pequeno !== "" ? current.pequeno : (r.precio_pequeno != null ? String(r.precio_pequeno) : ""),
          mediano: current.mediano !== "" ? current.mediano : (r.precio_mediano != null ? String(r.precio_mediano) : ""),
          grande: current.grande !== "" ? current.grande : (r.precio_grande != null ? String(r.precio_grande) : ""),
        };
      });
      amiguProducts.forEach((p: any) => {
        if (!next[p.sku]) {
          next[p.sku] = {
            pequeno: "",
            mediano: p.precio != null ? String(p.precio) : "",
            grande: "",
          };
        }
      });
      return next;
    });
  }, [tab, data, amiguProducts.length]);

  async function handleGuardarPrecios(sku: string) {
    const draft = preciosDraft[sku];
    if (!draft) return;
    setPreciosSaving(sku);
    const body = {
      action: "actualizar-precios-tamanos",
      sku,
      precio_pequeno: draft.pequeno.trim() !== "" ? parseFloat(draft.pequeno) : null,
      precio_mediano: draft.mediano.trim() !== "" ? parseFloat(draft.mediano) : null,
      precio_grande: draft.grande.trim() !== "" ? parseFloat(draft.grande) : null,
    };
    const ok = await apiPatch(body);
    if (ok) setPreciosRows((prev) => ({ ...prev, [sku]: { sku, precio_pequeno: body.precio_pequeno, precio_mediano: body.precio_mediano, precio_grande: body.precio_grande } }));
    setPreciosSaving(null);
  }

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

  useEffect(() => {
    if (editingSection) {
      setSectionTitulo(editingSection.titulo || "");
      setSectionSubtitulo(editingSection.subtitulo || "");
      setSectionDescripcion(editingSection.descripcion || "");
      setSectionImagenUrl(editingSection.imagen_url || "");
      setSectionLinkUrl(editingSection.link_url || "");
      setSectionLinkText(editingSection.link_text || "");
      setSectionItems(editingSection.items ? JSON.stringify(editingSection.items, null, 2) : "");

      const items = editingSection.items || {};
      setPersBadge(items.badge || "");
      setPersTituloLinea1(items.titulo_linea1 || "");
      setPersTituloLinea2(items.titulo_linea2 || "");
      setPersBotonPrimario(items.boton_primario || "");
      setPersBotonPrimarioLogged(items.boton_primario_logged || "");
      setPersBotonSecundario(items.boton_secundario || "");
      setPersEstadistica(items.estadistica || "");
      setPersEtiquetaPrecio(items.etiqueta_precio || "");
      setPersValorPrecio(items.valor_precio || "");
    }
  }, [editingSection]);

  async function handleSectionSave() {
    if (!editingSection) return;
    const updateData: Record<string, any> = {
      titulo: sectionTitulo,
      subtitulo: sectionSubtitulo || null,
      descripcion: sectionDescripcion || null,
      imagen_url: sectionImagenUrl || null,
      link_url: sectionLinkUrl || null,
      link_text: sectionLinkText || null,
    };
    if (editingSection.tipo === 'showcase' || editingSection.tipo === 'faq') {
      try {
        updateData.items = JSON.parse(sectionItems);
      } catch { /* keep existing */ }
    }
    if (editingSection.tipo === 'personalizados') {
      updateData.items = {
        badge: persBadge,
        titulo_linea1: persTituloLinea1,
        titulo_linea2: persTituloLinea2,
        boton_primario: persBotonPrimario,
        boton_primario_logged: persBotonPrimarioLogged,
        boton_secundario: persBotonSecundario,
        estadistica: persEstadistica,
        etiqueta_precio: persEtiquetaPrecio,
        valor_precio: persValorPrecio,
      };
    }
    const ok = await apiPatch({ action: "actualizar-seccion", id: editingSection.id, ...updateData });
    if (ok) { fetchData(); setEditingSection(null); }
  }

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

  const handleAprobarResena = async (id: number, aprobado: boolean) => {
    const ok = await apiPatch({ action: "aprobar-resena", id, aprobado });
    if (ok) setData((prev) => prev.map((item: any) => item.id === id ? { ...item, aprobado } : item));
  };

  const handleEliminarResena = async (id: number) => {
    const ok = await apiPatch({ action: "eliminar-resena", id });
    if (ok) setData((prev) => prev.filter((item: any) => item.id !== id));
  };

  const handleToggleProducto = async (producto: any, activo: boolean) => {
    const ok = await apiPatch({ action: "set-producto-activo", producto_id: producto.id, activo });
    if (ok) {
      setInactiveIds((prev) => {
        const next = new Set(prev);
        if (activo) next.delete(producto.id);
        else next.add(producto.id);
        return next;
      });
    }
  };

  const handleCrearResenaManual = async () => {
    if (!resenaProducto) {
      alert("Selecciona un producto para la reseña");
      return;
    }
    if (resenaCalificacion < 1 || resenaCalificacion > 5) {
      alert("La calificación debe estar entre 1 y 5 estrellas");
      return;
    }
    const res = await fetch("/api/admin", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resena: {
          producto_id: resenaProducto.id,
          producto_sku: resenaProducto.sku,
          producto_nombre: resenaProducto.nombre,
          nombre_cliente: resenaNombre.trim() || "Equipo Entre Hilos",
          calificacion: resenaCalificacion,
          comentario: resenaComentario.trim() || null,
        },
      }),
    });
    if (res.ok) {
      setShowResenaForm(false);
      setResenaProducto(null);
      setResenaNombre("");
      setResenaCalificacion(0);
      setResenaComentario("");
      setResenaSearch("");
      fetchData();
    }
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
      <div className="p-5 border-b border-[#FDE8EF] flex items-start justify-between">
        <div>
          <h1 className="font-fredoka text-lg font-bold text-[#C04267]">Admin</h1>
          <p className="font-quicksand text-xs text-gray-400">Entre Hilos</p>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center -mr-1"
          aria-label="Cerrar menú"
        >
          <X size={18} className="text-gray-500" />
        </button>
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
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white shadow-lg border-r border-[#FDE8EF] transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {sidebarContent}
      </aside>

      <button
        onClick={() => setSidebarOpen(true)}
        className="fixed top-4 left-4 z-30 lg:hidden w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50"
        aria-label="Abrir menú"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round">
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      <main className="flex-1 min-w-0 p-4 pt-20 sm:p-8 sm:pt-20 lg:pt-8">
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

        {tab !== "dashboard" && tab !== "resenas" && tab !== "productos" && tab !== "precios" && !loading && data.length === 0 && (
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
                const prodImg = hero?.producto_sku ? allProducts.find((p: any) => p.sku === hero.producto_sku)?.imagen : null;
                const displayImg = imgUrl || prodImg;
                return (
                  <button key={hk.clave}
                    onClick={() => setEditingHero(hk)}
                    className={`group relative aspect-video rounded-xl overflow-hidden border-2 transition-all bg-gray-50 ${
                      hero ? "border-transparent hover:border-[#EE6B8D]" : "border-dashed border-gray-200 hover:border-[#EE6B8D]"
                    }`}
                  >
                    {displayImg ? (
                      <img src={displayImg} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
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

        {tab === "inicio" && !loading && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-fredoka text-xl font-bold text-[#C04267]">Inicio - Secciones</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((section: any) => (
                <button key={section.id}
                  onClick={() => setEditingSection(section)}
                  className="group relative bg-white rounded-xl border-2 border-transparent hover:border-[#EE6B8D] transition-all p-5 text-left shadow-sm hover:shadow-md"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-quicksand text-[10px] uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                      {section.section_key}
                    </span>
                    <span className="font-quicksand text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full" style={{
                      backgroundColor: section.tipo === 'faq' ? '#E8F5E9' : section.tipo === 'showcase' ? '#FFF3E0' : section.tipo === 'personalizados' ? '#FCE4EC' : '#F3E5F5',
                      color: section.tipo === 'faq' ? '#2E7D32' : section.tipo === 'showcase' ? '#E65100' : section.tipo === 'personalizados' ? '#C04267' : '#7B1FA2',
                    }}>
                      {section.tipo}
                    </span>
                  </div>
                  <h3 className="font-quicksand text-sm font-bold text-gray-800 mb-1">{section.titulo || 'Sin título'}</h3>
                  {section.subtitulo && (
                    <p className="font-quicksand text-xs text-gray-500 italic">{section.subtitulo}</p>
                  )}
                  {section.descripcion && (
                    <p className="font-quicksand text-xs text-gray-400 mt-2 line-clamp-2">{section.descripcion}</p>
                  )}
                  {section.items && (
                    <p className="font-quicksand text-[10px] text-gray-400 mt-2">
                      {Array.isArray(section.items) ? section.items.length : 0} ítems
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === "eventos" && !loading && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-fredoka text-xl font-bold text-[#C04267]">Eventos</h2>
              <button onClick={() => {
                setIsNewEvento(true);
                setEditEventoNombre("");
                setEditEventoSlug("");
                setEditEventoDescripcion("");
                setEditEventoImagen("");
                setEditingEvento({ id: null, nombre: "", slug: "", descripcion: "", imagen_url: "" });
              }}
                className="flex items-center gap-2 text-xs text-white bg-[#EE6B8D] hover:bg-[#C04267] px-4 py-2.5 rounded-lg font-quicksand font-semibold transition-colors shadow-sm"
              >
                <Plus size={14} />
                Crear evento
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.map((evento: any) => (
                <button key={evento.id}
                  onClick={() => {
                    setIsNewEvento(false);
                    setEditEventoNombre(evento.nombre || "");
                    setEditEventoSlug(evento.slug || "");
                    setEditEventoDescripcion(evento.descripcion || "");
                    setEditEventoImagen(evento.imagen_url || "");
                    setEditingEvento({ ...evento, featured: evento.featured || false });
                  }}
                  className={`group relative bg-white rounded-xl border-2 transition-all p-5 text-left shadow-sm hover:shadow-md ${
                    evento.featured ? "border-[#EE6B8D] ring-2 ring-[#EE6B8D]/20" : "border-transparent hover:border-[#EE6B8D]"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className={`font-quicksand text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      evento.featured
                        ? "bg-[#EE6B8D] text-white"
                        : evento.activo
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-400"
                    }`}>
                      {evento.featured ? "Destacado" : evento.activo ? "Activo" : "Inactivo"}
                    </span>
                    {evento.featured && (
                      <span className="font-quicksand text-[10px] uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                        En navbar
                      </span>
                    )}
                  </div>
                  <h3 className="font-quicksand text-sm font-bold text-gray-800 mb-1">{evento.nombre}</h3>
                  {evento.slug && (
                    <p className="font-quicksand text-[11px] text-gray-400">/{evento.slug}</p>
                  )}
                  {evento.descripcion && (
                    <p className="font-quicksand text-xs text-gray-500 mt-2 line-clamp-2">{evento.descripcion}</p>
                  )}
                </button>
              ))}
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
                    placeholder="Ej: /catalogo/cajas, /catalogo/amigurumis, /personalizados"
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
                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">URL de imagen <span className="text-gray-400 font-normal normal-case">(1200×675px recomendado)</span></label>
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

                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">URL imagen móvil <span className="text-gray-400 font-normal normal-case">(600×900px recomendado)</span></label>
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

        {/* Modal de edición de sección de inicio */}
        {editingSection !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setEditingSection(null)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-fredoka text-lg font-bold text-[#C04267]">Editar sección</h3>
                <button onClick={() => setEditingSection(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Título</label>
              <input value={sectionTitulo} onChange={(e) => setSectionTitulo(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4"
              />

              <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Subtítulo</label>
              <input value={sectionSubtitulo} onChange={(e) => setSectionSubtitulo(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4"
              />

              <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Descripción</label>
              <textarea value={sectionDescripcion} onChange={(e) => setSectionDescripcion(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4 resize-none"
              />

              <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Imagen de referencia <span className="text-gray-400 font-normal normal-case">(800×600px recomendado)</span></label>
              <input value={sectionImagenUrl} onChange={(e) => setSectionImagenUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-3"
              />

              <div
                onDragOver={(e) => { e.preventDefault(); setHeroDragOver(3); }}
                onDragLeave={() => setHeroDragOver(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setHeroDragOver(null);
                  const file = e.dataTransfer.files?.[0];
                  if (file?.type.startsWith("image/")) subirSectionImg(file);
                  const text = e.dataTransfer.getData("text");
                  if (text && esUrlImagen(text)) setSectionImagenUrl(text.trim());
                }}
                onPaste={(e) => {
                  const items = e.clipboardData?.items;
                  if (!items) return;
                  for (const item of Array.from(items)) {
                    if (item.type.startsWith("image/")) {
                      const file = item.getAsFile();
                      if (file) { e.preventDefault(); subirSectionImg(file); return; }
                    }
                    if (item.type === "text/plain") {
                      const text = e.clipboardData.getData("text");
                      if (esUrlImagen(text)) { e.preventDefault(); setSectionImagenUrl(text.trim()); return; }
                    }
                  }
                }}
                onClick={() => sectionImgRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all mb-4 ${
                  heroDragOver === 3 ? "border-[#EE6B8D] bg-[#FDF4F7]" : "border-gray-200 hover:border-[#EE6B8D] hover:bg-[#FDF4F7]/50"
                }`}
              >
                <input
                  ref={sectionImgRef}
                  type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) subirSectionImg(f); }}
                />
                {tempUploading ? (
                  <Loader2 size={24} className="mx-auto animate-spin text-[#EE6B8D]" />
                ) : (
                  <>
                    <Upload size={24} className="mx-auto text-[#EE6B8D] mb-1" />
                    <p className="font-quicksand text-xs font-semibold text-gray-700">Click, arrastra o pega (Ctrl+V)</p>
                    <p className="font-quicksand text-[10px] text-gray-400 mt-0.5">Sube una imagen referencial</p>
                  </>
                )}
              </div>

              {sectionImagenUrl && (
                <div className="relative aspect-video rounded-xl bg-gray-50 border border-gray-200 overflow-hidden mb-4 group">
                  <img src={sectionImagenUrl} alt="" className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                  />
                  <button onClick={() => setSectionImagenUrl("")}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Link URL</label>
              <input value={sectionLinkUrl} onChange={(e) => setSectionLinkUrl(e.target.value)}
                placeholder="Ej: /catalogo/ramos"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4"
              />

              <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Texto del link</label>
              <input value={sectionLinkText} onChange={(e) => setSectionLinkText(e.target.value)}
                placeholder="Ej: Ver más"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4"
              />

              {editingSection.tipo === 'faq' && (
                <>
                  <hr className="border-gray-100 my-5" />
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-4 bg-[#EE6B8D] rounded-full" />
                    <h4 className="font-quicksand text-sm font-bold text-gray-700">Preguntas y Respuestas</h4>
                  </div>
                  {(() => {
                    const items = (() => { try { return JSON.parse(sectionItems); } catch { return []; } })();
                    return items.map((item: any, i: number) => (
                      <div key={i} className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-quicksand text-xs font-bold text-gray-500">Pregunta {i + 1}</span>
                          <button onClick={() => {
                            const updated = items.filter((_: any, idx: number) => idx !== i);
                            setSectionItems(JSON.stringify(updated, null, 2));
                          }}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <input value={item.pregunta || ''} onChange={(e) => {
                          const updated = [...items];
                          updated[i] = { ...updated[i], pregunta: e.target.value };
                          setSectionItems(JSON.stringify(updated, null, 2));
                        }}
                          placeholder="Escribe la pregunta..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-2"
                        />
                        <textarea value={item.respuesta || ''} onChange={(e) => {
                          const updated = [...items];
                          updated[i] = { ...updated[i], respuesta: e.target.value };
                          setSectionItems(JSON.stringify(updated, null, 2));
                        }}
                          placeholder="Escribe la respuesta..."
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] resize-none"
                        />
                      </div>
                    ));
                  })()}
                  <button onClick={() => {
                    const current = (() => { try { return JSON.parse(sectionItems); } catch { return []; } })();
                    current.push({ pregunta: '', respuesta: '' });
                    setSectionItems(JSON.stringify(current, null, 2));
                  }}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#EE6B8D] rounded-xl font-quicksand text-sm font-semibold text-[#EE6B8D] hover:bg-[#FDF4F7] transition-colors mb-4"
                  >
                    <Plus size={16} />
                    Agregar pregunta
                  </button>
                </>
              )}

              {editingSection.tipo === 'showcase' && (
                <>
                  <hr className="border-gray-100 my-5" />
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-2 h-4 bg-[#EE6B8D] rounded-full" />
                    <h4 className="font-quicksand text-sm font-bold text-gray-700">Items del Showcase</h4>
                  </div>
                  {(() => {
                    const items = (() => { try { return JSON.parse(sectionItems); } catch { return []; } })();
                    return items.map((item: any, i: number) => (
                      <div key={i} className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-quicksand text-xs font-bold text-gray-500">Item {i + 1}{item.sku ? ` · ${item.sku}` : ''}</span>
                          <button onClick={() => {
                            const updated = items.filter((_: any, idx: number) => idx !== i);
                            setSectionItems(JSON.stringify(updated, null, 2));
                          }}
                            className="text-red-400 hover:text-red-600 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                        <input value={item.titulo || ''} onChange={(e) => {
                          const updated = [...items];
                          updated[i] = { ...updated[i], titulo: e.target.value };
                          setSectionItems(JSON.stringify(updated, null, 2));
                        }}
                          placeholder="Título del item"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-2"
                        />
                        <textarea value={item.descripcion || ''} onChange={(e) => {
                          const updated = [...items];
                          updated[i] = { ...updated[i], descripcion: e.target.value };
                          setSectionItems(JSON.stringify(updated, null, 2));
                        }}
                          placeholder="Descripción del item"
                          rows={2}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-2 resize-none"
                        />
                        <button
                          onClick={() => {
                            if (allProducts.length === 0) getVentifyProducts().then(setAllProducts).catch(() => {});
                            setPickingProductFor(pickingProductFor === i ? null : i);
                          }}
                          className="w-full flex items-center justify-center gap-2 py-2 border-2 border-dashed border-[#EE6B8D]/50 rounded-lg font-quicksand text-xs font-semibold text-[#EE6B8D] hover:bg-[#FDF4F7] transition-colors"
                        >
                          <Search size={14} />
                          {item.sku ? `Cambiar producto (${item.sku})` : 'Seleccionar producto'}
                        </button>

                        {pickingProductFor === i && (
                          <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden">
                            <div className="p-2 bg-gray-50 border-b border-gray-200">
                              <input
                                value={productSearch}
                                onChange={(e) => setProductSearch(e.target.value)}
                                placeholder="Buscar..."
                                className="w-full px-3 py-1.5 border border-gray-200 rounded-lg font-quicksand text-xs focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]"
                                autoFocus
                              />
                            </div>
                            <div className="max-h-48 overflow-y-auto divide-y divide-gray-100">
                              {allProducts
                                .filter((p: any) =>
                                  !productSearch || p.nombre?.toLowerCase().includes(productSearch.toLowerCase()) || p.sku?.toLowerCase().includes(productSearch.toLowerCase())
                                )
                                .slice(0, 30)
                                .map((p: any) => (
                                  <button
                                    key={p.id}
                                    onClick={() => {
                                      const updated = [...items];
                                      updated[i] = { ...updated[i], titulo: p.nombre, descripcion: p.descripcion || updated[i].descripcion, imagen: p.imagen || null, sku: p.sku };
                                      setSectionItems(JSON.stringify(updated, null, 2));
                                      setPickingProductFor(null);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[#FDF4F7] transition-colors"
                                  >
                                    {p.imagen && <img src={p.imagen} alt="" className="w-8 h-8 rounded-lg object-cover bg-gray-100 flex-shrink-0" />}
                                    <div className="min-w-0 flex-1">
                                      <p className="font-quicksand text-[11px] font-semibold text-gray-800 truncate">{p.nombre}</p>
                                      <p className="font-quicksand text-[9px] text-gray-400">{p.sku}</p>
                                    </div>
                                  </button>
                                ))}
                            </div>
                          </div>
                        )}

                        {item.sku && (
                          <div className="bg-[#FDE8EF] rounded-lg px-3 py-2 flex items-center gap-2 mt-2">
                            <Check size={14} className="text-[#C04267] flex-shrink-0" />
                            <span className="font-quicksand text-[11px] text-gray-600">Producto: <strong>{item.sku}</strong></span>
                          </div>
                        )}
                      </div>
                    ));
                  })()}
                  <button
                    onClick={() => {
                      if (allProducts.length === 0) getVentifyProducts().then(setAllProducts).catch(() => {});
                      setShowProductPicker(!showProductPicker);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-[#EE6B8D] rounded-xl font-quicksand text-sm font-semibold text-[#EE6B8D] hover:bg-[#FDF4F7] transition-colors mb-4"
                  >
                    <Plus size={16} />
                    {showProductPicker ? 'Ocultar' : 'Agregar item vacío'}
                  </button>

                  {showProductPicker && (
                    <div className="mb-4 border border-gray-200 rounded-xl overflow-hidden">
                      <div className="p-3 bg-gray-50 border-b border-gray-200">
                        <input
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          placeholder="Buscar producto..."
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
                                const current = (() => { try { return JSON.parse(sectionItems); } catch { return []; } })();
                                const exists = current.some((i: any) => i.sku === p.sku);
                                if (!exists) {
                                  current.push({ titulo: p.nombre, descripcion: p.descripcion || 'Producto artesanal tejido a mano', imagen: p.imagen || null, sku: p.sku });
                                  setSectionItems(JSON.stringify(current, null, 2));
                                }
                                setShowProductPicker(false);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[#FDF4F7] transition-colors"
                            >
                              {p.imagen && <img src={p.imagen} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />}
                              <div className="min-w-0 flex-1">
                                <p className="font-quicksand text-xs font-semibold text-gray-800 truncate">{p.nombre}</p>
                                <p className="font-quicksand text-[10px] text-gray-400">{p.sku}</p>
                              </div>
                            </button>
                          ))}
                        {allProducts.length === 0 && (
                          <p className="p-4 text-center font-quicksand text-xs text-gray-400">Cargando productos...</p>
                        )}
                      </div>
                    </div>
                  )}
                </>
              )}

              {editingSection.tipo === 'personalizados' && (
                <>
                  <hr className="border-gray-100 my-5" />
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-4 bg-[#C04267] rounded-full" />
                    <h4 className="font-quicksand text-sm font-bold text-gray-700">Hero de Personalizados</h4>
                  </div>

                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Badge</label>
                  <input value={persBadge} onChange={(e) => setPersBadge(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-3"
                  />

                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Línea 1 del título</label>
                  <input value={persTituloLinea1} onChange={(e) => setPersTituloLinea1(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-3"
                  />

                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Línea 2 del título (color rosa)</label>
                  <input value={persTituloLinea2} onChange={(e) => setPersTituloLinea2(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-3"
                  />

                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Texto botón primario (sin sesión)</label>
                  <input value={persBotonPrimario} onChange={(e) => setPersBotonPrimario(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-3"
                  />

                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Texto botón primario (con sesión)</label>
                  <input value={persBotonPrimarioLogged} onChange={(e) => setPersBotonPrimarioLogged(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-3"
                  />

                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Texto botón secundario</label>
                  <input value={persBotonSecundario} onChange={(e) => setPersBotonSecundario(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-3"
                  />

                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Estadística</label>
                  <input value={persEstadistica} onChange={(e) => setPersEstadistica(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-3"
                  />

                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Etiqueta del precio</label>
                  <input value={persEtiquetaPrecio} onChange={(e) => setPersEtiquetaPrecio(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-3"
                  />

                  <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Valor del precio</label>
                  <input value={persValorPrecio} onChange={(e) => setPersValorPrecio(e.target.value)}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4"
                  />
                </>
              )}

              <div className="flex gap-3">
                <button onClick={() => setEditingSection(null)}
                  className="flex-1 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button onClick={handleSectionSave}
                  className="flex-1 py-2.5 bg-[#EE6B8D] hover:bg-[#C04267] text-white rounded-lg font-quicksand text-sm font-semibold transition-colors"
                >
                  Guardar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de edición de evento */}
        {editingEvento !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            onClick={() => setEditingEvento(null)}
          >
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-fredoka text-lg font-bold text-[#C04267]">
                  {isNewEvento ? "Crear evento" : "Editar evento"}
                </h3>
                <button onClick={() => setEditingEvento(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Nombre</label>
              <input value={editEventoNombre} onChange={(e) => {
                setEditEventoNombre(e.target.value);
                if (isNewEvento) setEditEventoSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''));
              }}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4"
              />

              <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Slug (URL)</label>
              <input value={editEventoSlug} onChange={(e) => setEditEventoSlug(e.target.value)}
                placeholder="ej: mi-evento"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4"
              />
              <p className="font-quicksand text-[10px] text-gray-400 -mt-3 mb-4">Se generará como /evento/{editEventoSlug || "mi-evento"}</p>

              <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Descripción</label>
              <textarea value={editEventoDescripcion} onChange={(e) => setEditEventoDescripcion(e.target.value)}
                rows={3}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-4 resize-none"
              />

              <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Imagen del evento <span className="text-gray-400 font-normal normal-case">(1200×675px recomendado)</span></label>
              <input value={editEventoImagen} onChange={(e) => setEditEventoImagen(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] mb-3"
              />

              <div
                onDragOver={(e) => { e.preventDefault(); setHeroDragOver(4); }}
                onDragLeave={() => setHeroDragOver(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  setHeroDragOver(null);
                  const file = e.dataTransfer.files?.[0];
                  if (file?.type.startsWith("image/")) subirEventoImg(file);
                  const text = e.dataTransfer.getData("text");
                  if (text && esUrlImagen(text)) setEditEventoImagen(text.trim());
                }}
                onPaste={(e) => {
                  const items = e.clipboardData?.items;
                  if (!items) return;
                  for (const item of Array.from(items)) {
                    if (item.type.startsWith("image/")) {
                      const file = item.getAsFile();
                      if (file) { e.preventDefault(); subirEventoImg(file); return; }
                    }
                    if (item.type === "text/plain") {
                      const text = e.clipboardData.getData("text");
                      if (esUrlImagen(text)) { e.preventDefault(); setEditEventoImagen(text.trim()); return; }
                    }
                  }
                }}
                onClick={() => eventoImgRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all mb-4 ${
                  heroDragOver === 4 ? "border-[#EE6B8D] bg-[#FDF4F7]" : "border-gray-200 hover:border-[#EE6B8D] hover:bg-[#FDF4F7]/50"
                }`}
              >
                <input
                  ref={eventoImgRef}
                  type="file" accept="image/*" className="hidden"
                  onChange={(e) => { const f = e.target.files?.[0]; if (f) subirEventoImg(f); }}
                />
                {eventoImgUploading ? (
                  <Loader2 size={24} className="mx-auto animate-spin text-[#EE6B8D]" />
                ) : (
                  <>
                    <Upload size={24} className="mx-auto text-[#EE6B8D] mb-1" />
                    <p className="font-quicksand text-xs font-semibold text-gray-700">Click, arrastra o pega (Ctrl+V)</p>
                    <p className="font-quicksand text-[10px] text-gray-400 mt-0.5">Sube una imagen para el evento</p>
                  </>
                )}
              </div>

              {editEventoImagen && (
                <div className="relative aspect-video rounded-xl bg-gray-50 border border-gray-200 overflow-hidden mb-4 group">
                  <img src={editEventoImagen} alt="" className="w-full h-full object-contain"
                    onError={(e) => { (e.target as HTMLImageElement).src = ""; }}
                  />
                  <button onClick={() => setEditEventoImagen("")}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-600"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <div className="flex items-center gap-4 border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="evento-destacado"
                    checked={editingEvento.featured || false}
                    onChange={(e) => setEditingEvento({ ...editingEvento, featured: e.target.checked })}
                    className="w-4 h-4 accent-[#EE6B8D]"
                  />
                  <label htmlFor="evento-destacado" className="font-quicksand text-xs font-semibold text-gray-600">Destacar en navbar</label>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                {!isNewEvento && (
                  <button onClick={async () => {
                    if (!confirm("¿Eliminar este evento?")) return;
                    const ok = await apiPatch({ action: "eliminar-evento", id: editingEvento.id });
                    if (ok) { fetchData(); setEditingEvento(null); }
                  }}
                    className="px-4 py-2.5 border border-red-200 rounded-lg font-quicksand text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={14} className="inline mr-1" />
                    Eliminar
                  </button>
                )}
                <div className="flex-1" />
                <button onClick={() => setEditingEvento(null)}
                  className="px-4 py-2.5 border border-gray-200 rounded-lg font-quicksand text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button onClick={async () => {
                  if (isNewEvento) {
                    const res = await fetch("/api/admin", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ nombre: editEventoNombre, slug: editEventoSlug, descripcion: editEventoDescripcion, imagen_url: editEventoImagen }),
                    });
                    if (res.ok) { fetchData(); setEditingEvento(null); }
                  } else {
                    const updateData: Record<string, any> = {
                      nombre: editEventoNombre,
                      slug: editEventoSlug,
                      descripcion: editEventoDescripcion || null,
                      imagen_url: editEventoImagen || null,
                    };
                    if (editingEvento.featured) {
                      await apiPatch({ action: "destacar-evento", id: editingEvento.id });
                    } else {
                      updateData.featured = false;
                    }
                    const ok = await apiPatch({ action: "actualizar-evento", id: editingEvento.id, ...updateData });
                    if (ok) { fetchData(); setEditingEvento(null); }
                  }
                }}
                  className="px-6 py-2.5 bg-[#EE6B8D] hover:bg-[#C04267] text-white rounded-lg font-quicksand text-xs font-semibold transition-colors"
                >
                  {isNewEvento ? "Crear" : "Guardar"}
                </button>
              </div>
            </div>
          </div>
        )}

        {tab === "productos" && (() => {
          const featuredEvent = eventos.find((e: any) => e.featured);
          const featuredEventSlug = featuredEvent?.slug;
          const productosFiltrados = productosFilter === "evento-destacado"
            ? (featuredEventSlug ? filterByEventSlug(rawProducts, featuredEventSlug) : [])
            : filterProductos(rawProducts, productosFilter);
          const productosVisibles = productosFiltrados.filter((p: any) =>
            !productosSearch ||
            p.nombre?.toLowerCase().includes(productosSearch.toLowerCase()) ||
            p.sku?.toLowerCase().includes(productosSearch.toLowerCase())
          );
          const filterLabel =
            productosFilter === "evento-destacado" && featuredEvent
              ? featuredEvent.nombre
              : productosFilter === "ver-todo"
                ? "todo el catálogo"
                : [...CATALOGO_FILTERS, ...EVENTO_FILTERS, { key: "page-personalizados", label: "Personalizados" }]
                    .find((f) => f.key === productosFilter)?.label || "todo el catálogo";

          return (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
              <div>
                <h2 className="font-fredoka text-xl font-bold text-[#C04267]">Productos</h2>
                {rawProducts.length > 0 && (
                  <p className="font-quicksand text-xs text-gray-400 mt-1">
                    {productosFiltrados.length} producto{productosFiltrados.length !== 1 ? "s" : ""} en {filterLabel} · {inactiveIds.size} oculto{inactiveIds.size !== 1 ? "s" : ""} de la web
                  </p>
                )}
              </div>
              <div className="relative w-full sm:w-80">
                <input
                  value={productosSearch}
                  onChange={(e) => setProductosSearch(e.target.value)}
                  placeholder="Buscar producto por nombre o SKU..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] pr-10"
                />
                <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#FDE8EF] shadow-sm p-4 mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="font-quicksand text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-1 min-w-[64px]">Catálogo</span>
                {CATALOGO_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setProductosFilter(f.key)}
                    className={`font-quicksand text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                      productosFilter === f.key ? "bg-[#EE6B8D] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-[#FDE8EF] hover:text-[#C04267]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="font-quicksand text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-1 min-w-[64px]">Eventos</span>
                {EVENTO_FILTERS.map((f) => (
                  <button
                    key={f.key}
                    onClick={() => setProductosFilter(f.key)}
                    className={`font-quicksand text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                      productosFilter === f.key ? "bg-[#EE6B8D] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-[#FDE8EF] hover:text-[#C04267]"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-quicksand text-[10px] font-bold uppercase tracking-wider text-gray-400 mr-1 min-w-[64px]">Páginas</span>
                <button
                  onClick={() => setProductosFilter("page-personalizados")}
                  className={`font-quicksand text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                    productosFilter === "page-personalizados" ? "bg-[#EE6B8D] text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-[#FDE8EF] hover:text-[#C04267]"
                  }`}
                >
                  Personalizados
                </button>
                {featuredEvent && (
                  <button
                    onClick={() => setProductosFilter("evento-destacado")}
                    className={`font-quicksand text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                      productosFilter === "evento-destacado" ? "bg-[#C04267] text-white shadow-sm" : "bg-[#FDE8EF] text-[#C04267] hover:bg-[#F3D5E0]"
                    }`}
                  >
                    <Star size={12} className="inline mr-1 -mt-0.5" fill="currentColor" />
                    Destacado: {featuredEvent.nombre}
                  </button>
                )}
              </div>
            </div>

            {rawProducts.length === 0 ? (
              <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-[#FDE8EF]">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 size={24} className="animate-spin text-[#EE6B8D]" />
                  <p className="font-quicksand text-xs text-gray-400">Cargando productos...</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#FDE8EF] shadow-sm overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#FDE8EF] bg-gray-50/50">
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Producto</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">SKU</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Categoría</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Precio</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Stock</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Estado</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap text-right">Visible en web</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosVisibles.map((p: any) => {
                      const isActive = !inactiveIds.has(p.id);
                      return (
                        <tr
                          key={p.id}
                          className={`border-b border-gray-50 transition-colors ${
                            isActive ? "hover:bg-[#FDF4F7]/50" : "bg-gray-50/50 hover:bg-gray-100/60"
                          }`}
                        >
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-3">
                              {p.imagen && <img src={p.imagen} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />}
                              <p className="font-quicksand text-xs font-semibold text-gray-800 max-w-[220px] truncate" title={p.nombre}>{p.nombre}</p>
                            </div>
                          </td>
                          <td className="px-3 py-3 font-quicksand text-[11px] text-gray-500">{p.sku}</td>
                          <td className="px-3 py-3 font-quicksand text-xs text-gray-500">{p.categoria}</td>
                          <td className="px-3 py-3 font-quicksand text-xs text-gray-700 whitespace-nowrap">S/ {p.precio?.toFixed(2)}</td>
                          <td className="px-3 py-3">
                            <span className={`font-quicksand text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              p.stock === 0 ? "bg-gray-100 text-gray-500" : p.stock <= 5 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                            }`}>
                              {p.stock === 0 ? "A pedido" : `${p.stock} uds`}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className={`font-quicksand text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"
                            }`}>
                              {isActive ? "Activo" : "Oculto"}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <button
                              onClick={() => handleToggleProducto(p, !isActive)}
                              title={isActive ? "Ocultar de la web" : "Mostrar en la web"}
                              className={`relative inline-flex w-11 h-6 rounded-full transition-colors ${isActive ? "bg-green-400" : "bg-gray-300"}`}
                            >
                              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-5" : ""}`} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                    {productosVisibles.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-3 py-10 text-center font-quicksand text-xs text-gray-400">
                          {productosSearch
                            ? `No se encontraron productos con "${productosSearch}"`
                            : productosFiltrados.length === 0
                              ? `No hay productos en este filtro.`
                              : "Cargando productos..."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          );
        })()}

        {tab === "precios" && (
          <div>
            <div className="mb-6">
              <h2 className="font-fredoka text-xl font-bold text-[#C04267]">Precios por tamaño</h2>
              <p className="font-quicksand text-xs text-gray-400 mt-1">
                Precio que se mostrará en el detalle del producto según el tamaño que elija el cliente.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="font-quicksand text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FDE8EF] text-[#C04267]">Pequeño = Costo</span>
              <span className="font-quicksand text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FDE8EF] text-[#C04267]">Mediano = Sugerido</span>
              <span className="font-quicksand text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FDE8EF] text-[#C04267]">Grande = Mínimo</span>
            </div>

            {amiguProducts.length === 0 ? (
              <div className="flex items-center justify-center py-20 bg-white rounded-2xl border border-[#FDE8EF]">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 size={24} className="animate-spin text-[#EE6B8D]" />
                  <p className="font-quicksand text-xs text-gray-400">Cargando productos personalizados...</p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#FDE8EF] shadow-sm overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#FDE8EF] bg-gray-50/50">
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Producto</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">SKU</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Precio Ventify</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Pequeño (10–15 cm)</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Mediano (16–25 cm)</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Grande (26 cm a más)</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap text-right">Guardar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {amiguProducts.map((p) => {
                      const draft = preciosDraft[p.sku];
                      const saved = preciosRows[p.sku];
                      const hasChanges = (() => {
                        if (!saved) return false;
                        const eq = (a: any, b: string) => {
                          if (b.trim() === "") return a == null;
                          return Number(a) === parseFloat(b);
                        };
                        return !(
                          eq(saved.precio_pequeno, draft?.pequeno || "") &&
                          eq(saved.precio_mediano, draft?.mediano || "") &&
                          eq(saved.precio_grande, draft?.grande || "")
                        );
                      })();
                      return (
                        <tr key={p.id} className="border-b border-gray-50 hover:bg-[#FDF4F7]/50 transition-colors">
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-3">
                              {p.imagen && <img src={p.imagen} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />}
                              <p className="font-quicksand text-xs font-semibold text-gray-800 max-w-[200px] truncate" title={p.nombre}>{p.nombre}</p>
                            </div>
                          </td>
                          <td className="px-3 py-3 font-quicksand text-[11px] text-gray-500">{p.sku}</td>
                          <td className="px-3 py-3 font-quicksand text-xs text-gray-500 whitespace-nowrap">S/ {p.precio?.toFixed(2)}</td>
                          {(["pequeno", "mediano", "grande"] as const).map((key) => (
                            <td key={key} className="px-3 py-3">
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={draft?.[key] ?? ""}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setPreciosDraft((prev) => {
                                    const current = prev[p.sku] || { pequeno: "", mediano: "", grande: "" };
                                    return { ...prev, [p.sku]: { ...current, [key]: v } };
                                  });
                                }}
                                placeholder="—"
                                className="w-24 px-2.5 py-2 border border-gray-200 rounded-lg font-quicksand text-xs focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]"
                              />
                            </td>
                          ))}
                          <td className="px-3 py-3 text-right">
                            <button
                              onClick={() => handleGuardarPrecios(p.sku)}
                              disabled={preciosSaving === p.sku}
                              className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg font-quicksand text-xs font-semibold transition-colors ${
                                preciosSaving === p.sku
                                  ? "bg-gray-100 text-gray-400"
                                  : "bg-[#EE6B8D] hover:bg-[#C04267] text-white shadow-sm"
                              }`}
                            >
                              {preciosSaving === p.sku ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : saved ? (
                                <Save size={14} />
                              ) : null}
                              {preciosSaving === p.sku ? "Guardando..." : saved ? "Guardado" : "Guardar"}
                            </button>
                            {saved && hasChanges && (
                              <p className="font-quicksand text-[10px] text-amber-600 mt-1">Sin guardar</p>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab === "resenas" && !loading && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-fredoka text-xl font-bold text-[#C04267]">Reseñas</h2>
              <button onClick={() => {
                setShowResenaForm(!showResenaForm);
                if (!allProducts.length) getVentifyProducts().then(setAllProducts).catch(() => {});
              }}
                className="flex items-center gap-2 text-xs text-white bg-[#EE6B8D] hover:bg-[#C04267] px-4 py-2.5 rounded-lg font-quicksand font-semibold transition-colors shadow-sm"
              >
                <Plus size={14} />
                Agregar reseña manual
              </button>
            </div>

            {showResenaForm && (
              <div className="bg-white rounded-2xl border border-[#FDE8EF] shadow-sm p-5 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">
                      Producto
                    </label>
                    <div className="relative">
                      <input
                        value={resenaSearch}
                        onChange={(e) => setResenaSearch(e.target.value)}
                        placeholder="Buscar producto por nombre o SKU..."
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] pr-10"
                      />
                      <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                    {resenaSearch && (
                      <div className="mt-2 border border-gray-200 rounded-xl overflow-hidden max-h-52 overflow-y-auto">
                        {allProducts
                          .filter((p: any) =>
                            !resenaSearch || p.nombre?.toLowerCase().includes(resenaSearch.toLowerCase()) || p.sku?.toLowerCase().includes(resenaSearch.toLowerCase())
                          )
                          .slice(0, 20)
                          .map((p: any) => (
                            <button
                              key={p.id}
                              onClick={() => { setResenaProducto(p); setResenaSearch(""); }}
                              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-[#FDF4F7] transition-colors ${resenaProducto?.id === p.id ? 'bg-[#FDF4F7] border-l-4 border-[#EE6B8D]' : ''}`}
                            >
                              {p.imagen && <img src={p.imagen} alt="" className="w-10 h-10 rounded-lg object-cover bg-gray-100 flex-shrink-0" />}
                              <div className="min-w-0 flex-1">
                                <p className="font-quicksand text-xs font-semibold text-gray-800 truncate">{p.nombre}</p>
                                <p className="font-quicksand text-[10px] text-gray-400">{p.sku} · S/ {p.precio?.toFixed(2)}</p>
                              </div>
                              {resenaProducto?.id === p.id && <Check size={16} className="text-[#EE6B8D] flex-shrink-0" />}
                            </button>
                          ))}
                        {allProducts.length === 0 && (
                          <p className="p-4 text-center font-quicksand text-xs text-gray-400">Cargando productos...</p>
                        )}
                      </div>
                    )}
                    {resenaProducto && (
                      <div className="bg-[#FDE8EF] rounded-xl p-3 flex items-center gap-3 mt-2">
                        <Check size={18} className="text-[#C04267] flex-shrink-0" />
                        <p className="font-quicksand text-xs text-gray-700">
                          Producto: <strong>{resenaProducto.nombre}</strong> · {resenaProducto.sku}
                        </p>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Nombre del cliente</label>
                    <input
                      value={resenaNombre}
                      onChange={(e) => setResenaNombre(e.target.value)}
                      placeholder="Ej: María G."
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]"
                    />
                  </div>

                  <div>
                    <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Calificación</label>
                    <div className="flex items-center gap-1 py-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button key={i} onClick={() => setResenaCalificacion(i)} className="p-0.5">
                          <Star size={22} className={i <= resenaCalificacion ? "text-[#F5A623]" : "text-gray-200"} fill={i <= resenaCalificacion ? "#F5A623" : "none"} />
                        </button>
                      ))}
                      {resenaCalificacion > 0 && (
                        <span className="font-quicksand text-xs text-gray-500 ml-2">{resenaCalificacion}/5</span>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="font-quicksand text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5 block">Comentario (opcional)</label>
                    <textarea
                      value={resenaComentario}
                      onChange={(e) => setResenaComentario(e.target.value)}
                      rows={2}
                      placeholder="Ej: Hermoso trabajo, calidad excelente"
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-lg font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] resize-none"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <button onClick={() => setShowResenaForm(false)}
                    className="px-4 py-2.5 rounded-lg font-quicksand text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button onClick={handleCrearResenaManual}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-quicksand text-xs font-semibold text-white bg-[#EE6B8D] hover:bg-[#C04267] transition-colors"
                  >
                    <Check size={14} />
                    Publicar reseña
                  </button>
                </div>
              </div>
            )}

            {data.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl border border-[#FDE8EF]">
                <Star size={28} className="mx-auto text-gray-200 mb-2" />
                <p className="font-quicksand text-gray-400">No hay reseñas todavía.</p>
                <p className="font-quicksand text-xs text-gray-400 mt-1">
                  Cuando un cliente califique, aparecerá aquí para que la apruebes o elimines.
                </p>
              </div>
            )}

            {data.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#FDE8EF] shadow-sm overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-[#FDE8EF] bg-gray-50/50">
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Producto</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Cliente</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Calificación</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Comentario</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Estado</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Fecha</th>
                      <th className="px-3 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider whitespace-nowrap">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row: any) => (
                      <tr key={row.id} className="border-b border-gray-50 hover:bg-[#FDF4F7]/50 transition-colors">
                        <td className="px-3 py-3">
                          <p className="font-quicksand text-xs font-semibold text-gray-800 max-w-[220px] truncate" title={row.producto_nombre || ""}>
                            {row.producto_nombre || "—"}
                          </p>
                          <p className="font-quicksand text-[10px] text-gray-400">{row.producto_sku || ""}</p>
                        </td>
                        <td className="px-3 py-3 font-quicksand text-xs text-gray-700">{row.nombre_cliente}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} size={12} className={i <= row.calificacion ? "text-[#F5A623]" : "text-gray-200"} fill={i <= row.calificacion ? "#F5A623" : "none"} />
                              ))}
                            </div>
                            <span className="font-quicksand text-xs text-gray-500 ml-1">{row.calificacion}</span>
                          </div>
                        </td>
                        <td className="px-3 py-3 font-quicksand text-xs text-gray-500 max-w-[260px]">
                          <p className="truncate" title={row.comentario || ""}>{row.comentario || "—"}</p>
                          {row.es_manual && (
                            <span className="text-[10px] uppercase tracking-wider text-purple-500 bg-purple-50 px-2 py-0.5 rounded-full">Manual</span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`font-quicksand text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            row.aprobado ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                          }`}>
                            {row.aprobado ? "Aprobada" : "Pendiente"}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-quicksand text-xs text-gray-500 whitespace-nowrap">{formatDate(row.created_at)}</td>
                        <td className="px-3 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {!row.aprobado && (
                              <button onClick={() => handleAprobarResena(row.id, true)}
                                className="flex items-center gap-1 text-xs text-[#EE6B8D] hover:text-[#C04267] font-quicksand font-medium"
                              >
                                <Check size={14} /> Aprobar
                              </button>
                            )}
                            {row.aprobado && (
                              <button onClick={() => handleAprobarResena(row.id, false)}
                                className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-quicksand font-medium"
                              >
                                <Eye size={14} /> Ocultar
                              </button>
                            )}
                            <button onClick={() => handleEliminarResena(row.id)}
                              className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 font-quicksand font-medium"
                            >
                              <Trash2 size={14} /> Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {tab !== "dashboard" && tab !== "heroes" && tab !== "inicio" && tab !== "eventos" && tab !== "resenas" && tab !== "productos" && tab !== "precios" && !loading && data.length > 0 && (
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
                  {data.map((row: any, rowIdx: number) => {
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

                          if (key === "usuario_id" && tab === "pedidos") {
                            return (
                              <td key={key} className="px-3 py-3 font-quicksand text-xs text-gray-700">
                                {rowIdx + 1}
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
