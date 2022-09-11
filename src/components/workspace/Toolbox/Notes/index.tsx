import { DocumentDownloadIcon } from '@heroicons/react/solid';
import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { Placeholder } from '@tiptap/extension-placeholder';
import { BubbleMenu, EditorContent, FloatingMenu, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useContext } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Client } from '@/models/Client';
import { invertColor } from '@/utils/Helpers';

type EditorProps = {
  store: MappedTypeDescription<any>;
  client: Client;
};

export function NotesDialog({ store, client }: EditorProps) {
  const { teamState } = useContext(StoreContext);
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'textarea textarea-accent border-2 focus:outline-none prose max-w-full h-96',
      },
    },
    onUpdate: (props) => {
      teamState.metadata.notes = props.editor.getText();
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
        provider: client.provider,
        user: client.clientInfo.user,
        render: (user) => {
          const cursor = document.createElement('span');

          cursor.classList.add('collaboration-cursor__caret');
          cursor.setAttribute('style', `border-color: ${user.color}`);

          const label = document.createElement('div');

          label.classList.add('collaboration-cursor__label');
          label.style.color = invertColor(user.color);
          label.style.backgroundColor = user.color;
          label.insertBefore(document.createTextNode(user.name), null);
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

      <input type="checkbox" id="notes-modal" className="modal-toggle" />
      <div className="modal modal-bottom">
        <div className="modal-box">
          <h3 className="text-lg font-bold">Notes</h3>
          <EditorContent editor={editor} />
          <div className="modal-action">
            <label htmlFor="notes-modal" className="btn btn-sm">
              Hide
            </label>
          </div>
        </div>
      </div>
    </>
  );
}

function NotesToggler() {
  return (
    <label htmlFor="notes-modal" className="modal-button rounded" title="Export this team to Showdown paste">
      <DocumentDownloadIcon className="h-4 w-4 md:h-6 md:w-6" />
      <span>Notes</span>
    </label>
  );
}

export default NotesToggler;
