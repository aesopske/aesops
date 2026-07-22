ALTER TABLE "leads" ADD COLUMN "zoho_contact_id" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "zoho_deal_id" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "zoho_synced_at" timestamp;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "zoho_sync_error" text;