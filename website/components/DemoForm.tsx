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
          what_to_solve: vertical
            ? `[${vertical}] ${mensaje.trim()}`
            : mensaje.trim(),
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

  const inp = 'w-full px-4 py-3 bg-surface-container border border-border-subtle rounded-lg text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary transition-colors'

  if (status === 'success') {
    return (
      <div className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-8 text-center">
        <div className="w-14 h-14 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="material-symbols-outlined text-success text-3xl">check_circle</span>
        </div>
        <h3 className="text-headline-md font-headline-md text-on-surface mb-2">¡Solicitud enviada!</h3>
        <p className="text-body-md text-on-surface-variant">Nos pondremos en contacto en menos de 24 horas.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-surface-container-lowest border border-border-subtle rounded-2xl p-8 flex flex-col gap-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="nombre" className="block text-body-sm font-medium text-on-surface mb-1.5">Nombre</label>
          <input
            id="nombre" type="text" required placeholder="Tu nombre"
            value={nombre} onChange={e => setNombre(e.target.value)}
            className={inp}
          />
        </div>
        <div>
          <label htmlFor="empresa" className="block text-body-sm font-medium text-on-surface mb-1.5">Empresa</label>
          <input
            id="empresa" type="text" required placeholder="Tu empresa"
            value={empresa} onChange={e => setEmpresa(e.target.value)}
            className={inp}
          />
        </div>
      </div>
      <div>
        <label htmlFor="email" className="block text-body-sm font-medium text-on-surface mb-1.5">Email corporativo</label>
        <input
          id="email" type="email" required placeholder="tu@empresa.com"
          value={email} onChange={e => setEmail(e.target.value)}
          className={inp}
        />
      </div>
      <div>
        <label htmlFor="vertical" className="block text-body-sm font-medium text-on-surface mb-1.5">Vertical / Industria</label>
        <select
          id="vertical"
          value={vertical} onChange={e => setVertical(e.target.value)}
          className={inp}
        >
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
        <label htmlFor="mensaje" className="block text-body-sm font-medium text-on-surface mb-1.5">¿Qué quieres resolver?</label>
        <textarea
          id="mensaje" rows={3} required placeholder="Cuéntanos sobre tu operación..."
          value={mensaje} onChange={e => setMensaje(e.target.value)}
          className={`${inp} resize-none`}
        />
      </div>
      {status === 'error' && (
        <p className="text-body-sm text-error bg-error/10 rounded-lg px-4 py-3">
          No pudimos enviar tu solicitud. Intenta de nuevo o escríbenos directamente.
        </p>
      )}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="w-full py-3.5 bg-primary text-on-primary rounded-xl font-medium text-body-md hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {status === 'loading' ? 'Enviando…' : 'Agendar Demo Gratuita'}
      </button>
    </form>
  )
}
