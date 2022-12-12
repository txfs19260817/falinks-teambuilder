import { useTranslation } from 'next-i18next';
import { useContext } from 'react';
import { toast } from 'react-hot-toast';

import { StoreContext } from '@/components/workspace/Contexts/StoreContext';
import { AppConfig } from '@/utils/AppConfig';

function ShareLink() {
  const { t } = useTranslation(['room']);
  const { teamState } = useContext(StoreContext);
  return (
    <button
      id={AppConfig.toolboxIDs.shareLink}
      className="rounded"
      title={t('room.toolbox.share-link-btn.description')}
      onClick={() => {
        const url = window.location.href;
        try {
          navigator.share({
            url,
            title: `[${AppConfig.title}] ${teamState.title}`,
          });
        } catch (e) {
          navigator.clipboard.writeText(url).then(() => toast(t('common.copiedToClipboard')));
        }
      }}
    >
      <span>🔗</span>
      <span>{t('room.toolbox.share-link-btn.text')}</span>
    </button>
  );
}

export default ShareLink;
