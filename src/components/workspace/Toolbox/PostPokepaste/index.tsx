import { PaperAirplaneIcon } from '@heroicons/react/solid';
import { useContext } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { Pokemon } from '@/models/Pokemon';

function PostPokepaste() {
  const { teamState } = useContext(StoreContext);
  const { title, author, notes } = teamState.metadata;
  return (
    <form className="inline text-left" method="post" action="https://pokepast.es/create" target="_blank">
      <input type="hidden" name="title" value={title} />
      <input type="hidden" name="paste" value={Pokemon.convertTeamToPaste(teamState.team)} />
      <input type="hidden" name="author" value={author} />
      <input type="hidden" name="notes" value={notes} />
      <button type="submit" className="rounded" title="Upload the current team to PokéPaste">
        <PaperAirplaneIcon className="mr-3 inline-block h-4 w-4 md:h-6 md:w-6" />
        <span>PokéPaste</span>
      </button>
    </form>
  );
}

export default PostPokepaste;
