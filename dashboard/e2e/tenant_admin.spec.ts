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
  // Partners page now shows a partner list (creation form moved to /reventa)
  await expect(page.locator('[data-testid="partners-list"]')).toBeVisible()
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

test('tenant admin can navigate to Hallazgos page', async ({ page }) => {
  await loginAs(page, tokens.tenantAdmin())
  await page.click('nav >> text=Hallazgos')
  await page.waitForURL(/\/findings/)
  await expect(page.locator('[data-testid="finding-row"]').first()).toBeVisible()
})
