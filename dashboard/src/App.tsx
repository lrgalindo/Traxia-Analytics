import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Login } from './pages/Login'
import { Resumen } from './pages/Resumen'
import { Traffic } from './pages/Traffic'
import { Dwell } from './pages/Dwell'
import { Colas } from './pages/Colas'
import { Sedes } from './pages/Sedes'
import { Copilot } from './pages/Copilot'
import { Partners } from './pages/Partners'
import { Findings } from './pages/Findings'
import { Actions } from './pages/Actions'
import { Backoffice } from './pages/Backoffice'
import { Reventa } from './pages/Reventa'
import { Comparison } from './pages/Comparison'
import { Export } from './pages/Export'
import { Zones } from './pages/Zones'
import { Users } from './pages/Users'
import { useAuth } from './hooks/useAuth'

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token } = useAuth()
  if (!token) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminOnly({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAuth()
  if (!isAdmin) return <Navigate to="/resumen" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/resumen" replace />} />
          <Route path="resumen" element={<Resumen />} />
          <Route path="traffic" element={<Traffic />} />
          <Route path="dwell" element={<Dwell />} />
          <Route path="colas" element={<Colas />} />
          <Route path="heatmap" element={<Traffic />} />
          <Route path="copilot" element={<Copilot />} />
          <Route path="findings" element={<Findings />} />
          <Route path="export" element={<Export />} />
          {/* Tenant admin only */}
          <Route path="comparison" element={<AdminOnly><Comparison /></AdminOnly>} />
          <Route path="sedes"      element={<AdminOnly><Sedes /></AdminOnly>} />

          {/* Tenant admin only */}
          <Route path="partners" element={<AdminOnly><Partners /></AdminOnly>} />
          <Route path="backoffice" element={<AdminOnly><Backoffice /></AdminOnly>} />
          <Route path="reventa" element={<AdminOnly><Reventa /></AdminOnly>} />
          <Route path="actions" element={<AdminOnly><Actions /></AdminOnly>} />

          {/* Legacy compat */}
          <Route path="zones" element={<AdminOnly><Zones /></AdminOnly>} />
          <Route path="users" element={<AdminOnly><Users /></AdminOnly>} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
