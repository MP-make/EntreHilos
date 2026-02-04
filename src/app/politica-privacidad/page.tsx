import Link from "next/link";
import { Shield, Lock, Eye, Mail, FileText, Calendar } from "lucide-react";

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#5E548E] to-[#9F86C0] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield size={64} className="mx-auto mb-6" />
          <h1 className="font-playfair text-4xl md:text-5xl font-bold mb-4">
            Política de Privacidad
          </h1>
          <p className="font-lato text-lg font-light">
            Última actualización: 4 de febrero de 2026
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="space-y-12">
          {/* Introducción */}
          <div>
            <p className="font-lato text-gray-700 leading-relaxed mb-4">
              En <strong className="text-[#5E548E]">Entre Hilos</strong>, respetamos y protegemos la privacidad de nuestros clientes. 
              Esta política explica cómo recopilamos, usamos y protegemos tu información personal cuando visitas nuestro 
              sitio web o realizas una compra.
            </p>
          </div>

          {/* Sección 1 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#9F86C0]/10 rounded-full flex items-center justify-center">
                <FileText className="text-[#9F86C0]" size={24} />
              </div>
              <h2 className="font-playfair text-2xl font-semibold text-[#5E548E]">
                1. Información que Recopilamos
              </h2>
            </div>
            <div className="pl-15 space-y-3 font-lato text-gray-700 leading-relaxed">
              <p><strong>Información personal:</strong> Nombre, dirección de entrega, número de teléfono, correo electrónico.</p>
              <p><strong>Información de pedidos:</strong> Detalles de productos comprados, preferencias de personalización.</p>
              <p><strong>Información de pago:</strong> Los pagos se procesan mediante Yape, Plin o transferencia bancaria. No almacenamos datos bancarios en nuestro sitio.</p>
              <p><strong>Información técnica:</strong> Dirección IP, tipo de navegador, páginas visitadas (para mejorar la experiencia del usuario).</p>
            </div>
          </div>

          {/* Sección 2 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#9F86C0]/10 rounded-full flex items-center justify-center">
                <Eye className="text-[#9F86C0]" size={24} />
              </div>
              <h2 className="font-playfair text-2xl font-semibold text-[#5E548E]">
                2. Cómo Usamos tu Información
              </h2>
            </div>
            <div className="pl-15 space-y-3 font-lato text-gray-700 leading-relaxed">
              <p>✓ Procesar y entregar tus pedidos</p>
              <p>✓ Comunicarnos contigo sobre el estado de tu compra</p>
              <p>✓ Personalizar productos según tus especificaciones</p>
              <p>✓ Mejorar nuestros productos y servicios</p>
              <p>✓ Enviarte promociones especiales (solo si aceptas recibir comunicaciones)</p>
            </div>
          </div>

          {/* Sección 3 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#9F86C0]/10 rounded-full flex items-center justify-center">
                <Lock className="text-[#9F86C0]" size={24} />
              </div>
              <h2 className="font-playfair text-2xl font-semibold text-[#5E548E]">
                3. Protección de Datos
              </h2>
            </div>
            <div className="pl-15 font-lato text-gray-700 leading-relaxed">
              <p className="mb-3">
                Implementamos medidas de seguridad para proteger tu información personal:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Conexión SSL/HTTPS encriptada</li>
                <li>Acceso restringido a información personal (solo personal autorizado)</li>
                <li>No compartimos tu información con terceros sin tu consentimiento</li>
                <li>Almacenamiento seguro de datos</li>
              </ul>
            </div>
          </div>

          {/* Sección 4 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#9F86C0]/10 rounded-full flex items-center justify-center">
                <Mail className="text-[#9F86C0]" size={24} />
              </div>
              <h2 className="font-playfair text-2xl font-semibold text-[#5E548E]">
                4. Tus Derechos
              </h2>
            </div>
            <div className="pl-15 font-lato text-gray-700 leading-relaxed">
              <p className="mb-3">Como cliente, tienes derecho a:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Acceder</strong> a tu información personal almacenada</li>
                <li><strong>Rectificar</strong> datos incorrectos o incompletos</li>
                <li><strong>Eliminar</strong> tu información (derecho al olvido)</li>
                <li><strong>Oponerte</strong> al procesamiento de tus datos</li>
                <li><strong>Revocar</strong> el consentimiento para recibir comunicaciones</li>
              </ul>
              <p className="mt-4">
                Para ejercer estos derechos, contáctanos por WhatsApp: <strong>927 005 798</strong>
              </p>
            </div>
          </div>

          {/* Sección 5 */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#9F86C0]/10 rounded-full flex items-center justify-center">
                <Calendar className="text-[#9F86C0]" size={24} />
              </div>
              <h2 className="font-playfair text-2xl font-semibold text-[#5E548E]">
                5. Cookies y Tecnologías Similares
              </h2>
            </div>
            <div className="pl-15 font-lato text-gray-700 leading-relaxed">
              <p>
                Nuestro sitio puede utilizar cookies para mejorar tu experiencia de navegación. Las cookies son 
                pequeños archivos de texto que se almacenan en tu dispositivo y nos ayudan a recordar tus preferencias. 
                Puedes configurar tu navegador para rechazar cookies, pero esto puede afectar algunas funcionalidades del sitio.
              </p>
            </div>
          </div>

          {/* Sección 6 */}
          <div>
            <h2 className="font-playfair text-2xl font-semibold text-[#5E548E] mb-4">
              6. Cambios a esta Política
            </h2>
            <div className="font-lato text-gray-700 leading-relaxed">
              <p>
                Nos reservamos el derecho de actualizar esta política de privacidad en cualquier momento. 
                Te notificaremos sobre cambios significativos publicando la nueva política en esta página con 
                una fecha de actualización revisada.
              </p>
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-[#FDF4F7] p-8 rounded-2xl border border-[#9F86C0]/20">
            <h2 className="font-playfair text-2xl font-semibold text-[#5E548E] mb-4">
              ¿Preguntas sobre tu Privacidad?
            </h2>
            <p className="font-lato text-gray-700 leading-relaxed mb-6">
              Si tienes alguna pregunta sobre cómo manejamos tu información personal, no dudes en contactarnos:
            </p>
            <div className="space-y-2 font-lato text-gray-700">
              <p><strong>WhatsApp:</strong> 927 005 798</p>
              <p><strong>Instagram:</strong> @entrehiloscrochet.pe</p>
              <p><strong>Ubicación:</strong> Pisco, Perú</p>
            </div>
          </div>
        </div>

        {/* Botón de regreso */}
        <div className="mt-12 text-center">
          <Link 
            href="/"
            className="inline-block font-lato px-8 py-3 bg-[#9F86C0] text-white font-semibold rounded-full hover:bg-[#5E548E] transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </section>
    </div>
  );
}