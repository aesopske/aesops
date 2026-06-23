CREATE TABLE "comments" (
	"id" text PRIMARY KEY NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" text NOT NULL,
	"user_id" text,
	"parent_id" text,
	"body" text NOT NULL,
	"is_ai_response" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
INSERT INTO "comments" ("id", "entity_type", "entity_id", "user_id", "parent_id", "body", "is_ai_response", "created_at")
	SELECT "id", 'discussion', "thread_id", "user_id", "reply_to_id", "body", "is_ai_response", "created_at" FROM "replies";
--> statement-breakpoint
DROP TABLE "replies" CASCADE;
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_parent_id_comments_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "idx_comments_entity" ON "comments" USING btree ("entity_type","entity_id");
--> statement-breakpoint
CREATE INDEX "idx_comments_parent_id" ON "comments" USING btree ("parent_id");
--> statement-breakpoint
CREATE INDEX "idx_comments_user_id" ON "comments" USING btree ("user_id");
