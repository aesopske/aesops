export const ZOHO_DEAL_STAGE = 'Qualification'

// Bigin's Pipelines module requires both Layout and Sub_Pipeline to be set explicitly on
// create (a plain Pipeline field alone isn't accepted). Looked up via
// GET /settings/layouts?module=Pipelines — Sub_Pipeline follows a "<Layout name> <Profile
// name>" convention (the "Standard" profile, matching the other write-access profile on this token).
export const ZOHO_SOFTWARE_CONSULTING_LAYOUT_ID = '1010178000000551044'
export const ZOHO_SUB_PIPELINE = 'Software Consulting Standard'
