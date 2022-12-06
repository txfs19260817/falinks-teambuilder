import { ItemName } from '@pkmn/data';
import { Icons } from '@pkmn/img';
import { useTranslation } from 'next-i18next';

export const ItemIcon = ({ itemName }: { itemName: ItemName | string }) => {
  const { t } = useTranslation(['items']);
  return <span title={t(`items.${itemName.toLocaleLowerCase()}`)} style={Icons.getItem(itemName).css} />;
};
