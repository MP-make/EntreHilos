import Link from "next/link";
import { Shield, Lock } from "lucide-react";

export default function PoliticaPrivacidadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FDF4F7] to-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#5E548E] to-[#9F86C0] text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <Shield size={48} className="sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6" />
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            Política de Privacidad
          </h1>
          <p className="font-lato text-sm sm:text-base md:text-lg font-light">
            Última actualización: Febrero 2026
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
        {/* Introducción */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 mb-8 sm:mb-10">
          <p className="font-lato text-sm sm:text-base text-gray-700 leading-relaxed">
            En <strong>Entre Hilos</strong>, valoramos y respetamos tu privacidad. Esta Política de Privacidad 
            describe cómo recopilamos, usamos y protegemos tu información personal cuando utilizas nuestro sitio web 
            y servicios de comercio electrónico.
          </p>
        </div>

        {/* Secciones */}
        <div className="space-y-6 sm:space-y-8">
          {/* 1. Información que Recopilamos */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#9F86C0] text-white rounded-full flex items-center justify-center font-lato font-bold text-sm sm:text-base">
                1
              </div>
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-[#5E548E]">
                Información que Recopilamos
              </h2>
            </div>
            <ul className="font-lato text-sm sm:text-base text-gray-700 space-y-2 sm:space-y-3 ml-0 sm:ml-14">
              <li className="flex items-start gap-2">
                <span className="text-[#9F86C0] mt-1 flex-shrink-0">•</span>
                <span><strong>Datos de contacto:</strong> Nombre, dirección de correo electrónico, número de teléfono y dirección de envío.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#9F86C0] mt-1 flex-shrink-0">•</span>
                <span><strong>Información de pedidos:</strong> Detalles de tus compras, historial de pedidos y preferencias de productos.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#9F86C0] mt-1 flex-shrink-0">•</span>
                <span><strong>Datos de navegación:</strong> Dirección IP, tipo de navegador, páginas visitadas y tiempo de navegación.</span>
              </li>
            </ul>
          </div>

          {/* 2. Uso de la Información */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#9F86C0] text-white rounded-full flex items-center justify-center font-lato font-bold text-sm sm:text-base">
                2
              </div>
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-[#5E548E]">
                Uso de la Información
              </h2>
            </div>
            <p className="font-lato text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4 ml-0 sm:ml-14">
              Utilizamos tu información personal para:
            </p>
            <ul className="font-lato text-sm sm:text-base text-gray-700 space-y-2 sm:space-y-3 ml-0 sm:ml-14">
              <li className="flex items-start gap-2">
                <span className="text-[#9F86C0] mt-1 flex-shrink-0">✓</span>
                <span>Procesar y entregar tus pedidos de productos crochet personalizados</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#9F86C0] mt-1 flex-shrink-0">✓</span>
                <span>Comunicarnos contigo sobre el estado de tu pedido</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#9F86C0] mt-1 flex-shrink-0">✓</span>
                <span>Mejorar nuestros productos, servicios y experiencia de usuario</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#9F86C0] mt-1 flex-shrink-0">✓</span>
                <span>Enviarte promociones y novedades (solo si has dado tu consentimiento)</span>
              </li>
            </ul>
          </div>

          {/* 3. Protección de Datos */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#9F86C0] text-white rounded-full flex items-center justify-center font-lato font-bold text-sm sm:text-base">
                3
              </div>
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-[#5E548E]">
                Protección de Datos
              </h2>
            </div>
            <p className="font-lato text-sm sm:text-base text-gray-700 leading-relaxed ml-0 sm:ml-14">
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información contra 
              acceso no autorizado, pérdida, destrucción o alteración. Utilizamos encriptación SSL para proteger 
              datos sensibles durante la transmisión y almacenamos información en servidores seguros con acceso restringido.
            </p>
          </div>

          {/* 4. Compartir Información */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#9F86C0] text-white rounded-full flex items-center justify-center font-lato font-bold text-sm sm:text-base">
                4
              </div>
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-[#5E548E]">
                Compartir Información
              </h2>
            </div>
            <p className="font-lato text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4 ml-0 sm:ml-14">
              No vendemos ni alquilamos tu información personal a terceros. Solo compartimos datos con:
            </p>
            <ul className="font-lato text-sm sm:text-base text-gray-700 space-y-2 sm:space-y-3 ml-0 sm:ml-14">
              <li className="flex items-start gap-2">
                <span className="text-[#9F86C0] mt-1 flex-shrink-0">→</span>
                <span><strong>Proveedores de servicios de entrega</strong> para realizar envíos</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#9F86C0] mt-1 flex-shrink-0">→</span>
                <span><strong>Procesadores de pago</strong> para transacciones seguras</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-[#9F86C0] mt-1 flex-shrink-0">→</span>
                <span><strong>Autoridades legales</strong> cuando sea requerido por ley</span>
              </li>
            </ul>
          </div>

          {/* 5. Tus Derechos */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#9F86C0] text-white rounded-full flex items-center justify-center font-lato font-bold text-sm sm:text-base">
                5
              </div>
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-[#5E548E]">
                Tus Derechos
              </h2>
            </div>
            <p className="font-lato text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4 ml-0 sm:ml-14">
              Conforme a la Ley de Protección de Datos Personales (Ley N° 29733) del Perú, tienes derecho a:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ml-0 sm:ml-14">
              <div className="flex items-start gap-2">
                <Lock size={18} className="text-[#9F86C0] mt-1 flex-shrink-0" />
                <span className="font-lato text-sm sm:text-base text-gray-700">Acceder a tus datos personales</span>
              </div>
              <div className="flex items-start gap-2">
                <Lock size={18} className="text-[#9F86C0] mt-1 flex-shrink-0" />
                <span className="font-lato text-sm sm:text-base text-gray-700">Rectificar información incorrecta</span>
              </div>
              <div className="flex items-start gap-2">
                <Lock size={18} className="text-[#9F86C0] mt-1 flex-shrink-0" />
                <span className="font-lato text-sm sm:text-base text-gray-700">Cancelar o eliminar tus datos</span>
              </div>
              <div className="flex items-start gap-2">
                <Lock size={18} className="text-[#9F86C0] mt-1 flex-shrink-0" />
                <span className="font-lato text-sm sm:text-base text-gray-700">Oponerte al tratamiento de datos</span>
              </div>
            </div>
          </div>

          {/* 6. Cookies y Tecnologías Similares */}
          <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
            <div className="flex items-start gap-3 sm:gap-4 mb-4">
              <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-[#9F86C0] text-white rounded-full flex items-center justify-center font-lato font-bold text-sm sm:text-base">
                6
              </div>
              <h2 className="font-playfair text-xl sm:text-2xl font-semibold text-[#5E548E]">
                Cookies y Tecnologías Similares
              </h2>
            </div>
            <p className="font-lato text-sm sm:text-base text-gray-700 leading-relaxed ml-0 sm:ml-14">
              Utilizamos cookies para mejorar tu experiencia de navegación, recordar tus preferencias y analizar 
              el tráfico del sitio. Puedes configurar tu navegador para rechazar cookies, aunque esto puede afectar 
              la funcionalidad del sitio web.
            </p>
          </div>
        </div>

        {/* Contacto */}
        <div className="mt-10 sm:mt-12 bg-gradient-to-r from-[#9F86C0] to-[#5E548E] text-white rounded-2xl p-6 sm:p-8 text-center">
          <h3 className="font-playfair text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">
            ¿Tienes preguntas sobre tu privacidad?
          </h3>
          <p className="font-lato text-sm sm:text-base mb-4 sm:mb-6 font-light">
            Contáctanos por WhatsApp o correo electrónico para ejercer tus derechos o resolver dudas
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a 
              href="https://wa.me/51927005798"
              target="_blank"
              rel="noopener noreferrer"
              className="font-lato px-6 sm:px-8 py-3 bg-white text-[#5E548E] font-semibold rounded-full hover:bg-gray-100 transition-colors text-sm sm:text-base inline-block"
            >
              WhatsApp: 927 005 798
            </a>
            <Link 
              href="/"
              className="font-lato px-6 sm:px-8 py-3 border-2 border-white text-white font-semibold rounded-full hover:bg-white hover:text-[#5E548E] transition-all text-sm sm:text-base inline-block"
            >
              Volver al Inicio
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}