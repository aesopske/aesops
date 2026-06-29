CREATE TABLE "comment_votes" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"comment_id" text NOT NULL,
	"value" smallint NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "uniq_comment_votes_user_comment" UNIQUE("user_id","comment_id")
);
--> statement-breakpoint
ALTER TABLE "threads" ADD COLUMN "slug" text;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "vote_score" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "comment_votes" ADD CONSTRAINT "comment_votes_comment_id_comments_id_fk" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_comment_votes_comment" ON "comment_votes" USING btree ("comment_id");--> statement-breakpoint
ALTER TABLE "threads" ADD CONSTRAINT "threads_slug_unique" UNIQUE("slug");