"use client";
import { ventifyConfig } from "@/lib/ventify";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";

export default function TestApiPage() {
  const [result, setResult] = useState<any>({ success: false, error: 'Cargando...', timestamp: new Date().toISOString() });

  useEffect(() => {
    const fetchApi = async () => {
      try {
        if (!ventifyConfig.apiUrl || !ventifyConfig.accountId || !ventifyConfig.apiKey) {
          setResult({ success: false, error: 'Variables de entorno faltantes', timestamp: new Date().toISOString() });
          return;
        }

        const url = `${ventifyConfig.apiUrl}/api/public/stores/${ventifyConfig.accountId}/products?active=true`;

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': ventifyConfig.apiKey,
          },
          cache: 'no-store',
        });

        if (response.ok) {
          const data = await response.json();
          setResult({ success: true, data, timestamp: new Date().toISOString() });
        } else {
          setResult({ success: false, error: `Error HTTP ${response.status}: ${response.statusText}`, timestamp: new Date().toISOString() });
        }
      } catch (error) {
        setResult({ success: false, error: error instanceof Error ? error.message : 'Error desconocido', timestamp: new Date().toISOString() });
      }
    };

    fetchApi();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft size={20} />
            Volver al inicio
          </Link>
          
          <h1 className="text-4xl font-bold mb-2">
            🔌 Test de API Ventify
          </h1>
          <p className="text-gray-400">
            Visualización de la respuesta cruda de la API para mapeo de datos
          </p>
        </div>

        {/* Configuración */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            ⚙️ Configuración
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">
            <div>
              <span className="text-gray-400">API URL:</span>
              <div className="text-green-400 break-all">{ventifyConfig.apiUrl || '❌ NO CONFIGURADA'}</div>
            </div>
            <div>
              <span className="text-gray-400">Account ID:</span>
              <div className="text-green-400 break-all">
                {ventifyConfig.accountId ? `${ventifyConfig.accountId.slice(0, 20)}...` : '❌ NO CONFIGURADA'}
              </div>
            </div>
            <div>
              <span className="text-gray-400">API Key:</span>
              <div className="text-green-400">
                {ventifyConfig.apiKey ? '✅ Configurada (oculta por seguridad)' : '❌ NO CONFIGURADA'}
              </div>
            </div>
            <div>
              <span className="text-gray-400">Endpoint:</span>
              <div className="text-blue-400">/products</div>
            </div>
          </div>
        </div>

        {/* Estado de la respuesta */}
        <div className={`rounded-2xl p-6 mb-6 border-2 ${
          result.success 
            ? 'bg-green-500/20 border-green-500' 
            : 'bg-red-500/20 border-red-500'
        }`}>
          <div className="flex items-center gap-3 mb-2">
            {result.success ? (
              <>
                <CheckCircle size={24} className="text-green-400" />
                <h2 className="text-2xl font-bold text-green-400">
                  ✅ Respuesta Exitosa
                </h2>
              </>
            ) : (
              <>
                <XCircle size={24} className="text-red-400" />
                <h2 className="text-2xl font-bold text-red-400">
                  ❌ Error en la Petición
                </h2>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <Clock size={16} />
            <span>Timestamp: {result.timestamp}</span>
          </div>

          {!result.success && (
            <div className="mt-4 p-4 bg-black/30 rounded-lg">
              <p className="text-red-300 font-mono text-sm">
                {result.error}
              </p>
            </div>
          )}
        </div>

        {/* Metadatos de la respuesta */}
        {result.success && result.data && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20">
            <h2 className="text-xl font-bold mb-4">📊 Metadatos</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-purple-500/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-purple-300">
                  {Array.isArray(result.data) ? result.data.length : 'N/A'}
                </div>
                <div className="text-sm text-gray-400 mt-1">Productos</div>
              </div>
              <div className="bg-blue-500/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-blue-300">
                  {typeof result.data}
                </div>
                <div className="text-sm text-gray-400 mt-1">Tipo de datos</div>
              </div>
              <div className="bg-green-500/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-green-300">
                  {Array.isArray(result.data) ? '✓' : '✗'}
                </div>
                <div className="text-sm text-gray-400 mt-1">Es Array</div>
              </div>
              <div className="bg-yellow-500/20 rounded-lg p-4">
                <div className="text-3xl font-bold text-yellow-300">
                  {result.data ? Object.keys(result.data).length : 0}
                </div>
                <div className="text-sm text-gray-400 mt-1">Propiedades</div>
              </div>
            </div>
          </div>
        )}

        {/* Respuesta JSON cruda */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">📄 Respuesta JSON Completa</h2>
            <button 
              onClick={() => navigator.clipboard.writeText(JSON.stringify(result, null, 2))}
              className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              📋 Copiar JSON
            </button>
          </div>
          
          <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto text-sm font-mono border border-gray-800">
            <code className="text-green-400">
              {JSON.stringify(result, null, 2)}
            </code>
          </pre>
        </div>

        {/* Estructura de primer producto (si existe) */}
        {result.success && Array.isArray(result.data) && result.data.length > 0 && (
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mt-6 border border-white/20">
            <h2 className="text-xl font-bold mb-4">
              🔍 Estructura del Primer Producto
            </h2>
            <p className="text-gray-400 mb-4 text-sm">
              Analiza esta estructura para mapear correctamente a tu interfaz
            </p>
            <pre className="bg-black/50 p-6 rounded-lg overflow-x-auto text-sm font-mono border border-gray-800">
              <code className="text-cyan-400">
                {JSON.stringify(result.data[0], null, 2)}
              </code>
            </pre>
            
            <div className="mt-4 p-4 bg-blue-500/20 rounded-lg border border-blue-500/50">
              <h3 className="font-bold mb-2 text-blue-300">💡 Campos detectados:</h3>
              <div className="flex flex-wrap gap-2">
                {Object.keys(result.data[0]).map((key) => (
                  <span 
                    key={key}
                    className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full text-xs font-mono"
                  >
                    {key}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer con instrucciones */}
        <div className="mt-8 p-6 bg-purple-500/20 rounded-2xl border border-purple-500/50">
          <h3 className="font-bold text-lg mb-2">📝 Siguiente Paso:</h3>
          <p className="text-gray-300 text-sm">
            Una vez que veas la estructura de datos, actualiza el archivo <code className="bg-black/30 px-2 py-1 rounded">src/lib/data.ts</code> 
            para mapear los campos de Ventify a tu interfaz Product.
          </p>
        </div>
      </div>
    </div>
  );
}
