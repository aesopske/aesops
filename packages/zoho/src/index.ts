import { zohoFetch } from './client'
import { ZOHO_DEAL_STAGE, ZOHO_SOFTWARE_CONSULTING_LAYOUT_ID, ZOHO_SUB_PIPELINE } from './constants'

type ZohoUpsertResponse = {
    data: Array<{ action: 'insert' | 'update'; details: { id: string }; status: string }>
}

function splitName(name: string): { firstName?: string; lastName: string } {
    const parts = name.trim().split(/\s+/)
    if (parts.length === 1) return { lastName: parts[0]! }
    return { firstName: parts.slice(0, -1).join(' '), lastName: parts.at(-1)! }
}

export async function upsertZohoContact(input: {
    name: string
    email: string
    company?: string
    phone?: string
}): Promise<string> {
    const { firstName, lastName } = splitName(input.name)

    const result = (await zohoFetch('/Contacts/upsert', {
        method: 'POST',
        body: JSON.stringify({
            data: [
                {
                    Email: input.email,
                    First_Name: firstName,
                    Last_Name: lastName,
                    Account_Name: input.company,
                    Phone: input.phone,
                },
            ],
            duplicate_check_fields: ['Email'],
        }),
    })) as ZohoUpsertResponse

    const record = result.data[0]
    if (!record || record.status !== 'success') {
        throw new Error(`Zoho contact upsert failed: ${JSON.stringify(result)}`)
    }

    return record.details.id
}

export async function createZohoDeal(input: {
    contactId: string
    dealName: string
    description?: string
}): Promise<string> {
    const result = (await zohoFetch('/Pipelines', {
        method: 'POST',
        body: JSON.stringify({
            data: [
                {
                    Deal_Name: input.dealName,
                    Layout: { id: ZOHO_SOFTWARE_CONSULTING_LAYOUT_ID },
                    Sub_Pipeline: ZOHO_SUB_PIPELINE,
                    Stage: ZOHO_DEAL_STAGE,
                    Contact_Name: { id: input.contactId },
                    Description: input.description,
                    // Required by the Deals layout; a new inbound lead has no real
                    // expected close date yet, so default to 30 days out as a placeholder.
                    Closing_Date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                        .toISOString()
                        .slice(0, 10),
                },
            ],
        }),
    })) as ZohoUpsertResponse

    const record = result.data[0]
    if (!record || record.status !== 'success') {
        throw new Error(`Zoho deal create failed: ${JSON.stringify(result)}`)
    }

    return record.details.id
}

export async function syncLeadToZoho(lead: {
    name: string
    email: string
    company?: string
    phone?: string
    source: string
    message: string
}): Promise<{ contactId: string; dealId: string }> {
    const contactId = await upsertZohoContact({
        name: lead.name,
        email: lead.email,
        company: lead.company,
        phone: lead.phone,
    })

    const dealId = await createZohoDeal({
        contactId,
        dealName: `${lead.company ?? lead.name} — ${lead.source}`,
        description: lead.message,
    })

    return { contactId, dealId }
}
