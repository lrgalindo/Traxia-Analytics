import { useEffect, useState } from 'react'
import { actions } from '../api/client'
import { PageHeader } from '../components/PageHeader'
import { Card, StatusBadge, MonoBadge } from '../components/Card'
import type { ActionRule, ActionChannel, ActionLogEntry, RuleType, ChannelType } from '../types'

type Tab = 'rules' | 'channels' | 'log'

const RULE_TYPE_LABELS: Record<RuleType, string> = {
  threshold: 'Umbral de ocupación',
  sop_staff_absent_checkout: 'SOP — Caja sin personal',
  sop_late_opening: 'SOP — Apertura tardía',
  sop_unattended_customer: 'SOP — Cliente sin atención',
}

const CHANNEL_TYPE_LABELS: Record<ChannelType, string> = {
  slack: 'Slack',
  telegram: 'Telegram',
  email: 'Correo',
  whatsapp: 'WhatsApp',
}

const CHANNEL_ICONS: Record<ChannelType, string> = {
  slack: '💬',
  telegram: '✈️',
  email: '✉️',
  whatsapp: '📱',
}

const CHANNEL_DESCRIPTIONS: Record<ChannelType, string> = {
  slack: 'Webhook entrante a un canal de Slack',
  telegram: 'Bot API con chat_id configurado',
  email: 'SMTP directo a buzón del equipo',
  whatsapp: 'Meta Cloud API — costo por conversación',
}

const FALLBACK_RULES: ActionRule[] = [
  { id: '1', rule_type: 'threshold', name: 'Cola > 8 personas en caja', zone_id: 'z1', threshold_value: 8, window_minutes: 5, enabled: true, created_at: '2026-07-15T10:00:00Z' },
  { id: '2', rule_type: 'sop_staff_absent_checkout', name: 'Caja sin personal — apertura', zone_id: 'z2', threshold_value: undefined, window_minutes: 3, enabled: true, created_at: '2026-07-10T08:00:00Z' },
  { id: '3', rule_type: 'sop_unattended_customer', name: 'Cliente sin atención > 4 min', zone_id: 'z3', threshold_value: 4, window_minutes: 4, enabled: false, created_at: '2026-07-01T09:00:00Z' },
]

const FALLBACK_CHANNELS: ActionChannel[] = [
  { id: '1', channel_type: 'whatsapp', name: 'WhatsApp — Gerencia', enabled: true, whatsapp_cost_per_conversation_usd: 0.063, created_at: '2026-06-01T00:00:00Z' },
  { id: '2', channel_type: 'email', name: 'Email — Operaciones', enabled: true, created_at: '2026-06-01T00:00:00Z' },
  { id: '3', channel_type: 'slack', name: 'Slack #alertas-ops', enabled: true, created_at: '2026-06-15T00:00:00Z' },
]

const FALLBACK_LOG: ActionLogEntry[] = [
  { id: '1', rule_id: '1', channel_type: 'whatsapp', status: 'sent', payload_summary: 'Cola superó 8 personas en Zona de Cajas (13:07)', meta_cost_usd: 0.063, triggered_at: '2026-08-02T13:07:00Z' },
  { id: '2', rule_id: '2', channel_type: 'email', status: 'sent', payload_summary: 'Caja sin personal detectada — Sucursal Norte (12:45)', meta_cost_usd: undefined, triggered_at: '2026-08-02T12:45:00Z' },
  { id: '3', rule_id: '1', channel_type: 'whatsapp', status: 'failed', payload_summary: 'Cola superó umbral — error de entrega Meta API', meta_cost_usd: undefined, triggered_at: '2026-08-01T16:22:00Z' },
  { id: '4', rule_id: '3', channel_type: 'slack', status: 'sent', payload_summary: 'Cliente sin atención 4 min en Servicio al Cliente', meta_cost_usd: undefined, triggered_at: '2026-08-01T11:03:00Z' },
]

const inp: React.CSSProperties = {
  width: '100%', height: 40, border: '1px solid var(--border)', borderRadius: 8,
  padding: '0 12px', fontSize: 13.5, color: 'var(--on-surface)', background: '#FBFAFE',
  outline: 'none', boxSizing: 'border-box',
}

export function Actions() {
  const [tab, setTab] = useState<Tab>('rules')
  const [rules, setRules] = useState<ActionRule[]>(FALLBACK_RULES)
  const [channels, setChannels] = useState<ActionChannel[]>(FALLBACK_CHANNELS)
  const [log, setLog] = useState<ActionLogEntry[]>(FALLBACK_LOG)

  const [ruleType, setRuleType] = useState<RuleType>('threshold')
  const [ruleName, setRuleName] = useState('')
  const [ruleThreshold, setRuleThreshold] = useState('')
  const [ruleWindow, setRuleWindow] = useState('')
  const [ruleSubmitting, setRuleSubmitting] = useState(false)
  const [ruleMsg, setRuleMsg] = useState('')
  const [showRuleForm, setShowRuleForm] = useState(false)

  const [chType, setChType] = useState<ChannelType>('slack')
  const [chName, setChName] = useState('')
  const [chConfig, setChConfig] = useState('')
  const [chWaCost, setChWaCost] = useState('')
  const [chSubmitting, setChSubmitting] = useState(false)
  const [chMsg, setChMsg] = useState('')
  const [showChForm, setShowChForm] = useState(false)

  useEffect(() => {
    Promise.all([actions.listRules(), actions.listChannels(), actions.listLog()])
      .then(([r, c, l]) => { if (r.length) setRules(r); if (c.length) setChannels(c); if (l.length) setLog(l) })
      .catch(() => {})
  }, [])

  async function handleCreateRule(e: React.FormEvent) {
    e.preventDefault()
    if (!ruleName.trim()) return
    setRuleSubmitting(true); setRuleMsg('')
    try {
      const payload: Parameters<typeof actions.createRule>[0] = { rule_type: ruleType, name: ruleName.trim() }
      if (ruleType === 'threshold') {
        if (ruleThreshold) payload.threshold_value = Number(ruleThreshold)
        if (ruleWindow) payload.window_minutes = Number(ruleWindow)
      }
      const r = await actions.createRule(payload)
      setRules(prev => [...prev, r])
      setRuleMsg(`Regla "${r.name}" creada.`)
      setRuleName(''); setRuleThreshold(''); setRuleWindow(''); setShowRuleForm(false)
    } catch (e: unknown) {
      setRuleMsg(`Error: ${e instanceof Error ? e.message : String(e)}`)
    } finally { setRuleSubmitting(false) }
  }

  async function handleDeleteRule(id: string, name: string) {
    if (!confirm(`¿Eliminar regla "${name}"?`)) return
    try { await actions.deleteRule(id); setRules(prev => prev.filter(r => r.id !== id)) }
    catch (e: unknown) { setRuleMsg(`Error: ${e instanceof Error ? e.message : String(e)}`) }
  }

  async function handleCreateChannel(e: React.FormEvent) {
    e.preventDefault()
    if (!chName.trim() || !chConfig.trim()) return
    if (chType === 'whatsapp' && !chWaCost.trim()) return
    setChSubmitting(true); setChMsg('')
    try {
      let config: Record<string, unknown>
      try { config = JSON.parse(chConfig) } catch { setChMsg('Error: la configuración debe ser JSON válido.'); setChSubmitting(false); return }
      const payload: Parameters<typeof actions.createChannel>[0] = { channel_type: chType, name: chName.trim(), config }
      if (chType === 'whatsapp') payload.whatsapp_cost_per_conversation_usd = parseFloat(chWaCost)
      const c = await actions.createChannel(payload)
      setChannels(prev => [...prev, c])
      setChMsg(`Canal "${c.name}" creado.`)
      setChName(''); setChConfig(''); setChWaCost(''); setShowChForm(false)
    } catch (e: unknown) { setChMsg(`Error: ${e instanceof Error ? e.message : String(e)}`) }
    finally { setChSubmitting(false) }
  }

  async function handleDeleteChannel(id: string, name: string) {
    if (!confirm(`¿Eliminar canal "${name}"?`)) return
    try { await actions.deleteChannel(id); setChannels(prev => prev.filter(c => c.id !== id)) }
    catch (e: unknown) { setChMsg(`Error: ${e instanceof Error ? e.message : String(e)}`) }
  }

  const TAB_LABELS: Record<Tab, string> = { rules: 'Reglas', channels: 'Canales', log: 'Log' }

  const activeRules = rules.filter(r => r.enabled).length
  const totalDispatches = log.length
  const failedDispatches = log.filter(l => l.status === 'failed').length

  return (
    <div className="tx-page">
      <PageHeader
        eyebrow="ADMINISTRACIÓN / AUTOMATIZACIÓN"
        title="Motor de Acciones"
        description="Configura alertas automáticas y los canales por los que notificas a tu equipo."
        action={
          <button
            onClick={() => tab === 'rules' ? setShowRuleForm(v => !v) : setShowChForm(v => !v)}
            style={{ height: 38, padding: '0 16px', border: 0, background: 'var(--primary)', color: '#fff', borderRadius: 9, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, boxShadow: '0 4px 14px rgba(91,52,242,.22)' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            {tab === 'rules' ? 'Nueva regla' : tab === 'channels' ? 'Nuevo canal' : ''}
          </button>
        }
      />

      {/* KPI strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 14, marginBottom: 20 }}>
        {[
          { label: 'REGLAS ACTIVAS', value: activeRules },
          { label: 'CANALES CONFIGURADOS', value: channels.length },
          { label: 'ENVÍOS (ÚLTIMOS 7 DÍAS)', value: totalDispatches, sub: failedDispatches > 0 ? `${failedDispatches} fallidos` : undefined },
        ].map(k => (
          <Card key={k.label}>
            <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.11em', color: 'var(--mono-muted)', marginBottom: 10 }}>{k.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 600, color: 'var(--ink)' }}>{k.value}</span>
              {k.sub && <span style={{ fontSize: 12, color: 'var(--error)', fontWeight: 500 }}>{k.sub}</span>}
            </div>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20 }}>
        {(['rules', 'channels', 'log'] as Tab[]).map(t => {
          const on = tab === t
          return (
            <button
              key={t}
              data-testid={`actions-tab-${t}`}
              onClick={() => setTab(t)}
              style={{
                height: 36, padding: '0 18px', border: `1px solid ${on ? 'var(--primary-border)' : 'var(--border)'}`,
                borderRadius: 999, fontFamily: 'inherit', fontSize: 13, fontWeight: on ? 600 : 500,
                cursor: 'pointer', background: on ? 'var(--primary-bg)' : 'var(--surface)',
                color: on ? 'var(--primary-deeper)' : 'var(--muted)', transition: 'all .15s',
              }}
            >
              {TAB_LABELS[t]}
            </button>
          )
        })}
      </div>

      {/* ── Reglas tab ── */}
      {tab === 'rules' && (
        <div>
          {showRuleForm && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--primary-border)', borderRadius: 14, padding: 22, boxShadow: '0 1px 2px rgba(14,9,37,.04)', marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: '0 0 16px' }}>Nueva regla de alerta</h2>
              <form onSubmit={handleCreateRule}>
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8 }}>Tipo de regla</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {(Object.keys(RULE_TYPE_LABELS) as RuleType[]).map(rt => {
                      const on = ruleType === rt
                      return (
                        <button key={rt} type="button" onClick={() => setRuleType(rt)} style={{ border: `1px solid ${on ? 'var(--primary-border)' : 'var(--border)'}`, borderRadius: 8, padding: '7px 13px', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', background: on ? 'var(--primary-bg)' : 'var(--surface)', color: on ? 'var(--primary-deeper)' : 'var(--muted)' }}>
                          {RULE_TYPE_LABELS[rt]}
                        </button>
                      )
                    })}
                  </div>
                  <input type="hidden" data-testid="rule-type-select" value={ruleType} readOnly />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: ruleType === 'threshold' ? '1fr 1fr 1fr' : '1fr', gap: 14, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>Nombre de la regla</label>
                    <input data-testid="rule-name-input" type="text" placeholder="Ej. Alerta cola > 8 personas" value={ruleName} onChange={e => setRuleName(e.target.value)} style={inp} required />
                  </div>
                  {ruleType === 'threshold' && (
                    <>
                      <div>
                        <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>Umbral (personas)</label>
                        <input data-testid="rule-threshold-input" type="number" min={1} placeholder="Ej. 8" value={ruleThreshold} onChange={e => setRuleThreshold(e.target.value)} style={inp} />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>Ventana (min)</label>
                        <input data-testid="rule-window-input" type="number" min={1} placeholder="Ej. 5" value={ruleWindow} onChange={e => setRuleWindow(e.target.value)} style={inp} />
                      </div>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', gap: 10 }}>
                  <button type="submit" data-testid="rule-submit-btn" disabled={ruleSubmitting} style={{ height: 38, padding: '0 18px', border: 0, background: ruleSubmitting ? 'var(--primary-border)' : 'var(--primary)', color: '#fff', borderRadius: 9, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
                    {ruleSubmitting ? 'Creando…' : 'Guardar regla'}
                  </button>
                  <button type="button" onClick={() => setShowRuleForm(false)} style={{ height: 38, padding: '0 18px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--on-surface)', borderRadius: 9, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }}>Cancelar</button>
                </div>
                {ruleMsg && <p style={{ marginTop: 10, fontSize: 13, color: ruleMsg.startsWith('Error') ? 'var(--error)' : 'var(--success)' }}>{ruleMsg}</p>}
              </form>
            </div>
          )}

          {rules.length === 0 ? (
            <Card><p style={{ color: 'var(--mono-muted)', fontSize: 14 }}>Sin reglas configuradas. Crea la primera.</p></Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {rules.map(r => (
                <div key={r.id} data-testid="rule-row" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 1px 2px rgba(14,9,37,.03)' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: r.enabled ? 'var(--primary-bg)' : 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={r.enabled ? 'var(--primary)' : 'var(--mono-muted)'} strokeWidth="2" strokeLinecap="round"><path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', marginBottom: 3 }}>{r.name}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <MonoBadge label={RULE_TYPE_LABELS[r.rule_type]} />
                      {r.threshold_value != null && <span style={{ fontSize: 12, color: 'var(--muted)' }}>umbral: {r.threshold_value}</span>}
                      {r.window_minutes != null && <span style={{ fontSize: 12, color: 'var(--muted)' }}>{r.window_minutes} min</span>}
                    </div>
                  </div>
                  <StatusBadge status={r.enabled ? 'success' : 'neutral'} label={r.enabled ? 'Activa' : 'Pausada'} />
                  <button data-testid="rule-delete-btn" onClick={() => handleDeleteRule(r.id, r.name)} style={{ height: 32, padding: '0 12px', border: '1px solid #FECACA', background: '#FEF2F2', borderRadius: 7, fontFamily: 'inherit', fontSize: 12, color: 'var(--error)', cursor: 'pointer' }}>Eliminar</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Canales tab ── */}
      {tab === 'channels' && (
        <div>
          {/* Channel type selector cards */}
          {showChForm && (
            <div style={{ background: 'var(--surface)', border: '1px solid var(--primary-border)', borderRadius: 14, padding: 22, boxShadow: '0 1px 2px rgba(14,9,37,.04)', marginBottom: 16 }}>
              <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: '0 0 16px' }}>Nuevo canal de notificación</h2>
              <form onSubmit={handleCreateChannel}>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8 }}>Tipo de canal</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10, marginBottom: 16 }}>
                  {(['whatsapp', 'email', 'slack', 'telegram'] as ChannelType[]).map(ct => {
                    const on = chType === ct
                    return (
                      <button key={ct} type="button" data-testid="channel-type-select" onClick={() => setChType(ct)} style={{ border: `1.5px solid ${on ? 'var(--primary)' : 'var(--border)'}`, borderRadius: 12, padding: '14px 10px', fontFamily: 'inherit', cursor: 'pointer', background: on ? 'var(--primary-bg)' : 'var(--surface)', textAlign: 'center' }}>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>{CHANNEL_ICONS[ct]}</div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: on ? 'var(--primary-deeper)' : 'var(--on-surface)', marginBottom: 3 }}>{CHANNEL_TYPE_LABELS[ct]}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4 }}>{CHANNEL_DESCRIPTIONS[ct]}</div>
                        {ct === 'whatsapp' && <div style={{ marginTop: 6, display: 'inline-block', background: '#FEF3C7', color: '#92400E', borderRadius: 99, padding: '2px 8px', fontSize: 10.5, fontWeight: 600 }}>Costo por conv.</div>}
                      </button>
                    )
                  })}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>Nombre del canal</label>
                    <input data-testid="channel-name-input" type="text" placeholder="Ej. WhatsApp Gerencia" value={chName} onChange={e => setChName(e.target.value)} style={inp} required />
                  </div>
                  {chType === 'whatsapp' && (
                    <div>
                      <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>Costo / conversación (USD)</label>
                      <input data-testid="whatsapp-cost-input" type="number" step="0.0001" min="0" placeholder="Ej. 0.0630" value={chWaCost} onChange={e => setChWaCost(e.target.value)} style={inp} required={chType === 'whatsapp'} />
                    </div>
                  )}
                </div>

                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>Configuración (JSON)</label>
                <textarea
                  data-testid="channel-config-input"
                  value={chConfig}
                  onChange={e => setChConfig(e.target.value)}
                  placeholder={
                    chType === 'slack'    ? '{"webhook_url":"https://hooks.slack.com/..."}' :
                    chType === 'telegram' ? '{"bot_token":"...","chat_id":"..."}' :
                    chType === 'email'    ? '{"smtp_host":"smtp.example.com","to":"ops@co.com"}' :
                                           '{"phone_number_id":"...","access_token":"..."}'
                  }
                  required
                  rows={3}
                  style={{ ...inp, height: 'auto', padding: '10px 12px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, lineHeight: 1.6 }}
                />

                {chType === 'whatsapp' && (
                  <div data-testid="whatsapp-cost-section" style={{ background: '#FFFBEB', border: '1px solid #FDE68A', borderRadius: 10, padding: '12px 14px', marginTop: 12, display: 'flex', gap: 10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0, marginTop: 1 }}><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    <p style={{ fontSize: 12.5, color: '#92400E', margin: 0 }}><strong>WhatsApp tiene costo por conversación.</strong> Meta cobra una tarifa que varía por región. Declara el costo antes de activar.</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                  <button type="submit" data-testid="channel-submit-btn" disabled={chSubmitting || (chType === 'whatsapp' && !chWaCost.trim())} style={{ height: 38, padding: '0 18px', border: 0, background: (chSubmitting || (chType === 'whatsapp' && !chWaCost.trim())) ? 'var(--primary-border)' : 'var(--primary)', color: '#fff', borderRadius: 9, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
                    {chSubmitting ? 'Creando…' : 'Activar canal'}
                  </button>
                  <button type="button" onClick={() => setShowChForm(false)} style={{ height: 38, padding: '0 18px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--on-surface)', borderRadius: 9, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }}>Cancelar</button>
                </div>
                {chMsg && <p style={{ marginTop: 10, fontSize: 13, color: chMsg.startsWith('Error') ? 'var(--error)' : 'var(--success)' }}>{chMsg}</p>}
              </form>
            </div>
          )}

          {channels.length === 0 ? (
            <Card><p style={{ color: 'var(--mono-muted)', fontSize: 14 }}>Sin canales configurados. Agrega el primero.</p></Card>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 12 }}>
              {channels.map(c => (
                <div key={c.id} data-testid="channel-row" style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 18, boxShadow: '0 1px 2px rgba(14,9,37,.03)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--primary-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>
                      {CHANNEL_ICONS[c.channel_type]}
                    </div>
                    <StatusBadge status={c.enabled ? 'success' : 'neutral'} label={c.enabled ? 'Activo' : 'Pausado'} />
                  </div>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{c.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', marginBottom: c.whatsapp_cost_per_conversation_usd != null ? 10 : 14 }}>
                    {CHANNEL_DESCRIPTIONS[c.channel_type]}
                  </div>
                  {c.whatsapp_cost_per_conversation_usd != null && (
                    <div style={{ marginBottom: 14, display: 'inline-block', background: '#FEF3C7', color: '#92400E', borderRadius: 99, padding: '3px 10px', fontSize: 11.5, fontWeight: 600 }}>
                      ${c.whatsapp_cost_per_conversation_usd.toFixed(4)} / conv
                    </div>
                  )}
                  <button data-testid="channel-delete-btn" onClick={() => handleDeleteChannel(c.id, c.name)} style={{ width: '100%', height: 32, border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 7, fontFamily: 'inherit', fontSize: 12.5, color: 'var(--muted)', cursor: 'pointer' }}>Eliminar canal</button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── Log tab ── */}
      {tab === 'log' && (
        <Card>
          {log.length === 0 ? (
            <p style={{ color: 'var(--mono-muted)', fontSize: 14 }}>Sin acciones registradas todavía.</p>
          ) : (
            <table data-testid="actions-log-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['FECHA', 'CANAL', 'ESTADO', 'RESUMEN', 'COSTO'].map(h => (
                    <th key={h} style={{ textAlign: 'left', padding: '12px 14px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.08em', color: 'var(--mono-muted)', fontWeight: 500 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {log.map(entry => (
                  <tr key={entry.id} data-testid="log-row" style={{ borderBottom: '1px solid var(--border-soft)' }}>
                    <td style={{ padding: '13px 14px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                      {new Date(entry.triggered_at).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
                    </td>
                    <td style={{ padding: '13px 14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                        <span style={{ fontSize: 15 }}>{CHANNEL_ICONS[entry.channel_type]}</span>
                        <span style={{ fontSize: 13, color: 'var(--on-surface)' }}>{CHANNEL_TYPE_LABELS[entry.channel_type]}</span>
                      </div>
                    </td>
                    <td style={{ padding: '13px 14px' }}>
                      <StatusBadge status={entry.status === 'sent' ? 'success' : 'error'} label={entry.status === 'sent' ? 'Enviado' : 'Fallido'} />
                    </td>
                    <td style={{ padding: '13px 14px', fontSize: 13, color: 'var(--muted)', maxWidth: 340 }}>{entry.payload_summary}</td>
                    <td style={{ padding: '13px 14px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 12, color: entry.meta_cost_usd != null ? 'var(--on-surface)' : 'var(--mono-muted)' }}>
                      {entry.meta_cost_usd != null ? `$${entry.meta_cost_usd.toFixed(4)}` : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}
    </div>
  )
}
