import { db } from '@repo/db'
import type { Session } from '@repo/auth'
import { api } from '@/trpc/server'
import { DatasetChatWidget } from '@/components/platform/dataset/dataset-chat-widget'

type Props = {
    datasetId: string
    session: Session
}

export async function ChatWidgetSection({ datasetId, session }: Props) {
    const [chatHistory, topQuestions] = await Promise.all([
        db.query.chatMessages.findMany({
            where: (t, { and, eq }) =>
                and(eq(t.datasetId, datasetId), eq(t.userId, session.user.id)),
            orderBy: (t, { asc }) => [asc(t.createdAt)],
        }),
        api.documents.topQuestions({ datasetId }),
    ])

    return (
        <DatasetChatWidget
            datasetId={datasetId}
            initialMessages={chatHistory}
            suggestedQuestions={topQuestions.map((q) => q.question)}
        />
    )
}
