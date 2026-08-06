/**
 * E2E — Tenant Admin role.
 *
 * Verifies the Tenant Admin sees ALL items in the SDD §4.1 matrix:
 *   Tráfico, Comparativo, Permanencia, Zonas, Copiloto, Hallazgos,
 *   Motor de acciones, Exportar, Usuarios, Partners
 *
 * Confirms that out-of-scope modules (Fleet, Facturación) are NEVER rendered
 * in the nav (not implemented at MLP scope).
 * Backoffice and Reventa ARE admin-nav items — visible to Tenant Admin.
 */
import { test, expect } from '@playwright/test'
import { tokens, mockApi, loginAs } from './helpers'

test.beforeEach(async ({ page }) => {
  await mockApi(page)
})

test('tenant admin lands on resumen page after login', async ({ page }) => {
  await loginAs(page, tokens.tenantAdmin())
  await page.waitForURL(/\/resumen/)
  await expect(page.locator('[data-testid="resumen-page"]')).toBeVisible()
})

test('tenant admin nav contains all Fase 3 items including Motor de Acciones and Hallazgos', async ({ page }) => {
  await loginAs(page, tokens.tenantAdmin())
  const nav = page.locator('nav')
  await expect(nav.getByText('Tráfico', { exact: false })).toBeVisible()
  await expect(nav.getByText('Comparativo')).toBeVisible()
  await expect(nav.getByText('Permanencia')).toBeVisible()
  await expect(nav.getByText('Zonas', { exact: false })).toBeVisible()
  await expect(nav.getByText('Copiloto')).toBeVisible()
  await expect(nav.getByText('Hallazgos')).toBeVisible()
  await expect(nav.getByText('Motor de acciones')).toBeVisible()
  await expect(nav.getByText('Exportar')).toBeVisible()
  await expect(nav.getByText('Usuarios')).toBeVisible()
  await expect(nav.getByText('Partners')).toBeVisible()
})

test('tenant admin can navigate to Comparison page', async ({ page }) => {
  await loginAs(page, tokens.tenantAdmin())
  await page.click('nav >> text=Comparativo')
  await page.waitForURL(/\/comparison/)
  await expect(page.locator('[data-testid="comparison-table"]')).toBeVisible()
})

test('tenant admin can navigate to Zones page', async ({ page }) => {
  await loginAs(page, tokens.tenantAdmin())
  await page.click('nav >> text=Zonas')
  await page.waitForURL(/\/zones/)
  await expect(page.locator('[data-testid="zone-canvas"]')).toBeVisible()
})

test('tenant admin can navigate to Users page', async ({ page }) => {
  await loginAs(page, tokens.tenantAdmin())
  await page.click('nav >> text=Usuarios')
  await page.waitForURL(/\/users/)
  await expect(page.locator('[data-testid="users-table"]')).toBeVisible()
})

test('tenant admin can navigate to Partners page', async ({ page }) => {
  await loginAs(page, tokens.tenantAdmin())
  await page.click('nav >> text=Partners')
  await page.waitForURL(/\/partners/)
  await expect(page.locator('[data-testid="partners-list"]')).toBeVisible()
})

test('tenant admin partners page renders real API data — names and emails from mock', async ({ page }) => {
  await loginAs(page, tokens.tenantAdmin())
  await page.goto('/partners')
  await expect(page.locator('[data-testid="partners-list"]')).toBeVisible()
  // Mock returns two partners — both names must appear
  await expect(page.getByText('Lácteos CA')).toBeVisible()
  await expect(page.getByText('Bebidas CAM')).toBeVisible()
  // Admin emails surfaced from real PartnerListItem (not contact_email)
  await expect(page.getByText('admin@lacteosca.com')).toBeVisible()
  // Two partner-cards in DOM
  await expect(page.locator('[data-testid="partner-card"]')).toHaveCount(2)
})

test('resumen page shows sin-datos state when analytics APIs return empty', async ({ page }) => {
  await loginAs(page, tokens.tenantAdmin())
  await page.waitForURL(/\/resumen/)
  await expect(page.locator('[data-testid="resumen-page"]')).toBeVisible()
  // KPIs show em-dash (—) when no traffic or dwell data
  await expect(page.getByText('—').first()).toBeVisible()
  // Chart area shows "sin datos" message instead of hardcoded bars
  await expect(page.getByText('Sin datos de tráfico aún')).toBeVisible()
  // Alerts panel shows the mock finding with action_required severity
  await expect(page.getByText('stock audit')).toBeVisible()
})

test('out-of-scope modules are absent from the DOM (not just hidden)', async ({ page }) => {
  await loginAs(page, tokens.tenantAdmin())
  // Fleet management and Facturación are NOT implemented at MLP scope — must be
  // absent from the DOM entirely, not just hidden with CSS.
  // Backoffice, Reventa, Motor de acciones ARE admin-nav items and WILL appear.
  await expect(page.getByText('Fleet',       { exact: false })).toHaveCount(0)
  await expect(page.getByText('Facturación', { exact: false })).toHaveCount(0)
})

test('tenant admin can navigate to Motor de Acciones page', async ({ page }) => {
  await loginAs(page, tokens.tenantAdmin())
  await page.click('nav >> text=Motor de acciones')
  await page.waitForURL(/\/actions/)
  await expect(page.locator('[data-testid="actions-tab-rules"]')).toBeVisible()
  await expect(page.locator('[data-testid="actions-tab-channels"]')).toBeVisible()
  await expect(page.locator('[data-testid="actions-tab-log"]')).toBeVisible()
})

test('sedes page renders site rows from real API mock', async ({ page }) => {
  // LIFO: override /v1/sites with real data before global empty mock
  await page.route('/v1/sites', route =>
    route.fulfill({ json: [
      { id: 's-1', name: 'Sucursal Centro', status: 'active' },
      { id: 's-2', name: 'Sucursal Norte',  status: 'inactive' },
    ]})
  )
  await loginAs(page, tokens.tenantAdmin())
  await page.goto('/sedes')
  await expect(page.locator('[data-testid="sedes-table"]')).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Sucursal Centro' })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'Sucursal Norte' })).toBeVisible()
})

test('sedes page shows empty state when API returns no sites', async ({ page }) => {
  await loginAs(page, tokens.tenantAdmin())
  await page.goto('/sedes')
  await expect(page.locator('[data-testid="sedes-empty"]')).toBeVisible()
})

test('comparison table renders site data from real API mock', async ({ page }) => {
  await page.route('/v1/analytics/comparison', route =>
    route.fulfill({ json: [
      { site_id: 's-1', site_name: 'Sucursal Centro', week: '2026-07-14', unique_visitors: 840 },
      { site_id: 's-1', site_name: 'Sucursal Centro', week: '2026-07-21', unique_visitors: 920 },
    ]})
  )
  await loginAs(page, tokens.tenantAdmin())
  await page.goto('/comparison')
  await expect(page.locator('[data-testid="comparison-table"]')).toBeVisible()
  await expect(page.getByText('Sucursal Centro')).toBeVisible()
  await expect(page.getByText('840')).toBeVisible()
})

test('users table renders user rows from real API mock', async ({ page }) => {
  await page.route('/v1/backoffice/users', route =>
    route.fulfill({ json: [
      { id: 'u-1', email: 'operator@qa.demo', role: 'operator', status: 'active', site_count: 2 },
    ]})
  )
  await loginAs(page, tokens.tenantAdmin())
  await page.goto('/users')
  await expect(page.locator('[data-testid="users-table"]')).toBeVisible()
  await expect(page.getByText('operator@qa.demo')).toBeVisible()
})

test('zones page camera selector populated from real API mock', async ({ page }) => {
  await page.route('/v1/cameras', route =>
    route.fulfill({ json: [
      { id: 'c-1', site_id: 's-1', name: 'Cámara Entrada', status: 'active' },
    ]})
  )
  await loginAs(page, tokens.tenantAdmin())
  await page.goto('/zones')
  await expect(page.locator('[data-testid="zone-canvas"]')).toBeVisible()
  await expect(page.locator('[data-testid="camera-select"] option', { hasText: 'Cámara Entrada' })).toHaveCount(1)
})

test('tenant admin can navigate to Hallazgos page', async ({ page }) => {
  await loginAs(page, tokens.tenantAdmin())
  await page.click('nav >> text=Hallazgos')
  await page.waitForURL(/\/findings/)
  await expect(page.locator('[data-testid="finding-row"]').first()).toBeVisible()
})
