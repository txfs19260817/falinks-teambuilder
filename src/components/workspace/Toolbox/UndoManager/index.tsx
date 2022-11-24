import { useContext } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { AppConfig } from '@/utils/AppConfig';

function UndoButton() {
  const { teamState } = useContext(StoreContext);
  return (
    <button
      id={AppConfig.toolboxIDs.undoButton}
      className="btn-ghost btn font-medium normal-case"
      onClick={() => {
        teamState.teamUndo();
      }}
    >
      <span>↩️</span>
      <span>Undo</span>
    </button>
  );
}

function RedoButton() {
  const { teamState } = useContext(StoreContext);
  return (
    <button
      id={AppConfig.toolboxIDs.redoButton}
      className="btn-ghost btn font-medium normal-case"
      onClick={() => {
        teamState.teamRedo();
      }}
    >
      <span>↪️</span>
      <span>Redo</span>
    </button>
  );
}

export { RedoButton, UndoButton };
