'use client'

import { useState } from 'react'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

type Status = 'idle' | 'loading' | 'success' | 'error'

export default function DemoForm() {
  const [nombre, setNombre] = useState('')
  const [empresa, setEmpresa] = useState('')
  const [email, setEmail] = useState('')
  const [vertical, setVertical] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [status, setStatus] = useState<Status>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const resp = await fetch(`${API_BASE}/v1/contact/demo-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: nombre.trim(),
          email: email.trim(),
          company: empresa.trim(),
          what_to_solve: vertical ? `[${vertical}] ${mensaje.trim()}` : mensaje.trim(),
        }),
      })
      if (resp.ok) {
        setStatus('success')
        setNombre(''); setEmpresa(''); setEmail(''); setVertical(''); setMensaje('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  const inp = 'w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-[14px] text-on-surface placeholder:text-slate-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all'

  if (status === 'success') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center">
        <div className="w-14 h-14 bg-emerald-50 border border-emerald-200 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="material-symbols-outlined text-emerald-500 text-[28px]">check_circle</span>
        </div>
        <h3 className="text-[20px] font-bold text-on-surface mb-2">¡Solicitud enviada!</h3>
        <p className="text-[14px] text-on-surface-variant">Nos pondremos en contacto en menos de 24 horas.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col gap-5 shadow-card">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="block text-[13px] font-semibold text-on-surface mb-1.5">Nombre</label>
          <input id="nombre" type="text" required placeholder="Tu nombre"
            value={nombre} onChange={e => setNombre(e.target.value)} className={inp} />
        </div>
        <div>
          <label htmlFor="empresa" className="block text-[13px] font-semibold text-on-surface mb-1.5">Empresa</label>
          <input id="empresa" type="text" required placeholder="Tu empresa"
            value={empresa} onChange={e => setEmpresa(e.target.value)} className={inp} />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-[13px] font-semibold text-on-surface mb-1.5">Email corporativo</label>
        <input id="email" type="email" required placeholder="tu@empresa.com"
          value={email} onChange={e => setEmail(e.target.value)} className={inp} />
      </div>
      <div>
        <label htmlFor="vertical" className="block text-[13px] font-semibold text-on-surface mb-1.5">Vertical / Industria</label>
        <select id="vertical" value={vertical} onChange={e => setVertical(e.target.value)} className={inp}>
          <option value="">Selecciona tu industria</option>
          <option value="retail">Retail</option>
          <option value="logistica">Logística</option>
          <option value="banca">Banca</option>
          <option value="manufactura">Manufactura</option>
          <option value="hospitales">Hospitales</option>
          <option value="concesionarias">Concesionarias</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <div>
        <label htmlFor="mensaje" className="block text-[13px] font-semibold text-on-surface mb-1.5">¿Qué quieres resolver?</label>
        <textarea id="mensaje" rows={3} required placeholder="Cuéntanos sobre tu operación..."
          value={mensaje} onChange={e => setMensaje(e.target.value)}
          className={`${inp} resize-none`} />
      </div>
      {status === 'error' && (
        <p className="text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos directamente.
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-gradient w-full py-3.5 rounded-xl text-[15px] disabled:opacity-60 disabled:cursor-not-allowed shadow-blue"
      >
        {status === 'loading' ? 'Enviando…' : 'Agendar Demo Gratuita'}
      </button>
      <p className="text-center text-[12px] text-on-surface-variant/60">
        Sin compromiso. Respuesta en menos de 24 horas.
      </p>
    </form>
  )
}
