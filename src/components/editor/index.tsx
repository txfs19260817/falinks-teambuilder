import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { Placeholder } from '@tiptap/extension-placeholder';
import { BubbleMenu, EditorContent, FloatingMenu, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { BaseProvider } from '@/providers/baseProviders';

type EditorProps = {
  store: MappedTypeDescription<any>;
  provider: BaseProvider;
};

const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D', '#4C8BF5'];
const names = ['Cristiano Ronaldo', 'Zhuge Liang', 'Murasaki Shikibu', 'Alan Turing', 'Albert Einstein', 'Frédéric Chopin', 'Vincent Van Gogh', 'Keanu Reeves'];
const getRandomElement = (list: string[]) => list[Math.floor(Math.random() * list.length)];
const getRandomColor = () => getRandomElement(colors);
const getRandomName = () => getRandomElement(names);

export const NoteEditor = ({ store, provider }: EditorProps) => {
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'textarea textarea-accent border-2 focus:outline-none prose max-w-full',
      },
    },
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something …',
      }),
      Collaboration.configure({
        fragment: store.notes,
      }),
      CollaborationCursor.configure({
        provider,
        user: { name: getRandomName(), color: getRandomColor() },
      }),
    ],
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <FloatingMenu className="btn-group" editor={editor} tippyOptions={{ duration: 100 }}>
        {[1, 2, 3].map((lv) => (
          <button
            key={lv}
            onClick={() =>
              editor
                .chain()
                .focus()
                .toggleHeading({
                  level: lv as 1 | 2 | 3 | 4 | 5 | 6,
                })
                .run()
            }
            className={`btn btn-xs ${
              editor.isActive('heading', {
                level: lv,
              })
                ? 'btn-active'
                : ''
            }`}
          >
            {`H${lv}`}
          </button>
        ))}
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn btn-xs">
          Bullet list
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="btn btn-xs">
          Ordered list
        </button>
      </FloatingMenu>

      <BubbleMenu className="btn-group" editor={editor} tippyOptions={{ duration: 100 }}>
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`btn btn-xs ${editor.isActive('bold') ? 'btn-active' : ''} font-bold`}>
          Bold
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`btn btn-xs ${editor.isActive('italic') ? 'btn-active' : ''} italic`}>
          Italic
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`btn btn-xs ${editor.isActive('strike') ? 'btn-active' : ''}`}>
          Strike
        </button>
      </BubbleMenu>

      <div className="collapse collapse-arrow">
        <input type="checkbox" defaultChecked={true} />
        <div className="collapse-title rounded bg-base-100 text-sm font-bold">Notes</div>
        <div className="collapse-content">
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
};
