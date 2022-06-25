import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { BubbleMenu, EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useContext } from 'react';

import { StoreContext, StoreContextType } from '@/components/workspace/Contexts/StoreContext';
import WebrtcProviders from '@/store/webrtcProviders';

const colors = ['#958DF1', '#F98181', '#FBBC88', '#FAF594', '#70CFF8', '#94FADB', '#B9F18D'];
const names = ['Lea Thompson', 'Cyndi Lauper', 'Tom Cruise', 'Madonna'];

const getRandomElement = (list: string[]) => list[Math.floor(Math.random() * list.length)];
const getRandomColor = () => getRandomElement(colors);
const getRandomName = () => getRandomElement(names);
export const NoteEditor = ({ teamStore }: { teamStore: MappedTypeDescription<StoreContextType> }) => {
  const { teamState } = useContext(StoreContext);
  const { roomName } = teamState.metadata;
  const editor = useEditor({
    editorProps: {
      attributes: {
        class: 'textarea textarea-accent focus:outline-none',
        placeholder: 'Write something …',
      },
    },
    extensions: [
      StarterKit,
      Collaboration.configure({
        fragment: teamStore.notes,
      }),
      CollaborationCursor.configure({
        provider: WebrtcProviders.getOrCreateProvider(roomName || '', teamStore),
        user: { name: getRandomName(), color: getRandomColor() },
      }),
    ],
  });

  if (!editor) {
    return null;
  }

  return (
    <>
      <BubbleMenu className="btn-group" tippyOptions={{ duration: 100 }} editor={editor}>
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

      <div className="form-control rounded bg-base-300">
        <label className="label">
          <span className="label-text font-bold">Notes</span>
        </label>
        <EditorContent editor={editor} />
      </div>
    </>
  );
};
