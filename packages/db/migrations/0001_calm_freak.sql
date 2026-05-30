CREATE TABLE "chat_messages" (
	"id" text PRIMARY KEY NOT NULL,
	"dataset_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "parent_id" text;--> statement-breakpoint
ALTER TABLE "documents" ADD COLUMN "metadata_diff" jsonb;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_dataset_id_documents_id_fk" FOREIGN KEY ("dataset_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_slug_unique" UNIQUE("slug");