import { MappedTypeDescription } from '@syncedstore/core/types/doc';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { Placeholder } from '@tiptap/extension-placeholder';
import { BubbleMenu, EditorContent, FloatingMenu, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

import { BaseProvider } from '@/providers/baseProviders';
import { invertColor } from '@/utils/Helpers';

type EditorProps = {
  store: MappedTypeDescription<any>;
  provider: BaseProvider;
};

const names = [
  'alligator',
  'anteater',
  'armadillo',
  'auroch',
  'axolotl',
  'badger',
  'bat',
  'bear',
  'beaver',
  'blobfish',
  'buffalo',
  'camel',
  'chameleon',
  'cheetah',
  'chipmunk',
  'chinchilla',
  'chupacabra',
  'cormorant',
  'coyote',
  'crow',
  'dingo',
  'dinosaur',
  'dog',
  'dolphin',
  'dragon',
  'duck',
  'dumbo octopus',
  'elephant',
  'ferret',
  'fox',
  'frog',
  'giraffe',
  'goose',
  'gopher',
  'grizzly',
  'hamster',
  'hedgehog',
  'hippo',
  'hyena',
  'jackal',
  'jackalope',
  'ibex',
  'ifrit',
  'iguana',
  'kangaroo',
  'kiwi',
  'koala',
  'kraken',
  'lemur',
  'leopard',
  'liger',
  'lion',
  'llama',
  'manatee',
  'mink',
  'monkey',
  'moose',
  'narwhal',
  'nyan cat',
  'orangutan',
  'otter',
  'panda',
  'penguin',
  'platypus',
  'python',
  'pumpkin',
  'quagga',
  'quokka',
  'rabbit',
  'raccoon',
  'rhino',
  'sheep',
  'shrew',
  'skunk',
  'slow loris',
  'squirrel',
  'tiger',
  'turtle',
  'unicorn',
  'walrus',
  'wolf',
  'wolverine',
  'wombat',
];
const getRandomElement = (list: string[]) => list[Math.floor(Math.random() * list.length)];
const getRandomColor = () =>
  `#${Math.floor(Math.random() * 0x1000000)
    .toString(16)
    .padStart(6, '0')}`;
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
        user: { name: `Anonymous ${getRandomName()}`, color: getRandomColor() },
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

      <div className="collapse collapse-arrow">
        <input type="checkbox" defaultChecked={true} />
        <div className="collapse-title rounded bg-base-100 text-sm font-bold">Notes (Click to hide)</div>
        <div className="collapse-content">
          <EditorContent editor={editor} />
        </div>
      </div>
    </>
  );
};
