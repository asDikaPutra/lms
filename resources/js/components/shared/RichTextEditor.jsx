import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { useEffect, useCallback } from 'react';
import {
    Bold,
    Italic,
    Heading1,
    Heading2,
    Heading3,
    List,
    ListOrdered,
    Link as LinkIcon,
    ImageIcon,
    Undo,
    Redo,
} from 'lucide-react';

/**
 * Rich Text Editor component built on TipTap.
 *
 * Props:
 *   - value: string (HTML) — controlled content
 *   - onChange: (html: string) => void — called when content changes
 *   - placeholder: string — optional placeholder text
 *   - className: string — optional additional classes on the outer wrapper
 */
export default function RichTextEditor({ value = '', onChange, placeholder = 'Tulis konten di sini...', className = '' }) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                // Disable built-in link so the standalone Link extension below takes over
                link: false,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-forest underline' },
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-sm max-w-none px-3 py-2 min-h-[160px] text-[13px] text-fg-primary outline-none focus:outline-none',
            },
        },
    });

    // Sync external value changes (e.g. form reset)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || '', false);
        }
    }, [value, editor]);

    const setLink = useCallback(() => {
        if (!editor) return;

        const previousUrl = editor.getAttributes('link').href;
        const url = window.prompt('URL', previousUrl);

        if (url === null) return; // cancelled
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run();
            return;
        }

        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }, [editor]);

    const addImage = useCallback(() => {
        if (!editor) return;

        const url = window.prompt('URL Gambar');
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    }, [editor]);

    if (!editor) return null;

    return (
        <div data-testid="rich-text-editor" className={`rounded-[6px] border border-[#d6dbde] overflow-hidden focus-within:border-mint focus-within:ring-1 focus-within:ring-mint ${className}`}>
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-0.5 border-b border-[#d6dbde] bg-[#f9f9f9] px-2 py-1.5">
                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                    title="Bold"
                >
                    <Bold className="size-3.5" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                    title="Italic"
                >
                    <Italic className="size-3.5" />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                    active={editor.isActive('heading', { level: 1 })}
                    title="Heading 1"
                >
                    <Heading1 className="size-3.5" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                    title="Heading 2"
                >
                    <Heading2 className="size-3.5" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive('heading', { level: 3 })}
                    title="Heading 3"
                >
                    <Heading3 className="size-3.5" />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                    title="Bullet List"
                >
                    <List className="size-3.5" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                    title="Ordered List"
                >
                    <ListOrdered className="size-3.5" />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton
                    onClick={setLink}
                    active={editor.isActive('link')}
                    title="Link"
                >
                    <LinkIcon className="size-3.5" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={addImage}
                    title="Image"
                >
                    <ImageIcon className="size-3.5" />
                </ToolbarButton>

                <ToolbarDivider />

                <ToolbarButton
                    onClick={() => editor.chain().focus().undo().run()}
                    disabled={!editor.can().undo()}
                    title="Undo"
                >
                    <Undo className="size-3.5" />
                </ToolbarButton>

                <ToolbarButton
                    onClick={() => editor.chain().focus().redo().run()}
                    disabled={!editor.can().redo()}
                    title="Redo"
                >
                    <Redo className="size-3.5" />
                </ToolbarButton>
            </div>

            {/* Editor Content */}
            <EditorContent editor={editor} />
        </div>
    );
}

function ToolbarButton({ onClick, active = false, disabled = false, title, children }) {
    return (
        <button
            type="button"
            onClick={onClick}
            disabled={disabled}
            title={title}
            className={`inline-flex items-center justify-center size-7 rounded-[4px] transition-colors ${
                active
                    ? 'bg-forest/10 text-forest'
                    : 'text-fg-secondary hover:bg-ceramic hover:text-fg-primary'
            } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
        >
            {children}
        </button>
    );
}

function ToolbarDivider() {
    return <div className="mx-1 h-4 w-px bg-[#d6dbde]" />;
}
