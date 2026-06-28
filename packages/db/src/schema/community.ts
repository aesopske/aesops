import {
    boolean,
    index,
    integer,
    pgTable,
    smallint,
    text,
    timestamp,
    unique,
    type AnyPgColumn,
} from 'drizzle-orm/pg-core'
import { users } from './auth'
import { documents } from './documents'

export const threads = pgTable(
    'threads',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        userId: text('user_id').references(() => users.id, {
            onDelete: 'set null',
        }),
        title: text('title').notNull(),
        body: text('body').notNull(),
        linkedDatasetId: text('linked_dataset_id').references(
            () => documents.id,
            {
                onDelete: 'set null',
            },
        ),
        linkedDatasetSlug: text('linked_dataset_slug'),
        linkedDatasetName: text('linked_dataset_name'),
        linkedBlogId: text('linked_blog_id'),
        linkedBlogSlug: text('linked_blog_slug'),
        linkedBlogTitle: text('linked_blog_title'),
        slug: text('slug').unique(),
        replyCount: integer('reply_count').notNull().default(0),
        createdAt: timestamp('created_at').notNull().defaultNow(),
        updatedAt: timestamp('updated_at').notNull().defaultNow(),
    },
    (t) => [
        index('idx_threads_user_id').on(t.userId),
        index('idx_threads_linked_dataset_id').on(t.linkedDatasetId),
        index('idx_threads_created_at').on(t.createdAt),
    ],
)

export const comments = pgTable(
    'comments',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        entityType: text('entity_type').notNull(), // 'discussion' | 'blog'
        entityId: text('entity_id').notNull(), // thread.id | sanity post _id
        userId: text('user_id').references(() => users.id, {
            onDelete: 'set null',
        }),
        parentId: text('parent_id').references((): AnyPgColumn => comments.id, {
            onDelete: 'cascade',
        }),
        body: text('body').notNull(),
        isAiResponse: boolean('is_ai_response').notNull().default(false),
        voteScore: integer('vote_score').notNull().default(0),
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (t) => [
        index('idx_comments_entity').on(t.entityType, t.entityId),
        index('idx_comments_parent_id').on(t.parentId),
        index('idx_comments_user_id').on(t.userId),
    ],
)

export const commentVotes = pgTable(
    'comment_votes',
    {
        id: text('id')
            .primaryKey()
            .$defaultFn(() => crypto.randomUUID()),
        userId: text('user_id')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        commentId: text('comment_id')
            .notNull()
            .references(() => comments.id, { onDelete: 'cascade' }),
        value: smallint('value').notNull(), // 1 (upvote) or -1 (downvote)
        createdAt: timestamp('created_at').notNull().defaultNow(),
    },
    (t) => [
        unique('uniq_comment_votes_user_comment').on(t.userId, t.commentId),
        index('idx_comment_votes_comment').on(t.commentId),
    ],
)
