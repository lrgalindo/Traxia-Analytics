import { useState } from 'react'
import { copilot } from '../api/client'
import type { ChatResponse } from '../types'

const SUGGESTED = [
  '¿Por qué cayó la permanencia en la góndola de lácteos?',
  '¿Cuál fue el pico de cola del sábado?',
  '¿Hay quiebres de stock detectados?',
]

const CHAT_HISTORY = [
  { title: '¿Por qué cayó la permanencia en lácteos?', meta: 'hace 2 h · Sucursal Norte', active: true },
  { title: '¿Cuál fue el pico de cola del sábado?', meta: 'ayer · Todas las sedes', active: false },
  { title: 'Compara Sucursal Sur vs. Centro', meta: 'ayer · 2 sedes', active: false },
]

export function Copilot() {
  const [question, setQuestion] = useState('')
  const [response, setResponse] = useState<ChatResponse | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleAsk(q?: string) {
    const text = (q ?? question).trim()
    if (!text) return
    setLoading(true); setError(''); setResponse(null)
    try {
      const res = await copilot.chat(text)
      setResponse(res)
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tx-page" style={{ height: 'calc(100vh - 56px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '250px minmax(0,1fr)', gap: 16, flex: 1, minHeight: 0 }}>

        {/* Sidebar */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: '14px 12px', display: 'flex', flexDirection: 'column', minHeight: 0, boxShadow: '0 1px 2px rgba(14,9,37,.04)' }}>
          <button
            onClick={() => { setQuestion(''); setResponse(null); setError('') }}
            style={{ width: '100%', height: 38, border: 0, background: 'var(--primary)', color: '#fff', borderRadius: 9, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 18 }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Nueva consulta
          </button>

          <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, letterSpacing: '.14em', color: 'var(--mono-muted)', padding: '0 5px 8px' }}>HOY</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto', minHeight: 0 }}>
            {CHAT_HISTORY.map(c => (
              <button key={c.title} style={{ textAlign: 'left', border: 0, borderRadius: 9, padding: '9px 10px', cursor: 'pointer', fontFamily: 'inherit', background: c.active ? 'var(--primary-bg)' : 'transparent' }}>
                <div style={{ fontSize: 12.5, fontWeight: c.active ? 600 : 500, color: 'var(--on-surface)', marginBottom: 2, lineHeight: 1.4 }}>{c.title}</div>
                <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: 'var(--mono-muted)' }}>{c.meta}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden', boxShadow: '0 1px 2px rgba(14,9,37,.04)' }}>
          {/* Header */}
          <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px', borderBottom: '1px solid var(--border)' }}>
            <div style={{ width: 32, height: 32, borderRadius: 9, background: 'linear-gradient(150deg,#7C5BFF,#4C22E0)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 11.5a8 8 0 0 1-11.6 7.1L3 20.5l1.9-6.1A8 8 0 1 1 21 11.5z"/>
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>Copiloto de Traxia</div>
              <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: 'var(--mono-muted)' }}>alcance: todas mis sedes</div>
            </div>
            <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, background: 'var(--primary-bg)', color: 'var(--primary-deeper)', border: '1px solid var(--primary-border)', borderRadius: 6, padding: '5px 9px', flexShrink: 0 }}>Haiku 4.5</span>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 12px', display: 'flex', flexDirection: 'column', gap: 18, minHeight: 0 }}>
            {!response && !loading && !error && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 11.5a8 8 0 0 1-11.6 7.1L3 20.5l1.9-6.1A8 8 0 1 1 21 11.5z"/>
                  </svg>
                </div>
                <p style={{ fontSize: 13.5, color: 'var(--muted)', marginBottom: 20 }}>Pregunta sobre tu operación</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center' }}>
                  {SUGGESTED.map(s => (
                    <button key={s} onClick={() => { setQuestion(s); handleAsk(s) }} style={{ border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 999, padding: '7px 14px', fontSize: 12.5, color: 'var(--on-surface)', cursor: 'pointer' }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {loading && (
              <div style={{ alignSelf: 'flex-start', background: 'var(--bg)', borderRadius: '14px 14px 14px 4px', padding: '13px 16px', fontSize: 14, color: 'var(--muted)', animation: 'tx-pulse 1.5s infinite' }}>
                Analizando…
              </div>
            )}

            {error && (
              <div data-testid="copilot-error" style={{ alignSelf: 'flex-start', background: 'var(--error-bg)', border: '1px solid var(--error-border)', borderRadius: '14px 14px 14px 4px', padding: '13px 16px', fontSize: 14, color: 'var(--error-fg)' }}>
                {error}
              </div>
            )}

            {response && (
              <>
                <div style={{ alignSelf: 'flex-end', maxWidth: '70%', background: 'var(--primary)', color: '#fff', borderRadius: '14px 14px 4px 14px', padding: '13px 16px', fontSize: 14, lineHeight: 1.6 }}>
                  {question}
                </div>
                <div data-testid="copilot-answer" style={{ alignSelf: 'flex-start', maxWidth: '82%', border: '1px solid var(--border)', borderRadius: '14px 14px 14px 4px', padding: '16px 18px', fontSize: 14, lineHeight: 1.68, color: 'var(--on-surface)' }}>
                  <p style={{ margin: '0 0 10px' }}>{response.answer}</p>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: 'var(--mono-muted)' }}>
                    {response.authorized_zone_count} zona{response.authorized_zone_count !== 1 ? 's' : ''} en alcance · {response.model}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Input */}
          <div style={{ flexShrink: 0, padding: '13px 20px 18px', borderTop: '1px solid var(--border)' }}>
            <form onSubmit={e => { e.preventDefault(); handleAsk() }} style={{ display: 'flex', alignItems: 'center', gap: 10, border: '1px solid var(--border)', borderRadius: 12, padding: '9px 12px 9px 15px', background: '#FBFAFE' }}>
              <input
                data-testid="copilot-input"
                value={question}
                onChange={e => setQuestion(e.target.value)}
                placeholder="Pregunta sobre tu operación…"
                maxLength={2000}
                style={{ flex: 1, border: 0, background: 'transparent', outline: 'none', fontFamily: 'inherit', fontSize: 14, color: 'var(--on-surface)' }}
              />
              <button
                type="submit"
                data-testid="copilot-submit"
                disabled={loading || !question.trim()}
                style={{ width: 34, height: 34, flexShrink: 0, border: 0, borderRadius: 9, background: loading || !question.trim() ? 'var(--primary-border)' : 'var(--primary)', display: 'grid', placeItems: 'center', cursor: loading || !question.trim() ? 'not-allowed' : 'pointer' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5"/><path d="m5 12 7-7 7 7"/>
                </svg>
              </button>
            </form>
            <p style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, color: 'var(--mono-muted)', margin: '8px 0 0' }}>
              El Copiloto solo consulta las zonas a las que tu rol tiene acceso.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
