-- Seed data for pgTAP backoffice RLS tests.
-- Uses bb-prefixed UUIDs to avoid collision with isolation suite (00-prefixed).
-- Safe to run multiple times (ON CONFLICT DO NOTHING).

INSERT INTO tenants (id, name, vertical_type, status) VALUES
  ('bb100000-0000-4000-8000-000000000001', 'Tenant Alpha', 'retail', 'active'),
  ('bb200000-0000-4000-8000-000000000001', 'Tenant Beta',  'retail', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO sites (id, tenant_id, name, status) VALUES
  ('bb100000-0000-4000-8000-000000000002',
   'bb100000-0000-4000-8000-000000000001', 'Alpha Site 1', 'active'),
  ('bb200000-0000-4000-8000-000000000002',
   'bb200000-0000-4000-8000-000000000001', 'Beta Site 1',  'active')
ON CONFLICT DO NOTHING;

-- rtsp_url_ciphertext: arbitrary valid bytea — tests never decrypt it.
INSERT INTO cameras (id, site_id, name, rtsp_url_ciphertext, rtsp_url_key_id, status) VALUES
  ('bb100000-0000-4000-8000-000000000004',
   'bb100000-0000-4000-8000-000000000002',
   'Alpha-Cam-1', '\xdeadbeef'::bytea, 'test-key-v1', 'active'),
  ('bb200000-0000-4000-8000-000000000004',
   'bb200000-0000-4000-8000-000000000002',
   'Beta-Cam-1',  '\xdeadbeef'::bytea, 'test-key-v1', 'active')
ON CONFLICT DO NOTHING;

-- admin_a: Tenant Alpha admin (acts as the caller in most backoffice tests)
INSERT INTO users (id, tenant_id, email, role, status) VALUES
  ('bb100000-0000-4000-8000-000000000010',
   'bb100000-0000-4000-8000-000000000001',
   'admin@alpha.test', 'admin', 'active')
ON CONFLICT DO NOTHING;

-- user_b: operator belonging to Tenant Beta — used exclusively in cross-tenant tests
-- (14) and (15) to verify that usa_write and usa_delete enforce user tenant membership.
INSERT INTO users (id, tenant_id, email, role, status) VALUES
  ('bb200000-0000-4000-8000-000000000010',
   'bb200000-0000-4000-8000-000000000001',
   'operator@beta.test', 'operator', 'active')
ON CONFLICT DO NOTHING;
