import { boolean, index, pgTable, text, timestamp } from 'drizzle-orm/pg-core'

export const leads = pgTable(
    'leads',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        source: text('source').notNull(), // 'consultation' | 'contact'
        name: text('name').notNull(),
        email: text('email').notNull(),
        company: text('company'),
        phone: text('phone'),
        serviceInterest: text('service_interest'), // 'market_intelligence' | 'custom_bi' | 'predictive_analytics' | 'data_pipeline' | 'other'
        message: text('message').notNull(),
        status: text('status').notNull().default('new'), // 'new' | 'contacted' | 'closed'
        emailNotified: boolean('email_notified').notNull().default(false),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (t) => [
        index('idx_leads_source').on(t.source),
        index('idx_leads_created_at').on(t.createdAt),
    ],
)
