"use client";
import { useState, useEffect } from "react";
import { Users, ShoppingBag, MessageSquare, ClipboardList, Mail, Eye, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { getAdminSuscriptores, getAdminPedidos, getAdminMensajes, getAdminReclamaciones, getAdminPedidosPersonalizados, marcarMensajeLeido, actualizarEstadoPedido } from "@/lib/db/admin";

type Tab = "suscriptores" | "pedidos" | "mensajes" | "reclamaciones" | "personalizados";

const tabs: { id: Tab; label: string; icon: any }[] = [
  { id: "suscriptores", label: "Suscriptores", icon: Users },
  { id: "pedidos", label: "Pedidos", icon: ShoppingBag },
  { id: "mensajes", label: "Mensajes", icon: MessageSquare },
  { id: "reclamaciones", label: "Reclamaciones", icon: ClipboardList },
  { id: "personalizados", label: "Pedidos Personalizados", icon: Mail }
];

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>("suscriptores");
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        let result: any[] = [];
        switch (tab) {
          case "suscriptores": result = await getAdminSuscriptores(); break;
          case "pedidos": result = await getAdminPedidos(); break;
          case "mensajes": result = await getAdminMensajes(); break;
          case "reclamaciones": result = await getAdminReclamaciones(); break;
          case "personalizados": result = await getAdminPedidosPersonalizados(); break;
        }
        setData(result);
      } catch (e) {
        console.error(e);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [tab]);

  const handleMarcarLeido = async (id: number) => {
    try {
      await marcarMensajeLeido(id);
      setData(prev => prev.map((item: any) => item.id === id ? { ...item, leido: true } : item));
    } catch (e) {
      console.error(e);
    }
  };

  const handleCambiarEstado = async (id: number, estado: string) => {
    try {
      await actualizarEstadoPedido(id, estado);
      setData(prev => prev.map((item: any) => item.id === id ? { ...item, estado } : item));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF4F7]">
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-gray-400 hover:text-[#EE6B8D] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="font-fredoka text-xl text-[#C04267]">Admin - Entre Hilos</h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-quicksand text-sm font-medium transition-all ${
                  tab === t.id
                    ? "bg-[#EE6B8D] text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-[#EE6B8D] hover:text-[#EE6B8D]"
                }`}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-[#9F86C0] font-quicksand">Cargando...</div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <p className="font-quicksand text-gray-400">No hay datos</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {Object.keys(data[0]).filter(k => k !== 'id').map(key => (
                    <th key={key} className="px-4 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider">
                      {key.replace(/_/g, ' ')}
                    </th>
                  ))}
                  <th className="px-4 py-3 font-quicksand text-xs text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row: any) => (
                  <tr key={row.id} className="border-b border-gray-50 hover:bg-[#FDF4F7]/50 transition-colors">
                    {Object.keys(data[0]).filter(k => k !== 'id').map(key => {
                      let value = row[key];
                      if (key === 'created_at' || key === 'updated_at') {
                        value = value ? new Date(value).toLocaleDateString("es-PE", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-";
                      } else if (typeof value === 'object' && value !== null) {
                        value = JSON.stringify(value).substring(0, 100) + (JSON.stringify(value).length > 100 ? "..." : "");
                      } else if (key === 'leido') {
                        value = value ? "Sí" : "No";
                      } else if (key === 'activo') {
                        value = value ? "Activo" : "Inactivo";
                      } else if (key === 'estado') {
                        return (
                          <td key={key} className="px-4 py-3">
                            <select value={value || 'pendiente'} onChange={(e) => handleCambiarEstado(row.id, e.target.value)}
                              className="font-quicksand text-xs px-2 py-1 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#EE6B8D]">
                              <option value="pendiente">Pendiente</option>
                              <option value="confirmado">Confirmado</option>
                              <option value="enviado">Enviado</option>
                              <option value="entregado">Entregado</option>
                              <option value="cancelado">Cancelado</option>
                            </select>
                          </td>
                        );
                      }
                      return <td key={key} className="px-4 py-3 font-quicksand text-sm text-gray-700 max-w-xs truncate">{String(value ?? "-")}</td>;
                    })}
                    <td className="px-4 py-3">
                      {tab === "mensajes" && !row.leido && (
                        <button onClick={() => handleMarcarLeido(row.id)}
                          className="flex items-center gap-1 text-xs text-[#EE6B8D] hover:text-[#C04267] font-quicksand font-medium">
                          <Eye size={14} /> Marcar leído
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
