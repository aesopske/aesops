ALTER TABLE "documents" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "tags" jsonb;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "classified_at" timestamp;