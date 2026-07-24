"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  MessageCircle,
  ImagePlus,
  X,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type ProductoRef = {
  id: string;
  nombre: string;
  precio: number;
};

const TAMANOS = [
  { valor: "pequeno", label: "Pequeño", desc: "10–15 cm" },
  { valor: "mediano", label: "Mediano", desc: "16–25 cm" },
  { valor: "grande", label: "Grande", desc: "26 cm a más" },
];

const EXTRAS = [
  "Llavero",
  "Base / peana",
  "Ojos de seguridad",
  "Accesorios (lentes, gorro, etc.)",
  "Empaque de regalo",
];

function limpiarInput(texto: string) {
  return texto.replace(/\s{3,}/g, "  ").slice(0, 1000);
}

interface Props {
  productos: ProductoRef[];
  onSuccess?: () => void;
}

export default function QuoteForm({ productos, onSuccess }: Props) {
  const { user } = useAuth();
  const detallesRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [productoId, setProductoId] = useState("");
  const [detalles, setDetalles] = useState("");
  const [tamano, setTamano] = useState("mediano");
  const [extras, setExtras] = useState<string[]>([]);
  const [fechaEntrega, setFechaEntrega] = useState("");

  const [imagenes, setImagenes] = useState<{ file?: File; url: string; uploading?: boolean }[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const productoSeleccionado = useMemo(
    () => productos.find((p) => p.id === productoId),
    [productos, productoId]
  );

  const fechaMinima = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().split("T")[0];
  }, []);

  const nombreCliente = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "";
  const emailCliente = user?.email || "";

  function toggleExtra(e: string) {
    setExtras((prev) => (prev.includes(e) ? prev.filter((x) => x !== e) : [...prev, e]));
  }

  const procesarArchivos = useCallback(async (files: FileList | File[]) => {
    const nuevos: { file: File; url: string }[] = [];
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg("Cada imagen debe pesar menos de 5 MB");
        continue;
      }
      nuevos.push({ file, url: URL.createObjectURL(file) });
    }
    setImagenes((prev) => [...prev, ...nuevos]);
  }, []);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) procesarArchivos(e.target.files);
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) procesarArchivos(e.dataTransfer.files);
    const text = e.dataTransfer.getData("text");
    if (text && esUrlImagen(text)) {
      setImagenes((prev) => {
        if (prev.some((img) => img.url === text.trim())) return prev;
        return [...prev, { url: text.trim() }];
      });
    }
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(true);
  }

  function handleDragLeave() {
    setDragOver(false);
  }

  function handlePaste(e: React.ClipboardEvent) {
    const items = e.clipboardData?.items;
    if (!items) return;

    const archivos: File[] = [];
    let textoPlano = "";

    for (const item of Array.from(items)) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) archivos.push(file);
      } else if (item.type === "text/plain") {
        textoPlano = e.clipboardData.getData("text");
      } else if (item.type === "text/html") {
        const html = e.clipboardData.getData("text/html");
        const match = html.match(/<img[^>]+src=["']([^"']+)["']/i);
        if (match && !textoPlano) textoPlano = match[1];
      }
    }

    if (archivos.length > 0) {
      e.preventDefault();
      procesarArchivos(archivos);
    }

    if (textoPlano && esUrlImagen(textoPlano)) {
      e.preventDefault();
      setImagenes((prev) => {
        if (prev.some((img) => img.url === textoPlano.trim())) return prev;
        return [...prev, { url: textoPlano.trim() }];
      });
    }
  }

  function esUrlImagen(text: string): boolean {
    const t = text.trim();
    if (!t.startsWith("http://") && !t.startsWith("https://")) return false;
    if (/\.(jpe?g|png|gif|webp|bmp|avif|heic|svg)(\?\S*)?$/i.test(t)) return true;
    if (/^https?:\/\/([\w-]+\.)+[\w-]+/.test(t)) return true;
    return false;
  }

  function agregarUrlManual() {
    const url = urlInput.trim();
    if (!url) return;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setErrorMsg("El enlace debe comenzar con http:// o https://");
      return;
    }
    setImagenes((prev) => {
      if (prev.some((img) => img.url === url)) return prev;
      return [...prev, { url }];
    });
    setUrlInput("");
    setShowUrlInput(false);
    setErrorMsg("");
  }

  function eliminarImagen(index: number) {
    setImagenes((prev) => {
      const img = prev[index];
      if (img.url.startsWith("blob:")) URL.revokeObjectURL(img.url);
      return prev.filter((_, i) => i !== index);
    });
  }

  async function subirImagenes(): Promise<string[]> {
    const urlsFinales: string[] = [];
    const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
    const supabase = getSupabaseBrowserClient();

    for (const img of imagenes) {
      if (!img.file) {
        urlsFinales.push(img.url);
        continue;
      }
      const ext = img.file.name.split(".").pop() || "jpg";
      const nombre = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const ruta = `${user?.id || "anon"}/${nombre}`;

      const { error } = await supabase.storage.from("cotizaciones").upload(ruta, img.file, {
        cacheControl: "3600",
        upsert: false,
      });

      if (error) {
        console.error("Error subiendo imagen:", error);
        continue;
      }

      const { data: publicUrl } = supabase.storage.from("cotizaciones").getPublicUrl(ruta);
      urlsFinales.push(publicUrl.publicUrl);
    }
    return urlsFinales;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setErrorMsg("");

    if (detalles.trim().length < 10) {
      setStatus("error");
      setErrorMsg("Cuéntanos un poco más de tu idea (mínimo 10 caracteres).");
      return;
    }

    setStatus("loading");

    const extrasFinal = extras.join(", ");

    try {
      const urlsImagenes = await subirImagenes();
      const { getSupabaseBrowserClient } = await import("@/lib/supabase/client");
      const supabase = getSupabaseBrowserClient();
      const { error } = await supabase.from("pedidos_personalizados").insert({
        nombre_cliente: nombreCliente,
        telefono: emailCliente,
        email: emailCliente,
        producto_id: productoSeleccionado?.id || null,
        producto_nombre: productoSeleccionado?.nombre || null,
        producto_precio: productoSeleccionado?.precio || null,
        detalles: limpiarInput(detalles),
        colores: null,
        tamano,
        extras: extrasFinal || null,
        fecha_entrega: fechaEntrega,
        estado: "pendiente",
        imagenes_url: urlsImagenes.length > 0 ? urlsImagenes : null,
      });

      if (error) throw error;
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("No pudimos enviar tu pedido. Intenta de nuevo o escríbenos por WhatsApp.");
    }
  }

  const mensajeWhatsapp = useMemo(() => {
    const partes = [
      "Hola, quisiera cotizar un pedido personalizado.",
      `Nombre: ${nombreCliente}`,
      productoSeleccionado && `Referencia: ${productoSeleccionado.nombre}`,
      tamano && `Tamaño: ${TAMANOS.find((t) => t.valor === tamano)?.label}`,
      detalles && `Detalles: ${detalles}`,
    ].filter(Boolean);
    return encodeURIComponent(partes.join("\n"));
  }, [nombreCliente, productoSeleccionado, tamano, detalles]);

  if (status === "success") {
    return (
      <div className="p-10 text-center">
        <div className="w-16 h-16 bg-[#FDF4F7] rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-9 h-9 text-[#EE6B8D]" />
        </div>
        <h3 className="font-fredoka text-2xl font-bold text-[#C04267] mb-2">
          ¡Recibimos tu pedido!
        </h3>
        <p className="font-quicksand text-sm text-[#6B6B6B] mb-6">
          Te escribiremos al {emailCliente} en menos de 24 horas. Si quieres avisarnos ahora, escríbenos por WhatsApp.
        </p>
        <a
          href={`https://wa.me/51902578295?text=${mensajeWhatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 font-quicksand px-6 py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white font-bold text-sm rounded-xl transition-all"
        >
          <MessageCircle size={18} />
          Avisar por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 sm:p-8">
      <div className="grid md:grid-cols-5 gap-6">
        {/* COLUMNA PRINCIPAL — DESCRIPCIÓN + IMÁGENES */}
        <div className="md:col-span-3 space-y-5">
          <div>
            <h3 className="font-fredoka text-lg font-semibold text-[#C04267] mb-1">
              Describe tu idea
            </h3>
            <p className="font-quicksand text-xs text-[#6B6B6B] mb-3">
              Cuéntanos qué quieres crear — personaje, mascota, diseño original
            </p>

            {productos.length > 0 && (
              <div className="mb-4">
                <label className="font-quicksand text-xs font-semibold text-[#4A4A4A] mb-1.5 block">
                  Referencia de la galería (opcional)
                </label>
                <select
                  value={productoId}
                  onChange={(e) => setProductoId(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 font-quicksand text-sm text-[#4A4A4A] bg-white focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]"
                >
                  <option value="">Es una idea nueva</option>
                  {productos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre} — S/ {p.precio.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <textarea
              ref={detallesRef}
              required
              rows={6}
              value={detalles}
              onChange={(e) => setDetalles(e.target.value)}
              onPaste={handlePaste}
              placeholder="Ej: Un osito color café con bufanda roja y gorro navideño, tamaño mediano, sentado..."
              className="w-full rounded-lg border border-gray-200 px-4 py-3 font-quicksand text-sm text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] focus:border-transparent resize-none transition-shadow"
              maxLength={1000}
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="font-quicksand text-[11px] text-gray-400">{detalles.length}/1000</p>
            </div>
          </div>

          {/* IMÁGENES DE REFERENCIA */}
          <div>
            <h4 className="font-fredoka text-base font-semibold text-[#C04267] mb-2">
              Imágenes de referencia {imagenes.length > 0 && <span className="text-[#EE6B8D]">({imagenes.length})</span>}
            </h4>
            <p className="font-quicksand text-xs text-[#6B6B6B] mb-3">
              Sube fotos, pega una imagen (Ctrl+V) o comparte un enlace de Facebook, WhatsApp, Google, etc.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />

            {/* Zona de drop / upload */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                dragOver
                  ? "border-[#EE6B8D] bg-[#FDF4F7]"
                  : "border-gray-200 hover:border-[#EE6B8D] hover:bg-[#FDF4F7]/50"
              }`}
            >
              <ImagePlus size={36} className="mx-auto text-[#EE6B8D] mb-2" />
              <p className="font-quicksand text-sm font-semibold text-[#4A4A4A]">
                Haz clic para seleccionar o arrastra imágenes aquí
              </p>
              <p className="font-quicksand text-xs text-gray-400 mt-1">
                También puedes pegar (Ctrl+V) imágenes o enlaces directamente
              </p>
            </div>

            {/* Botón para pegar URL */}
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="mt-2 flex items-center gap-1 font-quicksand text-xs text-[#EE6B8D] hover:text-[#C04267] font-semibold transition-colors"
            >
              <ChevronRight size={14} className={`transition-transform ${showUrlInput ? "rotate-90" : ""}`} />
              Pegar enlace de imagen
            </button>

            {showUrlInput && (
              <div className="flex gap-2 mt-2">
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); agregarUrlManual(); } }}
                  placeholder="https://..."
                  className="flex-1 rounded-lg border border-gray-200 px-3 py-2 font-quicksand text-sm focus:outline-none focus:ring-2 focus:ring-[#EE6B8D]"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={agregarUrlManual}
                  className="font-quicksand text-xs text-white bg-[#EE6B8D] hover:bg-[#C04267] px-3 py-2 rounded-lg font-semibold transition-colors"
                >
                  Agregar
                </button>
              </div>
            )}

            {/* Previews */}
            {imagenes.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-3">
                {imagenes.map((img, i) => (
                  <div key={i} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                    <img
                      src={img.url}
                      alt={`Referencia ${i + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🖼️</text></svg>";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => eliminarImagen(i)}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={12} />
                    </button>
                    {!img.file && (
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-quicksand">
                        URL
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA SECUNDARIA — DETALLES */}
        <div className="md:col-span-2 space-y-5">
          <div>
            <h4 className="font-fredoka text-base font-semibold text-[#C04267] mb-3">
              Tu información
            </h4>
            <div className="bg-gray-50 rounded-lg px-4 py-3 space-y-1">
              <p className="font-quicksand text-sm text-[#4A4A4A]">
                <span className="font-semibold">Nombre:</span> {nombreCliente}
              </p>
              <p className="font-quicksand text-sm text-[#4A4A4A]">
                <span className="font-semibold">Email:</span> {emailCliente}
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-fredoka text-base font-semibold text-[#C04267] mb-3">
              Detalles del diseño
            </h4>
            <div className="space-y-4">
              <div>
                <label className="font-quicksand text-xs font-semibold text-[#4A4A4A] mb-2 block">
                  Tamaño
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {TAMANOS.map((t) => (
                    <button
                      type="button"
                      key={t.valor}
                      onClick={() => setTamano(t.valor)}
                      className={`rounded-xl border-2 px-3 py-2.5 text-center transition-all ${
                        tamano === t.valor
                          ? "border-[#EE6B8D] bg-[#FDF4F7] shadow-sm"
                          : "border-gray-100 bg-white hover:border-gray-200"
                      }`}
                    >
                      <p className="font-quicksand text-sm font-bold text-[#4A4A4A]">{t.label}</p>
                      <p className="font-quicksand text-[11px] text-gray-400 mt-0.5">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-quicksand text-xs font-semibold text-[#4A4A4A] mb-2 block">
                  Extras (opcional)
                </label>
                <div className="flex flex-wrap gap-2">
                  {EXTRAS.map((ex) => {
                    const activo = extras.includes(ex);
                    return (
                      <button
                        type="button"
                        key={ex}
                        onClick={() => toggleExtra(ex)}
                        className={`font-quicksand text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                          activo
                            ? "bg-[#EE6B8D] border-[#EE6B8D] text-white font-semibold"
                            : "bg-white border-gray-200 text-[#6B6B6B] hover:border-[#EE6B8D]"
                        }`}
                      >
                        {ex}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="font-quicksand text-xs font-semibold text-[#4A4A4A] mb-1.5 block">
                  Fecha de entrega
                </label>
                <input
                  required
                  type="date"
                  min={fechaMinima}
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 px-4 py-2.5 font-quicksand text-sm text-[#4A4A4A] focus:outline-none focus:ring-2 focus:ring-[#EE6B8D] transition-shadow"
                />
                <p className="font-quicksand text-[11px] text-gray-400 mt-1">
                  Mínimo 7 días de producción.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {status === "error" && (
        <div className="mt-5 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          <p className="font-quicksand text-xs text-red-600">{errorMsg}</p>
        </div>
      )}

      <div className="mt-6">
        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full inline-flex items-center justify-center gap-2 font-quicksand px-8 py-3.5 bg-[#EE6B8D] hover:bg-[#C04267] disabled:opacity-60 text-white font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg"
        >
          {status === "loading" ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send size={18} />
              Enviar pedido de cotización
            </>
          )}
        </button>
      </div>
    </form>
  );
}
