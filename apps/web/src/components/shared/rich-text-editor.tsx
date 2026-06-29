'use client'

import { useEffect, useRef } from 'react'
import { useEditor, EditorContent } from '@tiptap/react'
import type { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, Strikethrough, List, ListOrdered, Heading2 } from 'lucide-react'
import { ToolbarBtn } from './toolbar-btn'

// StarterKit contributes commands via module augmentation that pnpm's strict
// package resolution doesn't forward here — cast to the known runtime shape.
type Chain = {
    focus(): Chain & { run(): boolean }
    toggleBold(): Chain & { run(): boolean }
    toggleItalic(): Chain & { run(): boolean }
    toggleStrike(): Chain & { run(): boolean }
    toggleBulletList(): Chain & { run(): boolean }
    toggleOrderedList(): Chain & { run(): boolean }
    toggleHeading(attrs: { level: 1 | 2 | 3 | 4 | 5 | 6 }): Chain & { run(): boolean }
}
const cmd = (editor: Editor) => editor.chain() as unknown as Chain

type Props = {
    initialContent?: unknown
    placeholder?: string
    minHeight?: string
    allowCode?: boolean
    onChange?: (json: unknown) => void
    onChangeHtml?: (html: string, isEmpty: boolean) => void
    onCmdEnter?: () => void
    editorRef?: React.MutableRefObject<Editor | null>
}

export function RichTextEditor({ initialContent, placeholder, minHeight = 'min-h-[140px]', allowCode = false, onChange, onChangeHtml, onCmdEnter, editorRef }: Props) {
    const onCmdEnterRef = useRef(onCmdEnter)
    onCmdEnterRef.current = onCmdEnter

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                codeBlock: false,
                blockquote: false,
                horizontalRule: false,
                code: allowCode
                    ? { HTMLAttributes: { class: 'font-mono bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-medium not-italic' } }
                    : false,
            }),
            Placeholder.configure({
                placeholder: placeholder ?? 'Describe the dataset — its origin, intended use, and any caveats…',
            }),
        ],
        content: (initialContent as object | undefined) ?? undefined,
        editorProps: {
            attributes: { class: `${minHeight} px-3 py-2.5 text-sm text-foreground outline-none` },
            handleKeyDown(_view: unknown, event: KeyboardEvent) {
                if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
                    onCmdEnterRef.current?.()
                    return true
                }
                return false
            },
        },
        onUpdate({ editor }: { editor: Editor }) {
            onChange?.(editor.getJSON())
            onChangeHtml?.(editor.getHTML(), editor.isEmpty)
        },
    })

    // keep editorRef in sync
    const editorRefStable = useRef(editorRef)
    editorRefStable.current = editorRef
    useEffect(() => {
        if (editorRef) editorRef.current = editor ?? null
    }, [editor, editorRef])

    if (!editor) return null

    return (
        <div className='overflow-hidden rounded-lg border border-border transition focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/50'>
            <div className='flex gap-0.5 border-b border-border bg-muted px-2 py-1'>
                <ToolbarBtn
                    title='Heading'
                    active={editor.isActive('heading', { level: 2 })}
                    onClick={() => cmd(editor).focus().toggleHeading({ level: 2 }).run()}
                >
                    <Heading2 size={14} />
                </ToolbarBtn>
                <div className='mx-1 my-auto h-3.5 w-px bg-border' />
                <ToolbarBtn
                    title='Bold'
                    active={editor.isActive('bold')}
                    onClick={() => cmd(editor).focus().toggleBold().run()}
                >
                    <Bold size={14} />
                </ToolbarBtn>
                <ToolbarBtn
                    title='Italic'
                    active={editor.isActive('italic')}
                    onClick={() => cmd(editor).focus().toggleItalic().run()}
                >
                    <Italic size={14} />
                </ToolbarBtn>
                <ToolbarBtn
                    title='Strikethrough'
                    active={editor.isActive('strike')}
                    onClick={() => cmd(editor).focus().toggleStrike().run()}
                >
                    <Strikethrough size={14} />
                </ToolbarBtn>
                <div className='mx-1 my-auto h-3.5 w-px bg-border' />
                <ToolbarBtn
                    title='Bullet list'
                    active={editor.isActive('bulletList')}
                    onClick={() => cmd(editor).focus().toggleBulletList().run()}
                >
                    <List size={14} />
                </ToolbarBtn>
                <ToolbarBtn
                    title='Ordered list'
                    active={editor.isActive('orderedList')}
                    onClick={() => cmd(editor).focus().toggleOrderedList().run()}
                >
                    <ListOrdered size={14} />
                </ToolbarBtn>
            </div>
            <EditorContent editor={editor} />
        </div>
    )
}
