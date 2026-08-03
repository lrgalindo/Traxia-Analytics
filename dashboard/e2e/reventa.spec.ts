/**
 * E2E — Reventa: partner creation flow.
 *
 * Verifies:
 *   1. Zone selector loads real cameras/zones from API, never a hardcoded list.
 *   2. POST /v1/backoffice/partners sends zones: ZoneSpec[] — never site_ids.
 *   3. Temporary password appears exactly once on success and is non-empty.
 *   4. API error shown inline; form stays on /reventa, password panel never shown.
 *
 * Only Tenant Admin can reach /reventa (AdminOnly guard in App.tsx).
 */
import { test, expect } from '@playwright/test'
import { tokens, mockApi, loginAs } from './helpers'

const MOCK_CAMERA = {
  id: 'cam-test-1', site_id: 'site-1', name: 'Cámara Principal', status: 'active',
}
const MOCK_ZONE = {
  id: 'zone-test-1', camera_id: 'cam-test-1', name: 'Refrigerador Lácteos',
  zone_type: 'shelf', owner_type: 'TENANT',
  coordinates: { type: 'polygon', points: [[0, 0], [100, 0], [100, 100], [0, 100]] },
}

test.beforeEach(async ({ page }) => {
  await mockApi(page)
  // Override the default empty camera/zone mocks with fixture data.
  // String patterns ('/v1/cameras') match on URL path suffix — same convention
  // as loginAs and mockApi. Routes are matched LIFO: these registrations
  // (after mockApi) take priority over the catch-all '/v1/**'.
  await page.route('/v1/cameras', route => route.fulfill({ json: [MOCK_CAMERA] }))
  await page.route('/v1/zones',   route => route.fulfill({ json: [MOCK_ZONE] }))
})

test('reventa: zone selector shows cameras and zones from API', async ({ page }) => {
  await loginAs(page, tokens.tenantAdmin())
  await page.click('nav >> text=Reventa')
  await page.waitForURL(/\/reventa/)

  // Camera group header must show the real camera name, not a hardcoded label
  await expect(page.getByText('Cámara Principal')).toBeVisible()
  // Zone row with name and type badge
  await expect(page.getByText('Refrigerador Lácteos')).toBeVisible()
  await expect(page.getByText('shelf')).toBeVisible()
})

test('reventa: POST sends zones: ZoneSpec[] — no site_ids in payload', async ({ page }) => {
  let capturedBody: Record<string, unknown> | null = null

  // Register capture route after beforeEach so it wins in LIFO order
  await page.route('/v1/backoffice/partners', async route => {
    if (route.request().method() === 'POST') {
      capturedBody = JSON.parse(route.request().postData() ?? '{}')
      return route.fulfill({
        status: 201,
        json: { partner_id: 'p-new-1', name: 'Lácteos CA', admin_user_id: 'u-1', zones_created: 1 },
      })
    }
    return route.continue()
  })

  await loginAs(page, tokens.tenantAdmin())
  await page.click('nav >> text=Reventa')
  await page.waitForURL(/\/reventa/)

  await page.fill('input[type="text"]', 'Lácteos CA')
  await page.fill('input[type="email"]', 'admin@lacteos.com')
  // Click the zone label to select the checkbox
  await page.getByText('Refrigerador Lácteos', { exact: true }).click()
  await page.click('[data-testid="reventa-submit-btn"]')

  // Wait for success panel
  await expect(page.locator('[data-testid="reventa-temp-password"]')).toBeVisible()

  // Payload assertions
  expect(capturedBody).not.toBeNull()
  expect(capturedBody!['name']).toBe('Lácteos CA')
  expect(capturedBody!['admin_email']).toBe('admin@lacteos.com')
  expect(typeof capturedBody!['admin_password']).toBe('string')
  expect((capturedBody!['admin_password'] as string).length).toBeGreaterThan(8)
  // zones: ZoneSpec[] with real camera_id
  expect(Array.isArray(capturedBody!['zones'])).toBe(true)
  expect((capturedBody!['zones'] as unknown[]).length).toBe(1)
  const zone = (capturedBody!['zones'] as Record<string, unknown>[])[0]
  expect(zone['camera_id']).toBe('cam-test-1')
  expect(zone['name']).toBe('Refrigerador Lácteos')
  expect(zone['zone_type']).toBe('shelf')
  expect(zone['coordinates']).toBeTruthy()
  // The old wrong payload field must never appear
  expect(capturedBody!['site_ids']).toBeUndefined()
  expect(capturedBody!['contact_email']).toBeUndefined()
})

test('reventa: temp password appears exactly once on success and is non-empty', async ({ page }) => {
  await loginAs(page, tokens.tenantAdmin())
  await page.click('nav >> text=Reventa')
  await page.waitForURL(/\/reventa/)

  await page.fill('input[type="text"]', 'Partner Lácteos')
  await page.fill('input[type="email"]', 'test@lacteos.com')
  await page.getByText('Refrigerador Lácteos', { exact: true }).click()
  await page.click('[data-testid="reventa-submit-btn"]')

  const pwEl = page.locator('[data-testid="reventa-temp-password"]')
  await expect(pwEl).toBeVisible()
  // Exactly one password element in DOM
  await expect(pwEl).toHaveCount(1)

  const pw = await pwEl.textContent()
  expect(pw).toBeTruthy()
  expect(pw!.trim().length).toBeGreaterThan(8)

  // Success panel shows the name returned by the API (mock returns 'Test Partner')
  await expect(page.getByText('Test Partner')).toBeVisible()
  // Nav away button present
  await expect(page.locator('[data-testid="reventa-goto-partners"]')).toBeVisible()
})

test('reventa: API error shown inline — stays on /reventa, no password panel', async ({ page }) => {
  // Force POST to return 500
  await page.route('/v1/backoffice/partners', route => {
    if (route.request().method() === 'POST')
      return route.fulfill({ status: 500, json: { detail: 'supabase_unavailable' } })
    return route.continue()
  })

  await loginAs(page, tokens.tenantAdmin())
  await page.click('nav >> text=Reventa')
  await page.waitForURL(/\/reventa/)

  await page.fill('input[type="text"]', 'Partner Fail')
  await page.fill('input[type="email"]', 'fail@partner.com')
  await page.getByText('Refrigerador Lácteos', { exact: true }).click()
  await page.click('[data-testid="reventa-submit-btn"]')

  // Error message inline
  await expect(page.getByText(/No se pudo crear el partner/)).toBeVisible()
  // Still on reventa
  await expect(page).toHaveURL(/\/reventa/)
  // Password panel must NOT appear
  await expect(page.locator('[data-testid="reventa-temp-password"]')).toHaveCount(0)
})
