import { useTranslation } from 'next-i18next';
import { useContext } from 'react';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { AppConfig } from '@/utils/AppConfig';

function UndoButton() {
  const { t } = useTranslation(['room']);
  const { teamState } = useContext(StoreContext);
  return (
    <button
      id={AppConfig.toolboxIDs.undoButton}
      className="btn-ghost btn font-medium normal-case"
      title={t('room.toolbox.undo-btn.description')}
      onClick={() => {
        teamState.teamUndo();
      }}
    >
      <span>↩️</span>
      <span>{t('room.toolbox.undo-btn.text')}</span>
    </button>
  );
}

function RedoButton() {
  const { t } = useTranslation(['room']);
  const { teamState } = useContext(StoreContext);
  return (
    <button
      id={AppConfig.toolboxIDs.redoButton}
      className="btn-ghost btn font-medium normal-case"
      title={t('room.toolbox.redo-btn.description')}
      onClick={() => {
        teamState.teamRedo();
      }}
    >
      <span>↪️</span>
      <span>{t('room.toolbox.redo-btn.text')}</span>
    </button>
  );
}

export { RedoButton, UndoButton };
