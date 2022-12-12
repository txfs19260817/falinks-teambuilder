import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { Placeholder } from '@tiptap/extension-placeholder';
import { BubbleMenu, EditorContent, FloatingMenu, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useContext } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { AppConfig } from '@/utils/AppConfig';
import { invertColor } from '@/utils/Helpers';

type EditorProps = {
  store: MappedTypeDescription<any>;
  provider: any;
  user: Record<string, any>;
};

export function NotesDialog({ store, provider, user }: EditorProps) {
  const { teamState } = useContext(StoreContext);
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'textarea textarea-accent border-2 focus:outline-none prose max-w-full h-96',
      },
    },
    onUpdate: (props) => {
      teamState.updateNotes(props.editor.getText()); // set the notes to metadata
    },
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: '……',
      }),
      Collaboration.configure({
        fragment: store.notes,
      }),
      CollaborationCursor.configure({
        provider,
        user,
        render: (u) => {
          const cursor = document.createElement('span');

          cursor.classList.add('collaboration-cursor__caret');
          cursor.setAttribute('style', `border-color: ${u.color}`);

          const label = document.createElement('div');

          label.classList.add('collaboration-cursor__label');
          label.style.color = invertColor(u.color);
          label.style.backgroundColor = u.color;
          label.insertBefore(document.createTextNode(u.name), null);
          cursor.insertBefore(label, null);

          return cursor;
        },
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
            className={`btn-xs btn ${
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
        <button onClick={() => editor.chain().focus().toggleBulletList().run()} className="btn-xs btn">
          Bullet list
        </button>
        <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className="btn-xs btn">
          Ordered list
        </button>
      </FloatingMenu>

      <BubbleMenu className="btn-group" editor={editor} tippyOptions={{ duration: 100 }}>
        <button onClick={() => editor.chain().focus().toggleBold().run()} className={`btn-xs btn ${editor.isActive('bold') ? 'btn-active' : ''} font-bold`}>
          <span className="font-bold">B</span>
        </button>
        <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`btn-xs btn ${editor.isActive('italic') ? 'btn-active' : ''} italic`}>
          <span className="italic">I</span>
        </button>
        <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`btn-xs btn ${editor.isActive('strike') ? 'btn-active' : ''}`}>
          <span className="line-through">S</span>
        </button>
      </BubbleMenu>

      <input type="checkbox" id={AppConfig.toolboxIDs.notesModal} className="modal-toggle" />
      <div className="modal modal-bottom">
        <div className="modal-box">
          <label htmlFor={AppConfig.toolboxIDs.notesModal} className="btn-sm btn-circle btn absolute right-2 top-2">
            ✕
          </label>
          <h3 className="text-lg font-bold">📝 Notes</h3>
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
}
