CREATE TABLE "leads" (
	"id" text PRIMARY KEY NOT NULL,
	"source" text NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"company" text,
	"phone" text,
	"service_interest" text,
	"message" text NOT NULL,
	"status" text DEFAULT 'new' NOT NULL,
	"email_notified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "idx_leads_source" ON "leads" USING btree ("source");--> statement-breakpoint
CREATE INDEX "idx_leads_created_at" ON "leads" USING btree ("created_at");