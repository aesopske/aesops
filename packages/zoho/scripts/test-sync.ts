// One-off manual verification script — run with `pnpm --filter @repo/zoho test-sync`.
// Creates a throwaway test lead in Bigin and logs the resulting contact/deal ids.
// Check the Bigin UI afterward to confirm the deal landed in the right pipeline/stage
// and is correctly linked to the contact, then delete the test records.

import { syncLeadToZoho } from '../src/index'

const result = await syncLeadToZoho({
    name: 'Zoho Integration Test',
    email: 'zoho-integration-test@example.com',
    company: 'Test Co',
    phone: '+254700000000',
    source: 'consultation',
    message: 'This is a throwaway test lead created by packages/zoho/scripts/test-sync.mjs.',
})

console.log('✓ synced to Zoho Bigin', result)
