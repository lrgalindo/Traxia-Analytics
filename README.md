# Traxia Analytics

> **Si buscas el System Design Document completo (arquitectura, DDL, RLS, roadmap),
> salta a la sección [System Design Document (SDD) v3.4 — FINAL](#system-design-document-sdd-v34--final)
> más abajo.**

## Estado del Proyecto — 2026-07-27

### Deploy en producción

| Servicio | URL | Estado |
|---------|-----|--------|
| **Cloud API (Render)** | https://traxia-analytics.onrender.com | ✅ Live |
| **Base de datos (Supabase)** | Proyecto `rvyftmriofvddtlpizlw`, us-east-1 | ✅ Conectada |
| **Snapshots (R2)** | — | ⚠️ No configurado — endpoints de snapshot retornan 503 descriptivo |
| **Auth de usuarios (Supabase Auth)** | — | ⚠️ No configurado — login de Tenant Admin / Operator / Partner bloqueado hasta configurar `SUPABASE_URL` + `SUPABASE_ANON_KEY` en Render |

**Endpoints validados contra infraestructura real (smoke test 2026-07-27):**
- `GET /health` → 200
- `POST /v1/superadmin/login` → 200
- `POST /v1/tenants/register` → 201
- `POST /v1/superadmin/tenants/{id}/approve` → 200
- `POST /v1/edge/token/activate` → 200
- `POST /v1/edge/token/refresh` → 200
- `GET /v1/models/retail/manifest` → 503 descriptivo (R2 no configurado — comportamiento esperado)

**Próximo paso de infraestructura:** Configurar `SUPABASE_URL`, `SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY` en Render para habilitar el login de usuarios del lado cliente.

### Fases completadas y mergeadas a master

| Fase | Descripción | Estado |
|------|-------------|--------|
| **Fase 1** | Esquema PostgreSQL 17 + RLS 3 niveles + Edge Gateway + auth (access/refresh/grace-window) | ✅ Mergeada |
| **Fase 2** | Backoffice, Partners, dashboards de tráfico/dwell/comparativo | ✅ Mergeada |
| **Fase 3** | Motor de Acciones + Copiloto (Claude) + Hallazgos con snapshot firmado R2 | ✅ Mergeada |
| **Fase A** | SuperAdmin login (bcrypt) + Break-glass audit + GDPR right-to-erasure + RTSP Fernet | ✅ Mergeada |

**Suite de tests — estado al merge:**
- 14 pgTAP (isolation × 4, backoffice × 2, gateway × 7, lifecycle × 1): **14/14 ✅**
- 32 pytest (superadmin login × 5, breakglass × 5, lifecycle × 10, grace-window × 1, channels × 6, crypto × 5): **32/32 ✅**
- Migraciones 0001 → 0014 aplicadas en Supabase us-east-1 (`alembic upgrade head` + parches directos para compatibilidad con RLS gestionado)

### Qué tiene interfaz visual y qué es solo API

| Módulo | Dashboard UI | API Cloud | Notas |
|--------|:---:|:---:|-------|
| Tráfico / Heatmap | ✅ | ✅ | |
| Dwell Time por zona | ✅ | ✅ | |
| Comparativo inter-sucursal | ✅ | ✅ | Tenant Admin únicamente |
| Zonas / Cámaras (dibujo de polígonos) | ✅ | ✅ | Tenant Admin únicamente |
| Backoffice de Usuarios | ✅ | ✅ | Tenant Admin únicamente |
| Partners (alta/baja/revocación) | ✅ | ✅ | Tenant Admin únicamente |
| Motor de Acciones (reglas + canales + log) | ✅ | ✅ | Tenant Admin únicamente, nunca Partner |
| Copiloto (chat con Claude Haiku 4.5) | ✅ | ✅ | Admin + Partner (datos acotados por RLS) |
| Hallazgos de auditoría (`agent_findings`) | ✅ | ✅ | Admin + Partner (RLS); snapshot como URL firmada R2 (5 min) |
| Exportar PDF/CSV | ✅ | ✅ | |
| Model Registry / Fleet Management | ❌ UI | ✅ API | Gestión interna vía SuperAdmin, sin UI todavía |
| Login SuperAdmin | ❌ UI | ✅ API | `POST /v1/superadmin/login` — bcrypt + JWT separado (PLATFORM_ADMIN_SECRET) |
| Break-glass access | ❌ UI | ✅ API | Audit log antes de acceso; sesión 4 h; solo SELECT en tracking_coordinates |
| GDPR right-to-erasure | ❌ UI | ✅ API | `DELETE /v1/tenants/{id}/partners/{pid}/data` — irreversible, 2 capas de validación |
| Reseller / Canal distribuidor | ❌ | ❌ activo | Diferido a v2.0 (tabla y RLS escritos, inertes) |

### Variables de entorno requeridas (fail-fast — el servidor no arranca si faltan)

```
DATABASE_URL           — conexión PostgreSQL
JWT_SECRET             — firma tokens de usuario/gateway
RTSP_ENCRYPTION_KEY    — Fernet key para credenciales RTSP (32 bytes, base64)
PLATFORM_ADMIN_SECRET  — firma tokens SuperAdmin (secreto separado de JWT_SECRET)
```

Opcionales (degradan gracefully si no están, con excepciones indicadas):
```
ANTHROPIC_API_KEY      — Copiloto y auditoría (sin ella: 503 en esos endpoints)
R2_ACCOUNT_ID + R2_ACCESS_KEY_ID + R2_SECRET_ACCESS_KEY  — snapshots (sin ellas: 503 en manifest/snapshot)
SUPABASE_URL + SUPABASE_ANON_KEY + SUPABASE_SERVICE_ROLE_KEY — login de usuarios
```
> ⚠️ **`SUPABASE_URL` + `SUPABASE_ANON_KEY` no son meramente opcionales en producción.**
> Sin ellas, `POST /v1/auth/login` retorna 503 — ningún usuario del lado cliente
> (Tenant Admin, Operator, Partner) puede autenticarse. SuperAdmin y Edge Gateway
> no se ven afectados (usan JWT propio). Configurar antes del primer demo a cliente.

### Brechas conocidas documentadas en el SDD

1. **UI de SuperAdmin** (SDD §4, §8.5): el login de SuperAdmin existe como API
   (`POST /v1/superadmin/login`). No hay pantalla de UI para SuperAdmin — todas las
   operaciones de plataforma se ejecutan vía API directa. Una UI de SuperAdmin está
   diseñada pero no construida.

2. **Guardrail de salida del Copiloto** (SDD §12.4): la seguridad del Copiloto
   descansa en el aislamiento de datos (RLS filtra qué zonas se incluyen en el system
   prompt), no en un filtro server-side de la respuesta del modelo. La respuesta de
   Claude sale tal cual hacia el usuario — no existe un filtro de contenido de salida.
   Esto está documentado explícitamente en `tests/copilot/test_copilot_api.py` y es
   una decisión de diseño, no un olvido.

3. **Reseller / Canal** (SDD §3.1, decisión 2): la tabla `resellers`, su RLS y el
   Flujo 6 están completos y validados en el SDD, pero **inertes** en el MLP. Se
   activan sin rediseño cuando exista el primer acuerdo de canal real.

4. **Bootstrap site name** (F-9): `approve_tenant()` crea el primer sitio con nombre
   hardcodeado `'Sucursal Principal'`. Sin impacto de seguridad; se extiende en
   producción cuando el onboarding flow reciba el nombre del Asset Owner.

---

## Cómo levantar el proyecto localmente

### Pre-requisitos

- Python 3.11+
- Node.js 20+
- PostgreSQL 17 local (o Supabase CLI)
- Docker (para el Edge Gateway)

### 1. Base de datos

```bash
# Crea la base de datos
createdb traxia

# Aplica las 11 migraciones en orden (incluye schema completo + RLS + extensiones)
DATABASE_URL=postgresql://$USER@localhost:5432/traxia alembic upgrade head
```

### 2. API Cloud

```bash
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt

# Variables requeridas (el servidor falla con ValueError si faltan):
export DATABASE_URL="postgresql://localhost/traxia"
export JWT_SECRET="$(openssl rand -hex 32)"
export RTSP_ENCRYPTION_KEY="$(python3 -c 'from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())')"
export PLATFORM_ADMIN_SECRET="$(openssl rand -hex 32)"

uvicorn cloud.main:app --reload --port 8000
```

### 3. Dashboard

```bash
cd dashboard
npm install
cp .env.example .env.local                   # ajusta VITE_API_URL=http://localhost:8000
npm run dev                                   # http://localhost:5173
```

### 4. Edge Gateway (modo STUB para desarrollo)

```bash
cd edge
# Sin ultralytics instalado, el gateway corre en STUB mode (detecciones sintéticas)
pip install -r requirements.txt
python -m edge.gateway
```

Para validación real con YOLOv8n + ByteTrack (requiere ultralytics/PyTorch):
```bash
./validate_inference/run.sh --model /path/to/yolo_retail.pt
```

### 5. Tests

```bash
# API Cloud (no requiere DB real — fixtures de pytest)
cd cloud && pytest tests/ -v

# Edge Gateway (unit tests, sin ultralytics)
cd edge && pytest tests/ -v

# Dashboard E2E (Playwright, requiere `npm run dev` corriendo)
cd dashboard && npx playwright test
```

---

## Matriz de roles rápida

| Pantalla | Tenant Admin | Operator/Viewer | Partner |
|----------|:---:|:---:|:---:|
| Tráfico / Dwell / Heatmap | ✅ | ✅ (sus sedes) | ✅ (sus zonas) |
| Copiloto + Hallazgos | ✅ | ✅ | ✅ (acotado) |
| Exportar | ✅ | ✅ | ✅ |
| Zonas / Comparativo / Usuarios / Partners | ✅ | ❌ | ❌ |
| **Motor de Acciones** | ✅ | ❌ | **nunca** |

> El aislamiento de datos (qué ve cada rol) está garantizado por RLS en PostgreSQL,
> no solo por la UI. Ver SDD §8.3 para la implementación completa.

---
