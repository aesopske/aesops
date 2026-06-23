CREATE TABLE "replies" (
	"id" text PRIMARY KEY NOT NULL,
	"thread_id" text NOT NULL,
	"user_id" text,
	"body" text NOT NULL,
	"is_ai_response" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "threads" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"title" text NOT NULL,
	"body" text NOT NULL,
	"linked_dataset_id" text,
	"linked_dataset_slug" text,
	"linked_dataset_name" text,
	"linked_blog_id" text,
	"linked_blog_slug" text,
	"linked_blog_title" text,
	"reply_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "replies" ADD CONSTRAINT "replies_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "replies" ADD CONSTRAINT "replies_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_linked_dataset_id_documents_id_fk" FOREIGN KEY ("linked_dataset_id") REFERENCES "public"."documents"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_replies_thread_id" ON "replies" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "idx_replies_user_id" ON "replies" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_threads_user_id" ON "threads" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_threads_linked_dataset_id" ON "threads" USING btree ("linked_dataset_id");--> statement-breakpoint
CREATE INDEX "idx_threads_created_at" ON "threads" USING btree ("created_at");