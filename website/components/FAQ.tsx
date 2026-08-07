'use client'

import { useState } from 'react'

const faqs = [
  {
    question: '¿Cuánto tarda la implementación?',
    answer: 'La implementación típica toma entre 1 y 3 días hábiles, dependiendo del número de cámaras y la infraestructura existente.',
  },
  {
    question: '¿Debo reemplazar mis cámaras?',
    answer: 'No. Traxia Analytics es 100% hardware-free. Se integra con tu infraestructura CCTV existente mediante RTSP/ONVIF.',
  },
  {
    question: '¿Son seguros mis datos?',
    answer: 'Sí. Todo el procesamiento de video ocurre en el edge local. Solo metadatos anonimizados se transmiten a la nube. Cumplimos con Zero Biometrics Policy.',
  },
  {
    question: '¿Qué ROI puedo esperar?',
    answer: 'Depende de tu operación. Trabajamos contigo en una estimación basada en tu volumen de cámaras, número de sedes y los módulos que activarás. Agenda una demo y te mostramos el cálculo con datos reales de tu vertical.',
  },
  {
    question: '¿Qué industrias atiende Traxia?',
    answer: 'Retail, Logística, Banca, Manufactura, Hospitales y Concesionarias. Contáctanos para explorar tu vertical específica.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, index) => (
        <div
          key={index}
          className="border border-border-subtle rounded-xl overflow-hidden bg-surface-container-lowest"
        >
          <button
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            className="w-full flex items-center justify-between px-6 py-5 text-left"
          >
            <span className="text-headline-md font-headline-md text-on-surface font-medium">{faq.question}</span>
            <span className="material-symbols-outlined text-on-surface-variant flex-shrink-0 ml-4 transition-transform duration-200" style={{ transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)' }}>
              expand_more
            </span>
          </button>
          {openIndex === index && (
            <div className="px-6 pb-5">
              <p className="text-body-lg text-on-surface-variant">{faq.answer}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
