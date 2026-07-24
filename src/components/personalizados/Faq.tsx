"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "¿Cómo cotizo mi pedido personalizado?",
    a: "Completa el formulario de cotización con tu idea, colores y detalles. Te responderemos por WhatsApp en menos de 24 horas con el presupuesto y tiempo de entrega.",
  },
  {
    q: "¿Cuánto tiempo demora la entrega?",
    a: "Cada pieza es tejida 100% a mano, por lo que el tiempo mínimo es de 7 días hábiles. Dependiendo del diseño y los detalles, puede tomar hasta 15 días.",
  },
  {
    q: "¿Qué materiales usan?",
    a: "Trabajamos con algodón premium (hipoalergénico) y relleno de poliéster siliconado de alta calidad. Todos los materiales son seguros para niños.",
  },
  {
    q: "¿Hacen envíos a todo el Perú?",
    a: "Sí, enviamos a todo el país a través de Olva Courier. El costo de envío se calcula según tu ubicación y se confirma al momento de la cotización.",
  },
  {
    q: "¿Puedo cancelar o modificar mi pedido?",
    a: "Puedes modificar detalles del diseño hasta 48 horas después de realizada la cotización. Cancelaciones solo aplican antes de iniciar el tejido.",
  },
  {
    q: "¿Cómo es el proceso de pago?",
    a: "Solicitamos un adelanto del 50% para iniciar el tejido y el saldo restante al finalizar. Aceptamos Yape, Plin y transferencias bancarias.",
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(null);

  function toggle(i: number) {
    setOpen((prev) => (prev === i ? null : i));
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="font-fredoka text-3xl md:text-4xl font-bold text-[#C04267] mb-3">
            Preguntas frecuentes
          </h2>
          <p className="font-quicksand text-base text-[#6B6B6B]">
            Todo lo que necesitas saber antes de pedir tu diseño
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className={`rounded-xl border transition-all duration-300 ${
                  isOpen
                    ? "border-[#EE6B8D] bg-[#FDF4F7]"
                    : "border-gray-200 bg-white hover:border-[#FDE8EF]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="font-quicksand text-sm font-semibold text-[#4A4A4A]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-[#EE6B8D] shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="font-quicksand text-sm text-[#6B6B6B] px-5 pb-4 leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
