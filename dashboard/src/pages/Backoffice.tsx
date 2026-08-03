import { useEffect, useState } from 'react'
import { backoffice } from '../api/client'
import { PageHeader } from '../components/PageHeader'
import { Card, PrimaryButton, StatusBadge, MonoBadge } from '../components/Card'
import type { UserListItem } from '../types'

const FALLBACK_USERS = [
  { id: '1', name: 'Jorge Ramírez', email: 'jorge.ramirez@retailsa.com', role: 'operator', sedes: 'Sucursal Centro, Sucursal Norte', status: 'active' },
  { id: '2', name: 'Ana Castillo', email: 'ana.castillo@retailsa.com', role: 'operator', sedes: 'Sucursal Sur', status: 'active' },
  { id: '3', name: 'Luis Mejía', email: 'luis.mejia@retailsa.com', role: 'operator', sedes: 'Sucursal Oeste, Sucursal Aeropuerto', status: 'active' },
  { id: '4', name: 'Carla Miranda', email: 'carla.miranda@retailsa.com', role: 'operator', sedes: 'Todas las sedes', status: 'active' },
  { id: '5', name: 'Diego Solís', email: 'diego.solis@retailsa.com', role: 'viewer', sedes: 'Sucursal Centro', status: 'active' },
  { id: '6', name: 'Marta Aguilar', email: 'marta.aguilar@retailsa.com', role: 'viewer', sedes: 'Sucursal Antigua', status: 'pending' },
]

const ZONES = ['Sucursal Centro', 'Sucursal Norte', 'Sucursal Sur', 'Sucursal Oeste', 'Sucursal Aeropuerto', 'Sucursal Antigua', 'Centro de Distribución']

export function Backoffice() {
  const [users, setUsers] = useState<typeof FALLBACK_USERS>(FALLBACK_USERS)
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmail, setNewEmail] = useState('')
  const [newRole, setNewRole] = useState<'operator' | 'viewer'>('operator')
  const [selectedSedes, setSelectedSedes] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    backoffice.listUsers().then(us => {
      if (us.length) setUsers(us.map(u => ({ id: u.id, name: u.email, email: u.email, role: u.role, sedes: '—', status: u.status })))
    }).catch(() => {})
  }, [])

  function toggleSede(s: string) {
    setSelectedSedes(prev => { const n = new Set(prev); n.has(s) ? n.delete(s) : n.add(s); return n })
  }

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 600))
    setUsers(prev => [...prev, { id: String(Date.now()), name: newName, email: newEmail, role: newRole, sedes: Array.from(selectedSedes).join(', ') || '—', status: 'pending' }])
    setNewName(''); setNewEmail(''); setNewRole('operator'); setSelectedSedes(new Set()); setShowForm(false); setLoading(false)
  }

  const ops = users.filter(u => u.role === 'operator').length
  const vws = users.filter(u => u.role === 'viewer').length
  const inp: React.CSSProperties = { width: '100%', height: 40, border: '1px solid var(--border)', borderRadius: 8, padding: '0 12px', fontSize: 13.5, color: 'var(--on-surface)', background: '#FBFAFE', outline: 'none' }

  return (
    <div className="tx-page">
      <PageHeader
        eyebrow="ADMINISTRACIÓN / ACCESO INTERNO"
        title="Backoffice"
        description="Usuarios internos con acceso al panel y sus sucursales asignadas."
        action={
          <PrimaryButton onClick={() => setShowForm(v => !v)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Dar de alta usuario
          </PrimaryButton>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 14, marginBottom: 16 }}>
        <Card><div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.11em', color: 'var(--mono-muted)', marginBottom: 10 }}>USUARIOS TOTALES</div><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 600, color: 'var(--ink)' }}>{users.length}</span></Card>
        <Card><div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.11em', color: 'var(--mono-muted)', marginBottom: 10 }}>OPERADORES</div><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 600, color: 'var(--ink)' }}>{ops}</span></Card>
        <Card><div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.11em', color: 'var(--mono-muted)', marginBottom: 10 }}>VIEWERS</div><span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 28, fontWeight: 600, color: 'var(--ink)' }}>{vws}</span></Card>
      </div>

      {showForm && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--primary-border)', borderRadius: 14, padding: 22, boxShadow: '0 1px 2px rgba(14,9,37,.04)', marginBottom: 16 }}>
          <h2 style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: 16, fontWeight: 600, color: 'var(--ink)', margin: '0 0 16px' }}>Alta de usuario</h2>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>Nombre completo</label>
                <input type="text" placeholder="Ej. Jorge Ramírez" value={newName} onChange={e => setNewName(e.target.value)} style={inp} required />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 6 }}>Correo corporativo</label>
                <input type="email" placeholder="nombre@empresa.com" value={newEmail} onChange={e => setNewEmail(e.target.value)} style={inp} required />
              </div>
            </div>

            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8 }}>Rol</label>
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
              {(['operator', 'viewer'] as const).map(r => {
                const on = newRole === r
                return (
                  <button key={r} type="button" onClick={() => setNewRole(r)} style={{ height: 36, padding: '0 16px', border: `1px solid ${on ? 'var(--primary-border)' : 'var(--border)'}`, borderRadius: 8, fontFamily: 'inherit', fontSize: 13, fontWeight: on ? 600 : 500, cursor: 'pointer', background: on ? 'var(--primary-bg)' : 'var(--surface)', color: on ? 'var(--primary-deeper)' : 'var(--muted)' }}>
                    {r === 'operator' ? 'Operator' : 'Viewer'}
                  </button>
                )
              })}
            </div>

            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--on-surface)', marginBottom: 8 }}>Sucursales asignadas</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
              {ZONES.map(z => {
                const on = selectedSedes.has(z)
                return (
                  <button key={z} type="button" onClick={() => toggleSede(z)} style={{ border: `1px solid ${on ? 'var(--primary-border)' : 'var(--border)'}`, borderRadius: 999, padding: '6px 12px', fontFamily: 'inherit', fontSize: 12.5, fontWeight: 500, cursor: 'pointer', background: on ? 'var(--primary-bg)' : 'var(--surface)', color: on ? 'var(--primary-deeper)' : 'var(--muted)' }}>
                    {z}
                  </button>
                )
              })}
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={loading} style={{ height: 38, padding: '0 18px', border: 0, background: 'var(--primary)', color: '#fff', borderRadius: 9, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }}>
                {loading ? 'Guardando…' : 'Guardar usuario'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ height: 38, padding: '0 18px', border: '1px solid var(--border)', background: 'var(--surface)', color: 'var(--on-surface)', borderRadius: 9, fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500, cursor: 'pointer' }}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <Card>
        <table data-testid="users-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['USUARIO', 'ROL', 'SUCURSALES', 'ESTADO', ''].map((h, i) => (
                <th key={i} style={{ textAlign: 'left', padding: '13px 12px', fontFamily: "'IBM Plex Mono',monospace", fontSize: 10.5, letterSpacing: '.08em', color: 'var(--mono-muted)', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.id} style={{ borderBottom: '1px solid var(--border-soft)' }}>
                <td style={{ padding: '13px 12px' }}>
                  <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--on-surface)' }}>{u.name}</div>
                  <div style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: 11, color: 'var(--mono-muted)' }}>{u.email}</div>
                </td>
                <td style={{ padding: '13px 12px' }}><MonoBadge label={u.role} /></td>
                <td style={{ padding: '13px 12px', fontSize: 13, color: 'var(--muted)' }}>{u.sedes}</td>
                <td style={{ padding: '13px 12px' }}><StatusBadge status={u.status === 'active' ? 'success' : 'warning'} label={u.status === 'active' ? 'Activo' : 'Invitación pendiente'} /></td>
                <td style={{ padding: '13px 12px', textAlign: 'right' }}><button style={{ height: 30, padding: '0 12px', border: '1px solid var(--border)', background: 'var(--surface)', borderRadius: 7, fontFamily: 'inherit', fontSize: 12, color: 'var(--on-surface)', cursor: 'pointer' }}>Editar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  )
}
